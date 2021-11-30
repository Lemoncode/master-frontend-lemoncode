# 00 Start

## Resumen

Vamos a instalar d3js y a estilarlo usando CSS in JS (Emotion).

## Pasos

Copiamos el código de _00 start_ y hacemos un install:

```bash
npm install
```

Vamos ahora a instalar _d3js_ y sus tipos.

```bash
npm install d3 --save
```

```bash
npm install @types/d3 --save-dev
```

Vamos a tirar un poco de _d3js_ (bueno primitivas de _svg_):

_index.ts_

```ts
import * as d3 from "d3";

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", 500)
  .attr("height", 500);

svg.append("text").attr("x", 100).attr("y", 100).text("Hello d3js");

svg.append("circle").attr("r", 20).attr("cx", 20).attr("cy", 20);
```

Vamos ahora a instalarnos _emotion/css_

```bash
npm install @emotion/css --save
```

Y comencemos a estilar (a tener en cuenta las propiedades en SVG son un poco distantas a las
que aplicamos a los elementos HTML):

```diff
import * as d3 from "d3";
+ import { css } from "@emotion/css";

+ const color = "red";
+
+ const circleClass = css`
+  fill: ${color};
+ `;

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", 500)
  .attr("height", 500);

svg
  .append("text")
  .attr("x", 100)
  .attr("y", 100)
  .text("Hello d3js");

svg
  .append("circle")
  .attr("r", 20)
  .attr("cx", 20)
  .attr("cy", 20)
+ .attr("class", circleClass);
  ;
```
