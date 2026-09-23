# Claud Sonnet y modo agente

Para completar esta sesión, os he dicho antes que Tailwind se lleva muy bien con las IA, chat gpt, y otras, ¿Por qué? Porque es un lenguaje muy declarativo y muy sencillo de entender, eso sí... ten mucho cuidado porque se suele liar con la versión 3, siempre dile que estás usando la versión 4.

Vamos a jugar con Claude Sonnet y vamos a pedirle que maquete una página web que muestre el detalle de un portal inmobiliario, en concreto la ficha de una casa.

Partimos de tabla rasa y empezamos.

Voy a dejar el HTML vacio y el CSS simplemente con tailwind y daisy

Voy a inicializar un repo de git, así en cada paso en firme hago un commit.

Habilitamos modo agente, elegimos **Claude Sonnet 4.5** y le indicamos un buen prompt:

```
Tengo instalado y configurado ya Tailwind  (^4.1.17) y Daisy UI (^5.5.5).

Quiero que me generes el código HTML y CSS (usando Tailwind y Daisy) para maquetar la ficha de una casa en un portal inmobiliario.

Quiero un carrusel de imágenes, un título, una descripción, características (número de habitaciones, baños, metros cuadrados, precio), un mapa de localización y un formulario de contacto, todo ello maquetado con Tailwind y Daisy UI, además quiero que uses iconos para las catacterísticas de la casa (Cuartos, baños, metros cuadrados, precio...), usa la librería que mejor se adapte al proyecto.

Además quiero que sea responsive, es decir, que se vea bien en móvil, tablet y escritorio.

Para las imagenes de la casa busca imágenes de casas en Unsplash y usa esas URLs en el código.
```

Le damos a que le de caña.

Ahora toca revisar código (importante), probarlo, y si estamos agusto hacemos un keep y un commit.

Aquí cada vez va a generar una cosa distinta, en la ejeución que genera hizo algo feo, la cabecera, vamos a decir que la mejore, Vamos a adjuntarle el logo de lemon y decirle que la mejore y use el logo de lemom con sus colores.

```
La cabecera me parece fea, la puedes mejorar? el color primario que usas creo que también podría entrar al theme y cambiarlo por algo más acorde a inmobiliaria, hacemos una cosa te paso el logo de lemon y lo pones en la cabecera y adaptas los colores y tema para que sea acorde, sería Inmobiliaria Lemoncode
```

Aquí la ha cagado, porque el color es un poco chillón y tampoco usa el logo y no hemos pasado los colores al resto del tema, vamos a ver si puede corregirlo.

```
El color que has elegido es un poco chillón, ¿Lo puedes suavizar? Y por otro lado no has cambiado el resto de colores y canta mucho, al azul de cantidad o iconos, debería de ir acordo con los colores del logo de lemon, y también el logo no lo has puesto, te he adjuntado un logo, cargalo en la cabecera por favor.
```

Y el logo sigue cagandola jajajaja, vamos a probar a ver si lo arregla.

```
El logo sigue estando mal, acabo de ponerlo en la ruta `public/2.svg` por favor usa ese en vez de _lemon-logo.svg_
```

Uueee !! hemos conseguido que ponga el puñetero logo, ahora pasa una cosa, debería de estar en un fondo blanco o similar, vamos a decirlq ue se busque la vida para ponerlo en un fondo blanco con algo que quede bonito.

```
¡Enhorabuena ya se ve el logo! pero hay un pero, al no ser el fondo blanco no se ve bien, ¿Podrías buscar la forma de poner el logo en un fondo blanco o similar que quede bonito? Mira que forma sería mejor si un circulo blanco, o otra forma
```