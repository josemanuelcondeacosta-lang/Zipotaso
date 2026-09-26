/* Reglas del pedido compartidas por la página y las pruebas. */
(function(root){
  "use strict";
  const MAX_QUANTITY = 99;
  const MAX_NOTE = 300;
  const text = (value, max) => typeof value === "string" ? value.trim().slice(0, max) : "";
  const normalize = value => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
  const money = value => "$" + value.toLocaleString("es-CO");
  const key = item => JSON.stringify([item.n, item.tam, item.nota]);

  function restoreCart(saved, menu){
    if(!Array.isArray(saved)) return [];
    const catalog = new Map(menu.flatMap(group => group.items).map(item => [item.n, item]));
    const rows = new Map();
    for(const row of saved){
      if(!row || !Number.isSafeInteger(row.c) || row.c <= 0) continue;
      const product = catalog.get(row.n);
      if(!product) continue;
      const size = typeof row.tam === "string" ? row.tam : "";
      if(product.tam ? !Object.hasOwn(product.tam, size) : size !== "") continue;
      const price = product.tam ? product.tam[size] : product.p;
      if(!Number.isSafeInteger(price) || price < 0) continue;
      const item = {n:product.n, img:product.img || "", tam:size, nota:text(row.nota, MAX_NOTE), p:price, c:Math.min(row.c, MAX_QUANTITY)};
      const previous = rows.get(key(item));
      if(previous) previous.c = Math.min(MAX_QUANTITY, previous.c + item.c);
      else rows.set(key(item), item);
    }
    return [...rows.values()];
  }

  function totals(cart, delivery, fee){
    const count = cart.reduce((sum, row) => sum + row.c, 0);
    const subtotal = cart.reduce((sum, row) => sum + row.p * row.c, 0);
    const shipping = count && delivery === "domicilio" ? fee : 0;
    return {count, subtotal, shipping, total:subtotal + shipping};
  }

  function cashAmount(value){
    const clean = value.trim().replace(/^\$\s*/, "");
    if(!/^(?:\d+|\d{1,3}(?:\.\d{3})+|\d{1,3}(?:,\d{3})+)$/.test(clean)) return null;
    const amount = Number(clean.replace(/[.,]/g, ""));
    return Number.isSafeInteger(amount) && amount > 0 ? amount : null;
  }

  function validateCustomer(data, total){
    if(!data.nombre.trim()) return {field:"cNombre", message:"Escribe tu nombre."};
    const phone = data.tel.trim();
    if(!/^\+?[\d\s()-]+$/.test(phone) || !/^\d{7,15}$/.test(phone.replace(/\D/g, "")))
      return {field:"cTel", message:"Escribe un teléfono válido de 7 a 15 dígitos, con indicativo si corresponde."};
    if(data.entrega === "domicilio" && !data.dir.trim()) return {field:"cDir", message:"Escribe la dirección de entrega."};
    if(data.pago === "Efectivo" && data.vuelto.trim()){
      const cash = cashAmount(data.vuelto);
      if(cash === null) return {field:"cVuelto", message:"Escribe un valor válido en pesos, por ejemplo 50.000."};
      if(cash < total) return {field:"cVuelto", message:`El efectivo debe cubrir el total de ${money(total)}.`};
    }
    return null;
  }

  function isOpen(schedule, date = new Date()){
    const parts = new Intl.DateTimeFormat("en-US", {timeZone:"America/Bogota", weekday:"short", hour:"numeric", minute:"numeric", hourCycle:"h23"}).formatToParts(date);
    const part = type => parts.find(p => p.type === type).value;
    const hour = Number(part("hour")) + Number(part("minute"))/60;
    const day = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(part("weekday"));
    const today = schedule[day], yesterday = schedule[(day+6)%7];
    return !!((today && hour >= today[0] && hour < Math.min(today[1],24)) ||
      (yesterday && yesterday[1] > 24 && hour < yesterday[1]-24));
  }

  function message(cart, customer, fee, open){
    const amounts = totals(cart, customer.entrega, fee);
    const lines = ["*Nuevo pedido — Zipote Food*", ""];
    for(const row of cart){
      lines.push(`• ${row.c}x ${row.n}${row.tam ? ` (${row.tam})` : ""} — ${money(row.p*row.c)}`);
      if(row.nota) lines.push(`   Indicación: ${row.nota}`);
    }
    lines.push("", `Subtotal: ${money(amounts.subtotal)}`);
    if(customer.entrega === "domicilio") lines.push(`Domicilio: ${money(amounts.shipping)}`);
    lines.push(`*Total: ${money(amounts.total)}*`, "", `Nombre: ${customer.nombre}`, `Teléfono: ${customer.tel}`);
    lines.push(customer.entrega === "domicilio" ? `Entrega a domicilio: ${customer.dir}` : "Recoge en el local");
    let payment = `Pago: ${customer.pago}`;
    if(customer.pago === "Efectivo" && customer.vuelto.trim()) payment += ` (paga con ${money(cashAmount(customer.vuelto))})`;
    lines.push(payment);
    if(!open) lines.push("", "Pedido fuera de horario: por favor confirmar disponibilidad y hora de entrega.");
    return lines.join("\n");
  }

  const api = {MAX_QUANTITY, MAX_NOTE, text, normalize, money, key, restoreCart, totals, cashAmount, validateCustomer, isOpen, message};
  if(typeof module !== "undefined" && module.exports) module.exports = api;
  else root.ZipoteOrder = api;
})(globalThis);
