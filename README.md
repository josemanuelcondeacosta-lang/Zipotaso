# Zipote Food

Abre esta carpeta en Visual Studio Code.

- `index.html`: estructura de la página.
- `styles.css`: colores (bloque `:root`), tamaños y diseño.
- `app.js`: WhatsApp, horario, domicilio (`CONFIG`) y platos y precios (`MENU`).
- `order.js`: reglas de cantidades, restauración del carrito, validación, totales y mensaje del pedido.
- `assets/`: logo, portada y fotos de los platos.

## Fotos
Guarda cada foto con el nombre exacto de la lista, en JPG. Si falta una, se muestra el logo en su lugar.

- `assets/portada.jpg` (horizontal, 1600x900)
- `assets/platos/` (cuadradas, 800x800, menos de 200 KB):
  - clasica.jpg
  - doble-carne.jpg
  - la-especial.jpg
  - sencilla.jpg
  - pollo.jpg
  - carne.jpg
  - mixta.jpg
  - buti-chorizo.jpg
  - suiza.jpg
  - la-zipote.jpg
  - sencillo.jpg
  - suizo.jpg
  - ranchero.jpg
  - especial.jpg

Para probar, usa la extensión Live Server de VS Code (clic derecho en index.html > Open with Live Server).
Para subirla, arrastra la carpeta completa a Netlify Drop (app.netlify.com/drop).

## Funcionamiento del pedido

- El carrito se guarda en el navegador y se sincroniza entre pestañas del mismo sitio. Al recuperarlo se usan los precios actuales del menú y se eliminan productos o tamaños que ya no existen.
- Productos con el mismo nombre, tamaño e indicación se agrupan. El límite es de 99 unidades por línea y 300 caracteres por indicación. Los nombres deben ser únicos salvo los productos repetidos en «Los más pedidos»; sus precios y tamaños deben coincidir.
- Los datos del formulario, entrega y pago se conservan durante la sesión de la pestaña. Nombre, teléfono y dirección se recuerdan al preparar un pedido válido. Si el navegador bloquea el almacenamiento, se puede seguir comprando y se muestra un aviso.
- El teléfono admite de 7 a 15 dígitos y un indicativo opcional. El efectivo es opcional; si se indica, debe cubrir el total. Se aceptan pesos enteros como `50000`, `50.000` o `50,000`.
- El horario se calcula en `America/Bogota`, se actualiza cada 30 segundos y al volver a la pestaña. Los pedidos fuera de horario incluyen una solicitud de confirmación.
- Atrás cierra el panel abierto. Escape, el botón de cierre y el fondo también lo cierran, conservando la posición del menú.
- «Enviar pedido» prepara el texto y abre WhatsApp. **El cliente debe enviarlo allí y el restaurante debe confirmarlo**: la web no registra pedidos en un servidor ni procesa pagos. Si la ventana se bloquea, aparece un enlace para continuar. El carrito se conserva al volver.

## Pruebas

Desde esta carpeta, con Node.js 22 o posterior:

```sh
npm test
npm install
npm run test:browser
```

Las pruebas de reglas no requieren dependencias. Las de navegador usan Puppeteer y Chrome: recorren las categorías y los 14 productos, verifican cinco anchos de pantalla, búsqueda, historial, foco, cantidades, validación, borradores, datos dañados y sincronización entre pestañas. La apertura de WhatsApp se intercepta: no se envían mensajes reales.

Se puede usar un Chrome ya instalado mediante `CHROME_PATH`. Para reutilizar una instalación existente de Puppeteer, `PUPPETEER_MODULE` acepta la ruta de su paquete. La aplicación publicada sigue siendo estática y no requiere Node.js.

Antes de publicar, verifica en `CONFIG` el número de WhatsApp, el enlace de Instagram, la tarifa y la ubicación. «Cómo llegar» abre las indicaciones de Google Maps hacia Cra. 64B #48-54, barrio Modelo, Barranquilla, Atlántico, Colombia. El enlace se genera desde `CONFIG.direccion`, que también se muestra en la página. Las fotos de platos y la portada aún no están incluidas. Conviene hacer la última prueba de apertura de WhatsApp y teclado en un teléfono real.
