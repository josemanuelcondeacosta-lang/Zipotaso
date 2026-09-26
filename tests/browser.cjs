// npm run test:browser. Variables opcionales: PUPPETEER_MODULE y CHROME_PATH.
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const puppeteer = require(process.env.PUPPETEER_MODULE || 'puppeteer');
const root = path.resolve(__dirname,'..');
const server = http.createServer(async(req,res)=>{
  const file = path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname.replace(/\/$/,'/index.html'));
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  try{
    const data = await fs.readFile(file);
    res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.webp':'image/webp','.html':'text/html; charset=utf-8'})[path.extname(file)]||'text/plain');
    res.end(data);
  }catch{res.writeHead(404).end();}
});
let browser;
const failures = [];
let checks = 0;
async function check(name, fn){console.log('RUN '+name);await fn();checks++;console.log('PASS '+name);}
async function closePanel(page){
  await page.click('.panel.show .x');
  await page.waitForFunction(()=>!document.querySelector('.panel.show'));
}
async function openProduct(page,index=0){
  await page.evaluate(i=>document.querySelectorAll('.prod')[i].click(),index);
  await page.waitForSelector('#pProd.show');
  await page.waitForFunction(()=>document.querySelector('#ppAgregar').getBoundingClientRect().bottom<=innerHeight);
}
async function addProduct(page,index=0,note=''){
  await openProduct(page,index);
  await page.$eval('#ppNota',(el,value)=>el.value=value,note);
  await page.click('#ppAgregar');
  await page.waitForFunction(()=>!document.querySelector('.panel.show'));
}
async function cart(page){await page.click('#fab');await page.waitForSelector('#pCarro.show');await page.waitForFunction(()=>document.querySelector('#enviar').getBoundingClientRect().bottom<=innerHeight);}
async function field(page,id,value){
  await page.$eval(id,(el,value)=>{el.value=value;el.dispatchEvent(new Event('input',{bubbles:true}));},value);
}
async function radio(page,name,value){
  await page.evaluate((name,value)=>document.querySelector(`input[name="${name}"][value="${value}"]`).click(),name,value);
}
async function submit(page){await page.evaluate(()=>document.querySelector('#pCarro').requestSubmit());}
async function newPage(context, url, width=390){
  const page = await context.newPage();
  page.on('dialog',async dialog=>{failures.push('Unexpected dialog: '+dialog.message());await dialog.dismiss();});
  page.on('pageerror',e=>failures.push(e.message));
  await page.setViewport({width,height:812,isMobile:width<768,hasTouch:width<768});
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
  await page.setRequestInterception(true);
  page.on('request',req=>req.url().startsWith(url)?req.continue():req.abort());
  await page.goto(url,{waitUntil:'networkidle0'});
  if(await page.$eval('#bienv',el=>!el.classList.contains('hide'))) await page.click('#entrar');
  await page.evaluate(()=>{window.sent=[];window.open=url=>{window.sent.push(url);return null;};});
  return page;
}

