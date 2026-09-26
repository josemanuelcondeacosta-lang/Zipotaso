/* ===== CONFIGURACIÓN: edita aquí los datos de tu restaurante ===== */
const CONFIG = {
  whatsapp: "573046552807",          // número con indicativo, sin + ni espacios
  instagram: "https://instagram.com/zipotefood",
  direccion: "Cra. 64B #48-54, barrio Modelo, Barranquilla, Atlántico",
  portada: "assets/portada.jpg",       // foto de portada (si no existe, no se muestra)
  costoDomicilio: 4000,
  // 0=Domingo … 6=Sábado. Horas en formato 24h; si cierra después de medianoche usa >24 (26 = 2:00 am)
  horario: {0:[17.5,24],1:[17.5,24],2:[17.5,24],3:[17.5,24],4:[17.5,24],5:[17.5,26],6:[17.5,26]},
  horarioTexto: "Dom a Jue 5:30 pm – 12:00 am · Vie y Sáb 5:30 pm – 2:00 am"
};

/* ===== MENÚ: cambia nombres, descripciones y precios ===== */
const MENU = [
  {cat:"Los más pedidos", items:[
    {n:"La Zipotera", d:"Pollo, cerdo, chorizo, butifarra, costillas BBQ, gratinado, maíz y papa. Para 4-5 personas.", p:89000, img:"assets/platos/la-zipotera.png", top:true},
    {n:"Perro Zipote", d:"Doble salchicha, pollo desmechado, tocineta, mozzarella, papita chongo y salsa de la casa.", p:22000, img:"assets/platos/perro-zipote.jpg", top:true},
    {n:"Burger Vueltiao", d:"Carne 150 g, queso costeño asado, suero, tocineta, cebolla caramelizada y papas.", p:26000, img:"assets/platos/burger-vueltiao.jpg", top:true}
  ]},
  {cat:"Perros calientes", items:[
    {n:"Sencillo", d:"Salchicha, lechuga, queso costeño, papita chongo y salsa tártara.", p:10000, img:"assets/platos/sencillo.jpg"},
    {n:"Suizo", d:"Salchicha suiza, mozzarella, papita chongo, lechuga y queso costeño.", p:17000, img:"assets/platos/suizo.jpg"},
    {n:"Trifásico", d:"Pollo, cerdo, chorizo, butifarra, queso costeño, mozzarella y tártara.", p:20000, img:"assets/platos/trifasico.jpg?v=2"},
    {n:"Perro Zipote", d:"Doble salchicha, pollo desmechado, tocineta, mozzarella, papita chongo y salsa de la casa.", p:22000, img:"assets/platos/perro-zipote.jpg"}
  ]},
  {cat:"Hamburguesas", items:[
    {n:"Clásica", d:"Carne, queso, lechuga, tomate y papas.", p:19500, img:"assets/platos/clasica.jpg"},
    {n:"Burger Vueltiao", d:"Carne 150 g, queso costeño asado, suero, tocineta, cebolla caramelizada y papas.", p:26000, img:"assets/platos/burger-vueltiao.jpg"},
    {n:"Crispy Pollo", d:"Pollo apanado, cheddar, tocineta y papas fritas.", p:24000, img:"assets/platos/crispy-pollo.jpg"},
    {n:"Doble Carne", d:"Dos carnes, doble cheddar, tocineta, aros de cebolla y papas.", p:24500, img:"assets/platos/doble-carne.jpg"}
  ]},
  {cat:"Salchipapas", items:[
    {n:"Sencilla", d:"Papas, salchicha, papita chongo, lechuga y tártara.", p:17500, img:"assets/platos/sencilla.jpg"},
    {n:"Salchipollo", d:"Papas, salchicha, pollo, lechuga, chongo y tártara.", p:19000, img:"assets/platos/salchipollo.jpg"},
    {n:"Mixta", d:"Papas, pollo, cerdo, chorizo y butifarra.", p:29000, img:"assets/platos/mixta.jpg"},
    {n:"La Zipotera", d:"Pollo, cerdo, chorizo, butifarra, costillas BBQ, gratinado, maíz y papa. Para 4-5 personas.", p:89000, img:"assets/platos/la-zipotera.png"}
  ]},
  {cat:"Patacones y mazorcadas", items:[
    {n:"Patacón de pollo", d:"Patacón, pollo, gratinado, tocineta, lechuga y costeño.", p:26000, img:"assets/platos/patacon-de-pollo.jpg"},
    {n:"Patacón mixto", d:"Patacón, pollo, cerdo, chorizo, butifarra y gratinado.", p:28000, img:"assets/platos/patacon-mixto.jpg"},
    {n:"Mazorcada de pollo", d:"Maíz desgranado, pollo, gratinado, lechuga, chongo y costeño.", p:28000, img:"assets/platos/mazorcada-de-pollo.jpg"}
  ]},
  {cat:"Asados", items:[
    {n:"Pechuga asada", d:"Pechuga, ensalada y papas o bollo.", p:30000, img:"assets/platos/pechuga-asada.jpg"},
    {n:"Punta gorda", d:"Carne asada, papas y ensalada.", p:36000, img:"assets/platos/punta-gorda.jpg"},
    {n:"Costillas BBQ", d:"Costillas de cerdo, papas y ensalada.", p:33000, img:"assets/platos/costillas-bbq.jpg"}
  ]},
  {cat:"Bebidas", items:[
    {n:"Limonada de coco", d:"", p:12000, img:"assets/platos/limonada-de-coco.jpg"},
    {n:"Jugo natural", d:"Mango, mora, maracuyá o lulo. Dilo en la indicación.", p:8000, img:"assets/platos/jugo-natural.jpg"},
    {n:"Gaseosa 400 ml", d:"", p:4000, img:"assets/platos/gaseosa-400-ml.jpg"},
    {n:"Agua", d:"", p:3000, img:"assets/platos/agua.jpg"}
  ]},
  {cat:"Adicionales", items:[
    {n:"Porción de papas", d:"", p:7000, img:"assets/platos/porcion-de-papas.jpg"},
    {n:"Tocineta", d:"", p:5000, img:"assets/platos/tocineta.jpg"},
    {n:"Gratinado", d:"", p:6000, img:"assets/platos/gratinado.jpg"},
    {n:"Bollo", d:"", p:2500, img:"assets/platos/bollo.jpg"}
  ]}
];

