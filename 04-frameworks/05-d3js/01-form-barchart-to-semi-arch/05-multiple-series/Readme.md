# Multiple Series

One more request from your boss... _Hey ! I want to be able to compare results with the previous elections ones, just by clicking on a
button swap values and btw. I would like to show some transition when swapping data sets_

Something like:

![animated series](./content/chart.gif "animated series")

<!-- Live demo: [codesandbox](https://codesandbox.io/s/frosty-waterfall-j47s5) -->

## Steps

- We will take as starting sample _04-pimp-chart_.

- Let's copy the content from _04-pimp-chart_ and execute _npm install_

```bash
npm install
```

- Let's add two buttons in the _index.html_ file:

_./src/index.html_:

```diff
  <body>
+    <div>
+      <button id="july2023">Results July 2023</button>
+      <button id="november2019">Results November 2019</button>
+    </div>
    <script src="./index.ts"></script>
  </body>
```

- Let's import April's results. We are going to increase height too, since the legend may be cut because of the buttons we've just added:

```diff
import * as d3 from "d3";
import {
  resultCollectionSpainJul23
+ resultCollectionSpainNov19,
  ResultEntry
} from "./data";

- const svgDimensions = { width: 500, height: 500 };
+ const svgDimensions = { width: 500, height: 575 };
```

- In November 2019's election there are several political parties that are not in July 2023's election, we need to include all parties:

```diff
const partiesColorScale = d3
  .scaleOrdinal(resultCollectionSpainJul23.map(party => party.color)
+   .concat(['#6B2E68', '#FA5000', '0FDDC4', '#FFF200', 'E51C13', '#00C6A4', '#037252']))
  .domain(resultCollectionSpainJul23.map(party => party.party)
+   .concat(['UP', 'Cs', 'Más pais', 'CUP', 'NA+', 'PRC', 'Teruel Existe']));
```

- Now we need to wrap arcs generation inside a funcion. We will make use of this function later.

```diff
+ const generateChart = (data: ResultEntry[]) => {
  const arcs = chartGroup
    .selectAll("slice")
-   .data(pieChart(resultCollectionSpainJul23))
+   .data(pieChart(<any>data))
    .enter();

  arcs
    .append("path")
    .attr("d", <any>arc) // Hack typing: https://stackoverflow.com/questions/35413072/compilation-errors-when-drawing-a-piechart-using-d3-js-typescript-and-angular/38021825
    .attr("fill", (d) => {
      console.log(d.data.party);
      return partiesColorScale(d.data.party);
    })
    .on("mouseover", function (mouseEvent: MouseEvent, datum) {
      d3.select(this).attr("transform", `scale(1.1, 1.1)`);
      const partyInfo = datum.data;

      const coords = { x: mouseEvent.pageX, y: mouseEvent.pageY };
      div.transition().duration(200).style("opacity", 0.9);
      div
      .html(`<span>${partyInfo.party}: ${partyInfo.seats}</span>`)
      .style("left", `${coords.x}px`)
      .style("top", `${coords.y - 28}px`);
    })
    .on("mouseout", function() {
      d3.select(this).attr("transform", ``);
      div.transition().duration(500).style("opacity", 0);
    });
+}
```

- Let's add a method to swap the data we are using. We will append all this code at the end of the index.ts file:

_./src/index.ts_:

```typescript
// Update chart functionality
const updateChart = (data: ResultEntry[]) => {
  d3.selectAll("path").remove();
  generateChart(data);
};
```

- And now call them on each button with the corresponding data:

```typescript
window.onload = () => updateChart(resultCollectionSpainJul23);

document
  .getElementById("july2023")
  .addEventListener("click", () => updateChart(resultCollectionSpainJul23));

document
  .getElementById("november2019")
  .addEventListener("click", () => updateChart(resultCollectionSpainNov19));
```

- Let's give a try...

```bash
npm start
```

- We got an animation but a bit strange, how to make it smoother? remove the sorting:

```diff
const pieChart = d3
  .pie()
  .startAngle(-90 * (Math.PI / 180))
  .endAngle(90 * (Math.PI / 180))
  .value(d => d["seats"])
+ .sort(null);
```

- Now looks better, it still not perfect you can work it out to get it perfect by following this example: <https://bl.ocks.org/tezzutezzu/c2653d42ffb4ecc01ffe2d6c97b2ee5e>

## Exercise

Let's implemnent a "pactometer", just only for the latest election process, add a checkbox per political party, the users can check which parties reach an agreement and check if the get absolute parliamentary majority.

Tips:

- Add manual checkbox.
- Start by creating two keys: Pact, Others.
- Sum up Pact, Sum up others.
- Display the semi arch chart.
- Now let's go one step forward:
  - Keep all the parties in the pact (all the keys).
  - Create a key call others (gray color) where you sum up all the other seats.
- Display the semi arch chart.

## About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: <http://lemoncode.net/master-frontend>