(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const url = `http://127.0.0.1:${server.address().port}/`;
  browser = await puppeteer.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
  for(const width of [320,375,390,768,1280]){
    const context = await browser.createBrowserContext();
    const page = await newPage(context,url,width);
    await check(`navegación y paneles a ${width}px`,async()=>{
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
      for(let i=0;i<3;i++){
        await page.evaluate(i=>document.querySelectorAll('.chip')[i].click(),i);
        try{ await page.waitForFunction(i=>document.querySelectorAll('.chip')[i].getAttribute('aria-current')==='true',{timeout:5000},i); }
        catch(error){ console.error('category',i,failures,await page.evaluate(()=>({y:scrollY,bar:document.querySelector('.barra').getBoundingClientRect().bottom,active:document.querySelector('.chip.on')?.textContent,sections:[...document.querySelectorAll('.cat')].map(el=>[el.id,el.getBoundingClientRect().top])})));throw error; }
      }
      const y=await page.evaluate(()=>scrollY);
      await openProduct(page,13);
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(()=>document.querySelector('#pProd').contains(document.activeElement)),true);
      await closePanel(page);
      assert.ok(Math.abs(await page.evaluate(()=>scrollY)-y)<2);
      await addProduct(page);
      await cart(page);
      assert.equal(await page.evaluate(()=>document.querySelector('#pCarro .cuerpo').scrollWidth<=document.querySelector('#pCarro .cuerpo').clientWidth),true);
      await page.goBack();
      await page.waitForFunction(()=>!document.querySelector('.panel.show'));
      await page.goForward();
      await page.waitForSelector('#pCarro.show');
      await closePanel(page);
    });
    await context.close();
  }
  const context = await browser.createBrowserContext();
  const page = await newPage(context,url);
  await check('todos los productos: nombre, precio, cantidad inicial y cierre',async()=>{
    const count = await page.$$eval('.prod',els=>els.length);
    for(let i=0;i<count;i++){
      await openProduct(page,i);
      const data = await page.evaluate(i=>({name:document.querySelectorAll('.prod h3')[i].textContent,title:document.querySelector('#ppNombre').textContent,disabled:document.querySelector('#ppMenos').disabled,quantity:document.querySelector('#ppCant').textContent}),i);
      assert.equal(data.name,data.title);assert.equal(data.disabled,true);assert.equal(data.quantity,'1');
      await page.keyboard.press('Escape');
      await page.waitForFunction(()=>!document.querySelector('.panel.show'));
    }
  });
  await check('búsqueda por categoría, acentos, palabras separadas y sin resultados',async()=>{
    for(const [query,expected] of [['salchipapa',7],['  LA   CLASICA ',1],['zzzzz',0],['',14]]){
      await field(page,'#buscar',query);
      assert.equal(await page.$$eval('.prod:not([hidden])',els=>els.length),expected,query);
    }
  });
  await check('productos repetidos, notas independientes y HTML como texto',async()=>{
    await addProduct(page,1);
    await addProduct(page,1);
    await addProduct(page,1,'<img src=x onerror=alert(1)> & sin cebolla');
    await cart(page);
    assert.equal(await page.$$eval('#lista .item',els=>els.length),2);
    assert.equal(await page.$eval('#fabN',el=>el.textContent),'3');
    assert.equal(await page.$$eval('#lista .t img',els=>els.length),0);
    await page.click('#lista .item .mini button:last-child');
    assert.equal(await page.evaluate(()=>document.activeElement.dataset.action),'plus');
    assert.equal(await page.$eval('#fabN',el=>el.textContent),'4');
    await page.click('#lista .item .mini button:first-child');
    assert.equal(await page.evaluate(()=>document.activeElement.dataset.action),'minus');
  });
  await check('validación, totales y mensaje WhatsApp sin enviar mensajes reales',async()=>{
    await submit(page);assert.equal(await page.evaluate(()=>document.activeElement.id),'cNombre');
    await field(page,'#cNombre','Ana');await field(page,'#cTel','abc');
    await submit(page);assert.equal(await page.evaluate(()=>document.activeElement.id),'cTel');
    await field(page,'#cTel','3001234567');await submit(page);
    assert.equal(await page.evaluate(()=>document.activeElement.id),'cDir');
    await field(page,'#cDir','Calle 10 # 2-3');await field(page,'#cVuelto','1.000');
    await submit(page);assert.equal(await page.evaluate(()=>document.activeElement.id),'cVuelto');
    await field(page,'#cVuelto','100.000');
    assert.equal(await page.$eval('#tTot',el=>el.textContent),'$77.500');
    await submit(page);await submit(page);
    assert.equal(await page.evaluate(()=>window.sent.length),1,'doble envío');
    const target = new URL(await page.evaluate(()=>window.sent[0]));
    assert.equal(target.hostname,'wa.me');
    assert.match(target.searchParams.get('text'),/Total: \$77\.500/);
    assert.match(target.searchParams.get('text'),/paga con \$100\.000/);
    assert.equal(await page.$eval('#estadoEnvio',el=>el.hidden),false);
    assert.equal(await page.$eval('#continuarWa',el=>el.href),target.href);
    assert.equal(await page.$eval('#fabN',el=>el.textContent),'3','el pedido se conserva');
    await radio(page,'entrega','recoger');await radio(page,'pago','Transferencia');
    assert.equal(await page.$eval('#tTot',el=>el.textContent),'$73.500');
    assert.equal(await page.$eval('#cDir',el=>el.disabled),true);
    assert.equal(await page.$eval('#cVuelto',el=>el.disabled),true);
    assert.equal(await page.$eval('#estadoEnvio',el=>el.hidden),true);
    await page.waitForFunction(()=>!document.querySelector('#enviar').disabled);
    await field(page,'#cDir','');await submit(page);
    const pickup = new URL(await page.evaluate(()=>window.sent.at(-1))).searchParams.get('text');
    assert.match(pickup,/Recoge en el local/);assert.ok(!pickup.includes('paga con'));
  });
  await check('recarga conserva cliente, carrito, entrega y pago',async()=>{
    await page.reload({waitUntil:'networkidle0'});await cart(page);
    assert.equal(await page.$eval('#cNombre',el=>el.value),'Ana');
    assert.equal(await page.$eval('input[name="entrega"]:checked',el=>el.value),'recoger');
    assert.equal(await page.$eval('input[name="pago"]:checked',el=>el.value),'Transferencia');
    assert.equal(await page.$eval('#fabN',el=>el.textContent),'3');
    await closePanel(page);
  });
  await check('cantidades máximas y prevención de doble clic al agregar',async()=>{
    await openProduct(page,13);
    await page.evaluate(()=>{for(let i=0;i<120;i++) document.querySelector('#ppMas').click();});
    assert.equal(await page.$eval('#ppCant',el=>el.textContent),'99');
    assert.equal(await page.$eval('#ppMas',el=>el.disabled),true);
    await page.evaluate(()=>{document.querySelector('#ppAgregar').click();document.querySelector('#ppAgregar').click();});
    await page.waitForFunction(()=>!document.querySelector('.panel.show'));
    await openProduct(page,13);await page.click('#ppAgregar');
    assert.equal(await page.$eval('#ppError',el=>el.hidden),false);
    await closePanel(page);
  });
  await check('sincronización entre pestañas y eliminación del último producto',async()=>{
    const other = await newPage(context,url);
    console.log('  segunda pestaña lista');
    await other.evaluate(()=>localStorage.setItem('zipote-carro',JSON.stringify([{n:'Sencillo',tam:'',nota:'',c:1,p:1}])));
    await page.bringToFront();
    await page.waitForFunction(()=>document.querySelector('#fabN').textContent==='1');
    await cart(page);
    assert.equal(await page.$eval('#tSub',el=>el.textContent),'$10.000');
    await page.click('#lista .mini button');
    await page.waitForFunction(()=>!document.querySelector('.panel.show'));
    assert.equal(await page.$eval('#fab',el=>el.classList.contains('show')),false);
    assert.equal(await page.evaluate(()=>document.activeElement.id),'inicioMenu');
    await other.close();
  });
  await check('datos guardados inválidos y productos eliminados no rompen la página',async()=>{
    for(const value of ['{','{}','null',JSON.stringify([{n:'Eliminado',c:1,p:123},{n:'Sencillo',tam:'',nota:'',c:-2,p:1}])]){
      await page.evaluate(value=>localStorage.setItem('zipote-carro',value),value);
      await page.reload({waitUntil:'networkidle0'});
      assert.equal(await page.$eval('#fabN',el=>el.textContent),'0');
    }
  });
  await check('teclado, fondo, Enter y pantalla de poca altura',async()=>{
    await addProduct(page,1);await cart(page);
    await page.keyboard.down('ShiftLeft');await page.keyboard.press('Tab');await page.keyboard.up('ShiftLeft');
    assert.equal(await page.evaluate(()=>document.activeElement.id),'enviar');
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(()=>document.activeElement.classList.contains('x')),true);
    await page.setViewport({width:390,height:420,isMobile:true,hasTouch:true});
    await page.waitForFunction(()=>document.querySelector('#pCarro').getBoundingClientRect().height<=innerHeight);
    await page.evaluate(()=>{window.sent=[];window.open=url=>{window.sent.push(url);return null;};});
    await page.focus('#cNombre');await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(()=>window.sent.length),1);
    await page.evaluate(()=>document.querySelector('#velo').click());
    await page.waitForFunction(()=>!document.querySelector('.panel.show'));
    await page.setViewport({width:390,height:812,isMobile:true,hasTouch:true});
  });
  await check('desplazamiento animado termina en la categoría seleccionada',async()=>{
    await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);
    await page.evaluate(()=>document.querySelectorAll('.chip')[1].click());
    await page.waitForFunction(()=>document.querySelectorAll('.chip')[1].getAttribute('aria-current')==='true');
    await page.waitForFunction(()=>{const y=scrollY;window.stableScroll=window.lastScroll===y?(window.stableScroll||0)+1:0;window.lastScroll=y;return window.stableScroll>=5;},{polling:100});
    assert.equal(await page.$eval('.chip.on',el=>el.dataset.to),'salchipapas');
  });
  await context.close();
  await check('almacenamiento bloqueado permite comprar y avisa de la limitación',async()=>{
    const privateContext = await browser.createBrowserContext();
    const p = await privateContext.newPage();
    p.on('pageerror',e=>failures.push(e.message));
    await p.evaluateOnNewDocument(()=>{for(const key of ['localStorage','sessionStorage']) Object.defineProperty(window,key,{get(){throw new Error('Blocked');}});});
    await p.goto(url,{waitUntil:'networkidle0'});await p.click('#entrar');await addProduct(p);await cart(p);
    assert.equal(await p.$eval('#avisoStorage',el=>el.hidden),false);
    assert.equal(await p.$eval('#fabN',el=>el.textContent),'1');
    await privateContext.close();
  });
  assert.deepEqual(failures,[],'errores JavaScript');
  console.log(`\n${checks} grupos de pruebas completos; sin errores JavaScript.`);
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>{if(browser) await browser.close();server.close();});