/* ===== Lógica ===== */
const LOGO = "assets/logo-marca.webp"; // marca de agua para platos sin foto
const $ = s => document.querySelector(s);
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const Order = window.ZipoteOrder;
const fmt = Order.money;
const slug = s => Order.normalize(s).replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g, "");
function leer(storage, key){
  try{ return JSON.parse(window[storage].getItem(key)); }catch(e){ return null; }
}
function guardarDato(storage, key, value){
  try{ window[storage].setItem(key, JSON.stringify(value)); return true; }
  catch(e){
    $("#avisoStorage").hidden = false;
    return false;
  }
}
let carro = Order.restoreCart(leer("localStorage", "zipote-carro"), MENU);
const guardar = () => guardarDato("localStorage", "zipote-carro", carro);
function anunciar(message){ $("#anuncio").textContent = message; }

// Info
$("#direccion").textContent = CONFIG.direccion;
$("#horarioTxt").textContent = CONFIG.horarioTexto;
$("#lnkWa").href = "https://wa.me/" + CONFIG.whatsapp;
$("#lnkIg").href = CONFIG.instagram;
$("#lnkMaps").href = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(CONFIG.direccion + ", Colombia");
// Bienvenida: solo la primera vez en la sesión
const bienv = document.getElementById("bienv");
let visto = false; try{ visto = sessionStorage.getItem("zipote-bienv") === "1"; }catch(e){}
if(visto) bienv.classList.add("hide"); else document.body.style.overflow = "hidden";
document.getElementById("entrar").onclick = () => { bienv.classList.add("hide"); document.body.style.overflow = ""; try{ sessionStorage.setItem("zipote-bienv","1"); }catch(e){} };
if(CONFIG.portada){ const pt=$("#portada"); pt.onload=()=>pt.hidden=false; pt.src=CONFIG.portada; }

