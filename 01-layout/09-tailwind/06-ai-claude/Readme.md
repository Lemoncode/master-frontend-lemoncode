# Claud Sonnet y modo agente

Para completar esta sesión, os he dicho antes que Tailwind se lleva muy bien con las IA, chat gpt, y otras, ¿Por qué? Porque es un lenguaje muy declarativo y muy sencillo de entender, eso sí... ten mucho cuidado porque se suele liar con la versión 3, siempre dile que estás usando la versión 4.

Vamos a jugar con Claude Sonnet y vamos a pedirle que maquete una página web que muestre el detalle de un portal inmobiliario, en concreto la ficha de una casa.

Partimos de tabla rasa y empezamos.

Voy a dejar el HTML vacio y el CSS simplemente con tailwind y daisy

Habilitamos modo agente, elegimos Claude Sonnet 4.5 y le indicamos un buen prompt:

```
Tengo instalado y configurado ya Tailwind  (^4.1.17) y Daisy UI (^5.5.5).

Quiero que me generes el código HTML y CSS (usando Tailwind y Daisy) para maquetar la ficha de una casa en un portal inmobiliario.

Quiero un carrusel de imágenes, un título, una descripción, características (número de habitaciones, baños, metros cuadrados, precio), un mapa de localización y un formulario de contacto, todo ello maquetado con Tailwind y Daisy UI, además quiero que uses iconos para las catacterísticas de la casa (Cuartos, baños, metros cuadrados, precio...), usa la librería que mejor se adapte al proyecto.

Además quiero que sea responsive, es decir, que se vea bien en móvil, tablet y escritorio.

Para las imagenes de la casa busca imágenes de casas en Unsplash y usa esas URLs en el código.
```