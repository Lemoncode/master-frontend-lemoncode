# Rendering map

Our boss now wants to display maps... nice let's start by displaying a map of Europe, we are going to implement the following
features:

- Proper display all the countries (right size, center...).
- Highlight the country where the mouse is pointing to (mouse hover).

![Europe chart plus mouse hover](./content/chart.gif)

Codesandbox: https://codesandbox.io/s/headless-river-s7yj3

# Steps

- We will take as starting example _00-boilerplate_, let's copy the content from that folder and execute _npm install_.

```bash
npm install
```

- When you deal with maps you can use two map formats GeoJSON or TopoJSON, topoJSON is lightweight and offers some extra
  features, let's install the needed package to work with:

```bash
npm install topojson-client --save
```

```bash
npm install @types/topojson-client --save-dev
```

- Let's remove part of the boilerplate test code:

_./src/index.ts_

```diff
import * as d3 from "d3";

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", 500)
  .attr("height", 500);
- svg
-  .append("text")
-  .attr("x", 100)
-  .attr("y", 100)
-  .text("Hello d3js");

-svg
-  .append("circle")
-  .attr("r", 20)
-  .attr("cx", 20)
-  .attr("cy", 20);
```

> More info about this format: https://umar-yusuf.blogspot.com/2018/07/difference-between-geojson-and-topojson.html

- Let's change the size of the svg we are using and add some background color:

```diff
const svg = d3
  .select("body")
  .append("svg")
+  .attr("width", 1024)
-  .attr("width", 500)
+  .attr("height", 800)
-  .attr("height", 500);
+  .attr("style", "background-color: #FBFAF0");
```

- Now we need the data (arcs) to draw an Europe map in topojson format, hopefully there are a lot of maps avaiable in this
  format, we can get the info from this great open source project: https://github.com/deldersveld/topojson
  we are going to copy to our local the following json file: https://github.com/deldersveld/topojson/blob/master/continents/europe.json

Let's download and copy that file under the _src_ folder

_./src/europe.json_

- We are going to include this file into the bundle and import it (another approach could load it from a remote location using _d3.json_).

First we will install the _node_ typings to get _require_ typing.

```bash
npm install @types/node --save-dev
```

Then, let's import _topojson_ converter and we load the json map using _require_

_./src/index.ts_

```diff
import * as d3 from "d3";
+ import * as topojson from "topojson-client";
+ const europejson  = require('./europe.json');
```

- Let's create our map.

- first we will define the map projection that we want to use (geoMercator),

_./src/index.ts_

```diff
const europeJson = require("./europe.json");

+ const aProjection = d3
+  .geoMercator();
```

> more about projections: https://d3-wiki.readthedocs.io/zh_CN/master/Geo-Projections/

- Next step, let's specify to our geopath generator which project we are going to use:

_./src/index.ts_

```diff
const aProjection = d3.geoMercator();
+   const geoPath = d3.geoPath().projection(aProjection);
```

- Now we need to convert from _topoJson_ to _geoJson_:

```diff
   const geoPath = d3.geoPath().projection(aProjection);
+  const geojson = topojson.feature(
+    europejson,
+    europejson.objects.continent_Europe_subunits
+  );
```

- Time to draw our map, let's append this to our _index.ts_ file.

```typescript
svg
  .selectAll("path")
  .data(geojson["features"])
  .enter()
  .append("path")
  // data loaded from json file
  .attr("d", geoPath as any);
```

- Let's run the example:

```bash
npm start
```

- Hey! we got an small map displayed, let's start pimping this :)

First of all we want to paint a bigger map, we can just play with the _scale_,
then we want to center the map, let's _translate_ it, we will configure the projection

```diff
const aProjection = d3.geoMercator()
+     // Let's make the map bigger to fit in our resolution
+    .scale(500)
+    // Let's center the map
+    .translate([300, 900]);
```

- This is looking better, let's add some styling we want to add some background to each country, and draw their borders.

- Let's define the styles in a _map.css_ file:

_./src/map.css_

```css
.country {
  stroke-width: 1;
  stroke: #2f4858;
  fill: #008c86;
}
```

- Let's import it in our index.html

_./src/index.html_

```diff
  <head>
+    <link rel="stylesheet" type="text/css" href="./map.css" />
    <link rel="stylesheet" type="text/css" href="./base.css" />
  </head>
```

- Let's use it in our map rendering:

```diff
svg
  .selectAll("path")
  .data(geojson["features"])
  .enter()
  .append("path")
+ .attr("class", "country")
  // data loaded from json file
  .attr("d", geoPath as any);
```

- That looks great, now let's add some interactivity, when the user hovers over a given country we want to high light it.

- Let's add some styling (append this to map css):

_./src/map.css_

```css
.selected-country {
  stroke-width: 1;
  stroke: #bc5b40;
  fill: #f88f70;
}
```

- Let's update the style of the country using two events _mouseover_ _mouseout_

```diff
svg
  .selectAll("path")
  .data(geojson["features"])
  .enter()
  .append("path")
  .attr("class", "country")
  // data loaded from json file
  .attr("d", geoPath as any)
+  .on("mouseover", function(d, i) {
+    d3.select(this).attr("class", "selected-country");
+  })
+  .on("mouseout", function(d, i) {
+    d3.select(this).attr("class", "country");
+  })
  ;
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