const abierto = () => Order.isOpen(CONFIG.horario);
function actualizarHorario(){
  const ab = abierto();
  $("#estado").classList.toggle("cerrado", !ab);
  $("#estado span").textContent = ab ? "Abierto ahora" : "Cerrado ahora · puedes dejar tu pedido listo";
  $("#avisoCerrado").style.display = ab ? "none" : "block";
}
actualizarHorario();
setInterval(actualizarHorario, 30000);
document.addEventListener("visibilitychange", () => { if(!document.hidden) actualizarHorario(); });

// Render menú
const menu = $("#menu"), chips = $("#chips");
MENU.forEach((c,ci) => {
  const id = slug(c.cat);
  const chip = document.createElement("button");
  chip.className = "chip" + (ci===0 ? " on" : ""); chip.textContent = c.cat; chip.dataset.to = id;
  chip.onclick = () => {
    $("#buscar").blur();
    document.getElementById(id).scrollIntoView({behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block:"start"});
    programarCategoria();
  };
  chips.appendChild(chip);
  const sec = document.createElement("section"); sec.className = "cat"; sec.id = id;
  sec.innerHTML = `<h2>${c.cat}</h2><div class="grid"></div>`;
  const grid = sec.querySelector(".grid");
  c.items.forEach(it => {
    const b = document.createElement("button"); b.className = "prod";
    const precio = it.tam ? "Desde " + fmt(Math.min(...Object.values(it.tam))) : fmt(it.p);
    const foto = it.img ? `<img src="${it.img}" alt="" loading="lazy" onerror="this.outerHTML='<span class=ph><img src=${LOGO} alt=></span>'">` : `<span class="ph"><img src="${LOGO}" alt=""></span>`;
    b.innerHTML = `<div class="foto">${foto}${it.top ? '<span class="tag">Popular</span>' : ''}</div>
      <div class="txt"><h3>${it.n}</h3>${it.d ? `<p>${it.d}</p>` : ''}<div class="pr"><span class="precio">${precio}</span><span class="mas" aria-hidden="true">+</span></div></div>`;
    b.setAttribute("aria-label", it.n + ", " + precio);
    b.dataset.q = Order.normalize(it.n + " " + it.d);
    b.onclick = () => abrirProd(it);
    grid.appendChild(b);
  });
  menu.appendChild(sec);
});

// El seguimiento de categorías solo desplaza la barra horizontal, nunca la página.
const barra = $(".barra");
let scrollFrame = 0;
function actualizarCategoria(){
  scrollFrame = 0;
  if(panelAbierto) return;
  const sections = [...menu.querySelectorAll(".cat")].filter(s => !s.hidden);
  let active = sections[0];
  const edge = barra.getBoundingClientRect().bottom + 32;
  for(const sec of sections){ if(sec.getBoundingClientRect().top <= edge) active = sec; }
  if(window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) active = sections.at(-1);
  let changed = false;
  chips.querySelectorAll(".chip").forEach(ch => {
    const on = ch.dataset.to === active?.id;
    if(on && !ch.classList.contains("on")) changed = true;
    ch.classList.toggle("on", on);
    if(on) ch.setAttribute("aria-current", "true"); else ch.removeAttribute("aria-current");
  });
  const on = chips.querySelector(".on");
  if(changed && on){
    const rect = on.getBoundingClientRect(), container = chips.getBoundingClientRect();
    chips.scrollLeft += rect.left - container.left - (container.width - rect.width)/2;
  }
}
function programarCategoria(){ if(!scrollFrame) scrollFrame = requestAnimationFrame(actualizarCategoria); }
window.addEventListener("scroll", programarCategoria, {passive:true});
window.addEventListener("resize", programarCategoria);
new ResizeObserver(() => {
  document.documentElement.style.setProperty("--barra-height", `${barra.offsetHeight + 12}px`);
  programarCategoria();
}).observe(barra);

