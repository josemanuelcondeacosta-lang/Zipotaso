const {test} = require('node:test');
const assert = require('node:assert/strict');
const O = require('../order.js');
const menu = [{cat:'Platos',items:[{n:'Pollo',p:20000,img:'pollo.jpg'},{n:'Pizza',tam:{Pequeña:10000,Grande:20000}}]}];
const row = {n:'Pollo',p:1,c:2,tam:'',nota:'',img:'invalid'};
const customer = {nombre:'Ana',tel:'+57 (300) 123-4567',dir:'Calle 1',entrega:'domicilio',pago:'Efectivo',vuelto:''};

test('restaura con el precio y foto del catálogo, elimina desconocidos y tamaños inválidos',()=>{
  const cart = O.restoreCart([row,{...row,n:'No existe'},{...row,tam:'Grande'},null,{...row,c:-1},{...row,c:1.5}],menu);
  assert.deepEqual(cart,[{...row,p:20000,img:'pollo.jpg'}]);
  for(const bad of [null,{},42,'[]']) assert.deepEqual(O.restoreCart(bad,menu),[]);
});
test('fusiona duplicados, limita cantidades y notas, respeta tamaños',()=>{
  const cart = O.restoreCart([row,{...row,c:200},{n:'Pizza',tam:'Grande',c:1,nota:'a'.repeat(500)}],menu);
  assert.equal(cart[0].c,99);
  assert.equal(cart[1].p,20000);
  assert.equal(cart[1].nota.length,300);
});
test('subtotal, domicilio, recogida y carrito vacío',()=>{
  const cart = O.restoreCart([row],menu);
  assert.deepEqual(O.totals(cart,'domicilio',4000),{count:2,subtotal:40000,shipping:4000,total:44000});
  assert.equal(O.totals(cart,'recoger',4000).total,40000);
  assert.equal(O.totals([],'domicilio',4000).total,0);
});
test('búsqueda normaliza acentos, mayúsculas y espacios',()=>{
  assert.equal(O.normalize('  PATACÓN   de POLLO '),'patacon de pollo');
});
test('validación de nombre, teléfono, dirección condicional y efectivo',()=>{
  assert.equal(O.validateCustomer(customer,44000),null);
  assert.equal(O.validateCustomer({...customer,nombre:'  '},44000).field,'cNombre');
  for(const tel of ['abc','123','300abc1234567','1234567890123456','++573001234567'])
    assert.equal(O.validateCustomer({...customer,tel},44000).field,'cTel');
  assert.equal(O.validateCustomer({...customer,dir:''},44000).field,'cDir');
  assert.equal(O.validateCustomer({...customer,dir:'',entrega:'recoger'},44000),null);
  assert.equal(O.validateCustomer({...customer,vuelto:'40.000'},44000).field,'cVuelto');
  assert.equal(O.validateCustomer({...customer,vuelto:'44.000'},44000),null);
  assert.equal(O.validateCustomer({...customer,vuelto:'abc',pago:'Transferencia'},44000),null);
});
test('efectivo acepta pesos enteros y separadores de miles, rechaza valores ambiguos',()=>{
  for(const value of ['50000','50.000','50,000','$ 50.000']) assert.equal(O.cashAmount(value),50000);
  for(const value of ['','0','-50000','50.00','50,00','1e6','abc','12.345,678']) assert.equal(O.cashAmount(value),null);
});
test('horario de Colombia: apertura exacta, medianoche y cierre al día siguiente',()=>{
  const schedule = {0:[17.5,24],1:[17.5,24],2:[17.5,24],3:[17.5,24],4:[17.5,24],5:[17.5,26],6:[17.5,26]};
  for(const [date,open] of [
    ['2026-09-25T17:29:00-05:00',false],['2026-09-25T17:30:00-05:00',true],
    ['2026-09-26T00:00:00-05:00',true],['2026-09-26T01:59:00-05:00',true],
    ['2026-09-26T02:00:00-05:00',false],['2026-09-27T01:59:00-05:00',true],
    ['2026-09-28T00:00:00-05:00',false]
  ]) assert.equal(O.isOpen(schedule,new Date(date)),open,date);
  assert.equal(O.isOpen({},new Date()),false);
});
test('mensaje completo: notas, totales, efectivo, recogida y fuera de horario',()=>{
  const cart = O.restoreCart([{...row,nota:'Sin cebolla & salsa aparte'}],menu);
  const msg = O.message(cart,{...customer,vuelto:'50.000'},4000,false);
  for(const fragment of ['2x Pollo','Sin cebolla & salsa aparte','Subtotal: $40.000','Domicilio: $4.000','*Total: $44.000*','paga con $50.000','fuera de horario']) assert.ok(msg.includes(fragment),fragment);
  const pickup = O.message(cart,{...customer,entrega:'recoger',pago:'Transferencia',vuelto:'50000'},4000,true);
  assert.ok(pickup.includes('Recoge en el local'));
  assert.ok(!pickup.includes('Domicilio:'));
  assert.ok(!pickup.includes('paga con'));
  assert.ok(!pickup.includes('fuera de horario'));
});