// Búsqueda
$("#buscar").addEventListener("input", e => {
  const words = Order.normalize(e.target.value).split(" ").filter(Boolean);
  const menuTop = menu.getBoundingClientRect().top + window.scrollY - barra.offsetHeight;
  let total = 0;
  document.querySelectorAll(".cat").forEach(sec => {
    let vis = 0;
    const categoryMatch = Order.normalize(sec.querySelector("h2").textContent).includes(words.join(" "));
    sec.querySelectorAll(".prod").forEach(p => { const ok = categoryMatch || words.every(word => p.dataset.q.includes(word)); p.hidden = !ok; if(ok) vis++; });
    sec.hidden = !vis;
    chips.querySelector(`[data-to="${sec.id}"]`).hidden = !vis; total += vis;
  });
  $("#vacio").style.display = total ? "none" : "block";
  if(window.scrollY > menuTop) window.scrollTo({top:Math.max(0,menuTop), behavior:"instant"});
  anunciar(total ? `${total} opciones encontradas.` : "No encontramos ese plato.");
  programarCategoria();
});

// Paneles
let panelAbierto = null, focoAnterior = null, scrollAnterior = 0;
const historyToken = `${Date.now()}-${Math.random()}`;
let cerrando = false;
function ajustarPanelVisible(){
  if(!panelAbierto || !window.visualViewport) return;
  const viewport = window.visualViewport;
  if(viewport.scale !== 1) return;
  panelAbierto.style.maxHeight = `${Math.floor(viewport.height * .92)}px`;
  panelAbierto.style.bottom = `${Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)}px`;
}
window.visualViewport?.addEventListener("resize", ajustarPanelVisible);
window.visualViewport?.addEventListener("scroll", ajustarPanelVisible);
const fondo = [...document.querySelectorAll(".hero, main, footer, #fab")];
function aislar(dialog){ fondo.forEach(el => el.inert = !!dialog); }
bienv.inert = visto;
if(!visto){ aislar(bienv); $("#entrar").focus({preventScroll:true}); }
$("#entrar").addEventListener("click", () => {
  bienv.inert = true;
  aislar(null);
  $("#inicioMenu").focus({preventScroll:true});
});
document.querySelectorAll(".panel").forEach(p => p.inert = true);
function abrir(p, desdeHistorial = false){
  if(panelAbierto || cerrando) return;
  focoAnterior = document.activeElement;
  scrollAnterior = window.scrollY;
  panelAbierto = p;
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollAnterior}px`;
  document.body.style.width = "100%";
  document.body.style.overflow = "hidden";
  aislar(p);
  $("#velo").classList.add("show");
  p.inert = false;
  p.classList.add("show");
  ajustarPanelVisible();
  p.querySelector(".cuerpo").scrollTop = 0;
  p.querySelector(".x").focus({preventScroll:true});
  if(!desdeHistorial){
    try{
      // La posición del menú la restaura cerrarPanel, sin competir con el navegador.
      history.scrollRestoration = "manual";
      history.pushState({zipotePanel:p.id, zipoteToken:historyToken}, "");
    }catch(e){}
  }
}
function cerrar(){
  if(cerrando || !panelAbierto) return;
  if(history.state?.zipoteToken === historyToken){
    cerrando = true;
    history.back();
  }else cerrarPanel();
}
function cerrarPanel(){
  cerrando = false;
  if(!panelAbierto) return;
  panelAbierto.inert = true;
  panelAbierto.classList.remove("show");
  panelAbierto.style.maxHeight = "";
  panelAbierto.style.bottom = "";
  $("#velo").classList.remove("show");
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  document.body.style.overflow = "";
  panelAbierto = null;
  aislar(null);
  window.scrollTo({top:scrollAnterior, behavior:"instant"});
  const target = focoAnterior?.isConnected && focoAnterior.getClientRects().length ? focoAnterior : $("#inicioMenu");
  target.focus({preventScroll:true});
  programarCategoria();
}
window.addEventListener("popstate", e => {
  cerrarPanel();
  if(e.state?.zipoteToken !== historyToken) return;
  if(e.state.zipotePanel === "pProd" && actual) abrir($("#pProd"), true);
  else if(e.state.zipotePanel === "pCarro" && carro.length) abrir($("#pCarro"), true);
});
$("#velo").onclick = cerrar;
document.querySelectorAll("[data-cerrar]").forEach(b => b.onclick = cerrar);
document.addEventListener("keydown", e => {
  if(e.key === "Escape") cerrar();
  const dialog = panelAbierto || (!bienv.inert ? bienv : null);
  if(e.key !== "Tab" || !dialog) return;
  const focusable = [...dialog.querySelectorAll('button, input, textarea, a[href]')].filter(el => !el.disabled && el.getClientRects().length &&
    (el.type !== "radio" || el.checked));
  const first = focusable[0], last = focusable.at(-1);
  if(!dialog.contains(document.activeElement)){ e.preventDefault(); first.focus(); }
  else if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
  else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
});

// Producto
let actual = null, cant = 1;
function abrirProd(it){
  if(panelAbierto || cerrando) return;
  actual = it; cant = 1;
  $("#ppError").hidden = true;
  $("#ppNombre").textContent = it.n; $("#ppEmoji").innerHTML = it.img ? `<img src="${it.img}" alt="${it.n}" onerror="this.parentNode.style.display='none'">` : ""; $("#ppEmoji").style.display = it.img ? "" : "none";
  $("#ppDesc").textContent = it.d; $("#ppNota").value = ""; actualizarLimpiarNota(); $("#ppCant").textContent = 1;
  const t = $("#ppTamanos");
  if(it.tam){
    t.innerHTML = '<span class="lbl">Tamaño</span><div class="opc">' + Object.entries(it.tam).map(([k,v],i) =>
      `<label><input type="radio" name="tam" value="${k}" ${i===0?"checked":""}><span>${k}<br>${fmt(v)}</span></label>`).join("") + "</div>";
    t.querySelectorAll("input").forEach(i => i.onchange = precioBtn);
  } else t.innerHTML = "";
  precioBtn(); abrir($("#pProd"));
}
function precioUnit(){ if(!actual.tam) return actual.p; const s = document.querySelector('input[name="tam"]:checked'); return actual.tam[s.value]; }
function precioBtn(){
  $("#ppError").hidden = true;
  $("#ppAgregar").textContent = "Agregar " + fmt(precioUnit()*cant);
  $("#ppMenos").disabled = cant <= 1;
  $("#ppMas").disabled = cant >= Order.MAX_QUANTITY;
}
$("#ppMenos").onclick = () => { if(cant>1){ cant--; $("#ppCant").textContent = cant; precioBtn(); } };
$("#ppMas").onclick = () => { if(cant < Order.MAX_QUANTITY) cant++; $("#ppCant").textContent = cant; precioBtn(); };
$("#ppAgregar").onclick = () => {
  if(panelAbierto !== $("#pProd") || cerrando) return;
  const tam = actual.tam ? document.querySelector('input[name="tam"]:checked').value : "";
  const nota = Order.text($("#ppNota").value, Order.MAX_NOTE);
  const ex = carro.find(c => c.n === actual.n && c.tam === tam && c.nota === nota);
  if(ex){
    if(ex.c + cant > Order.MAX_QUANTITY){
      $("#ppError").textContent = `Puedes pedir hasta ${Order.MAX_QUANTITY} unidades por producto e indicación. Ya tienes ${ex.c} en el carrito.`;
      $("#ppError").hidden = false;
      return;
    }
    ex.c += cant;
  }else carro.push({n:actual.n, img:actual.img||"", tam, nota, p:precioUnit(), c:cant});
  anunciar(`${cant} unidades de ${actual.n} agregadas al pedido.`);
  guardar(); pintar(); cerrar();
};

// Carrito
const entrega = () => document.querySelector('input[name="entrega"]:checked').value;
const pago = () => document.querySelector('input[name="pago"]:checked').value;
function pintar(){
  const {count:n, subtotal:sub, shipping:env, total} = Order.totals(carro, entrega(), CONFIG.costoDomicilio);
  $("#fab").classList.toggle("show", n>0);
  $("#fabN").textContent = n; $("#fabT").textContent = fmt(sub);
  $("#tSub").textContent = fmt(sub); $("#tEnv").textContent = fmt(env); $("#tTot").textContent = fmt(total);
  $("#fab").setAttribute("aria-label", `Ver pedido: ${n} unidades, subtotal ${fmt(sub)}`);
  $("#enviar").disabled = !n || enviando;
  $("#filaEnvio").style.display = entrega()==="domicilio" ? "" : "none";
  $("#bloqueDir").style.display = entrega()==="domicilio" ? "" : "none";
  $("#bloqueVuelto").style.display = pago()==="Efectivo" ? "" : "none";
  $("#cDir").disabled = entrega() !== "domicilio";
  $("#cDir").required = entrega() === "domicilio";
  $("#cVuelto").disabled = pago() !== "Efectivo";
  const l = $("#lista");
  const focused = document.activeElement;
  const focusedRow = focused.closest?.(".item");
  const focusedKey = focusedRow?.dataset.key;
  const focusedAction = focused.dataset.action;
  const oldIndex = focusedRow ? [...l.children].indexOf(focusedRow) : -1;
  const oldScroll = $("#pCarro .cuerpo").scrollTop;
  if(!n){ l.innerHTML = '<p style="color:var(--suave)">Tu pedido está vacío. Agrega algo del menú.</p>'; return; }
  l.innerHTML = "";
  carro.forEach((c,i) => {
    const d = document.createElement("div"); d.className = "item";
    d.dataset.key = Order.key(c);
    d.innerHTML = `${c.img ? `<img class="e" src="${c.img}" alt="" onerror="this.remove()">` : ""}<div class="t"><b>${escapeHTML(c.n)}${c.tam?" ("+escapeHTML(c.tam)+")":""}</b>${c.nota?`<small>${escapeHTML(c.nota)}</small>`:""}<small>${fmt(c.p*c.c)}</small></div>
      <div class="mini"><button type="button" aria-label="Quitar uno">−</button><b>${c.c}</b><button type="button" aria-label="Agregar uno">+</button></div>`;
    const [m,p] = d.querySelectorAll("button");
    m.dataset.action = "minus"; p.dataset.action = "plus";
    m.setAttribute("aria-label", `Quitar una unidad de ${c.n}`);
    p.setAttribute("aria-label", `Agregar una unidad de ${c.n}`);
    p.disabled = c.c >= Order.MAX_QUANTITY;
    m.onclick = () => { c.c--; if(!c.c) carro.splice(i,1); guardar(); limpiarError(); pintar(); anunciar(`Pedido actualizado: ${Order.totals(carro, entrega(), CONFIG.costoDomicilio).count} unidades.`); if(!carro.length) cerrar(); };
    p.onclick = () => { if(c.c >= Order.MAX_QUANTITY) return; c.c++; guardar(); limpiarError(); pintar(); anunciar(`${c.c} unidades de ${c.n}.`); };
    l.appendChild(d);
  });
  if(focusedKey){
    const row = [...l.children].find(el => el.dataset.key === focusedKey) || l.children[Math.min(oldIndex, l.children.length-1)];
    const button = row?.querySelector(`[data-action="${focusedAction}"]:not(:disabled)`) || row?.querySelector("button:not(:disabled)");
    button?.focus({preventScroll:true});
    $("#pCarro .cuerpo").scrollTop = oldScroll;
  }
}
document.querySelectorAll('input[name="entrega"],input[name="pago"]').forEach(i => i.onchange = () => { limpiarError(); pintar(); guardarBorrador(); });
$("#fab").onclick = () => { limpiarError(); actualizarHorario(); if(carro.length) abrir($("#pCarro")); };

// Borrador de esta pestaña y datos recordados de pedidos anteriores.
let enviando = false;
function datosCliente(){
  return {nombre:Order.text($("#cNombre").value,80), tel:Order.text($("#cTel").value,30),
    dir:Order.text($("#cDir").value,240), vuelto:Order.text($("#cVuelto").value,20), entrega:entrega(), pago:pago()};
}
function guardarBorrador(){ guardarDato("sessionStorage", "zipote-borrador", datosCliente()); }
const cliente = leer("sessionStorage", "zipote-borrador") || leer("localStorage", "zipote-cliente") || {};
$("#cNombre").value = Order.text(cliente.nombre,80);
$("#cTel").value = Order.text(cliente.tel,30);
$("#cDir").value = Order.text(cliente.dir,240);
$("#cVuelto").value = Order.text(cliente.vuelto,20);
if(["domicilio","recoger"].includes(cliente.entrega)) document.querySelector(`input[name="entrega"][value="${cliente.entrega}"]`).checked = true;
if(["Efectivo","Transferencia"].includes(cliente.pago)) document.querySelector(`input[name="pago"][value="${cliente.pago}"]`).checked = true;

// Botón "×" para borrar de un toque lo que ya se haya escrito en un campo.
function envolverConLimpiar(campo, etiqueta){
  const wrap = document.createElement("div");
  wrap.className = "campo-wrap";
  campo.replaceWith(wrap);
  wrap.appendChild(campo);
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "limpiarCampo";
  btn.setAttribute("aria-label", "Borrar " + etiqueta);
  btn.textContent = "×";
  const actualizar = () => { btn.hidden = !campo.value; };
  actualizar();
  wrap.appendChild(btn);
  campo.addEventListener("input", actualizar);
  btn.addEventListener("click", () => {
    campo.value = "";
    campo.focus();
    campo.dispatchEvent(new Event("input", {bubbles:true}));
  });
  return actualizar;
}
envolverConLimpiar($("#cNombre"), "nombre");
envolverConLimpiar($("#cTel"), "teléfono");
envolverConLimpiar($("#cDir"), "dirección");
envolverConLimpiar($("#cVuelto"), "valor con el que pagas");
const actualizarLimpiarNota = envolverConLimpiar($("#ppNota"), "indicación");
function limpiarError(){
  $("#err").textContent = "";
  $("#err").style.display = "none";
  document.querySelectorAll('[aria-invalid="true"]').forEach(el => { el.removeAttribute("aria-invalid"); el.removeAttribute("aria-describedby"); });
}
function mostrarError(message, field){
  $("#err").textContent = message;
  $("#err").style.display = "block";
  if(field){
    const input = document.getElementById(field);
    input.setAttribute("aria-invalid", "true");
    input.setAttribute("aria-describedby", "err");
    input.focus({preventScroll:true});
    input.scrollIntoView({block:"center", behavior:"instant"});
  }else $("#err").scrollIntoView({block:"nearest"});
}
$("#pCarro").addEventListener("input", () => { limpiarError(); guardarBorrador(); });
$("#ppNota").addEventListener("input", () => { $("#ppError").hidden = true; });
$("#pCarro").addEventListener("submit", event => {
  event.preventDefault();
  if(enviando || cerrando) return;
  limpiarError();
  if(!carro.length){ mostrarError("Agrega un plato al pedido."); return; }
  const customer = datosCliente();
  const total = Order.totals(carro, customer.entrega, CONFIG.costoDomicilio).total;
  const error = Order.validateCustomer(customer, total);
  if(error){ mostrarError(error.message, error.field); return; }
  guardarDato("localStorage", "zipote-cliente", {nombre:customer.nombre, tel:customer.tel, dir:customer.dir});
  guardarBorrador();
  const url = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(Order.message(carro, customer, CONFIG.costoDomicilio, abierto()));
  // El enlace permanece disponible si el navegador bloquea la ventana nueva.
  $("#continuarWa").href = url;
  $("#estadoEnvio").hidden = false;
  enviando = true;
  $("#enviar").disabled = true;
  try{
    const tab = window.open(url, "_blank");
    if(tab) tab.opener = null;
  }catch(e){ /* El cliente puede usar el enlace de respaldo. */ }
  anunciar("Pedido preparado. Confirma el envío en WhatsApp.");
  setTimeout(() => { enviando = false; $("#enviar").disabled = !carro.length; }, 1500);
});
// Evita que un enlace ya preparado envíe una versión anterior del pedido.
function invalidarEnvio(){ $("#estadoEnvio").hidden = true; $("#continuarWa").removeAttribute("href"); }
$("#pCarro").addEventListener("input", invalidarEnvio);
$("#pCarro").addEventListener("click", e => { if(e.target.closest(".mini")) invalidarEnvio(); });
$("#ppAgregar").addEventListener("click", invalidarEnvio);
window.addEventListener("storage", event => {
  if(event.key !== "zipote-carro" && event.key !== null) return;
  carro = Order.restoreCart(leer("localStorage", "zipote-carro"), MENU);
  invalidarEnvio();
  limpiarError();
  pintar();
  if(!carro.length && panelAbierto === $("#pCarro")) cerrar();
  anunciar("Pedido actualizado desde otra pestaña.");
});
pintar();
guardar();
