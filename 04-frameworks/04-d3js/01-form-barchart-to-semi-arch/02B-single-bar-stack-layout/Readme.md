# Single bar + Layout

In the previous example we create a single stacked bar chart.

We just used a variable to store the previous position. But... Is there any
standard way of doing somethin like that, what if I have to hop in into
more complex scenarios like showing a stack bar chart comparing several
years election results? .... StackLayout to the rescue.

We are going to recreate the same chart as in the previous sample but
using d3js stack layout:

![single horizontal stack bar chart](./content/chart.png "single horizontal stack bar chart")

Live example: [codesandbox](https://codesandbox.io/s/nice-mccarthy-1jwtx)

Let's give a try.

# Steps

- We will start from scratch, but will be reusing a lot of code from 01-bar-chart
  (in a real world scenario it would be enough to refactor the previous example
  but for the sake of clarity we will go step by step).

- Let's copy the content from _00-boilerplate_ and execute _npm install_

```bash
npm install
```

- Let's start by adding the setting information we have alreadty calculated
  in the previous chart.

- Let's wipe the test content in _index.ts_

_./src/index.ts_

```diff
- import * as d3 from "d3";

- svg
-  .append("text")
-  .attr("x", 100)
-  .attr("y", 100)
-  .text("Hello d3js");
-
-svg
-  .append("circle")
-  .attr("r", 20)
-  .attr("cx", 20)
-  .attr("cy", 20);
```

- Let's add all the settings. IMPORTANT this time the _height_ will be fixed (we will
  name that const **barHeight** and the _width_ will be dynamic).

> As an enhancemente this time we will take the keys from the data array, and
> we will increase the _with_ of the chart to 800 pixels.

_./src/index.ts_

```typescript
import * as d3 from "d3";
import { resultCollectionSpainNov19 } from "./data";

const svgDimensions = { width: 800, height: 500 };
const margin = { left: 5, right: 5, top: 10, bottom: 10 };
const chartDimensions = {
  width: svgDimensions.width - margin.left - margin.right,
  height: svgDimensions.height - margin.bottom - margin.top,
};
const totalNumberSeats = resultCollectionSpainNov19.reduce(
  (sum, item) => sum + item.seats,
  0
);

const barHeight = 200;

const politicalPartiesKeys: string[] = resultCollectionSpainNov19.map(
  (item) => item.party
);

const partiesColorScale = d3
  .scaleOrdinal([
    "#ED1D25",
    "#0056A8",
    "#5BC035",
    "#6B2E68",
    "#F3B219",
    "#FA5000",
    "#C50048",
    "#029626",
    "#A3C940",
    "#0DDEC5",
    "#FFF203",
    "#FFDB1B",
    "#E61C13",
    "#73B1E6",
  ])
  .domain(politicalPartiesKeys);

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgDimensions.width)
  .attr("height", svgDimensions.height)
  .attr("style", "background-color: #FBFAF0");

const chartGroup = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)
  .attr("width", chartDimensions.width)
  .attr("height", chartDimensions.height);
```

- Since x axis will be dynamic (depending on the seats assigned for each party)
  let's calcualte the XScale (seats to pixels).

```typescript
const xScale = d3
  .scaleLinear()
  .domain([0, totalNumberSeats])
  .range([0, chartDimensions.width]);
```

- Since we are going to use the stack layout, we have to "massage" the data
  and transform it, it will expect something like:

**Do not copy paste this**

```json
[
  {
    PSOE: 120,
    PP: 88,
    VOX: 52
    ...
  }
]
```

> In a stacked bar chart, we would have more bars in this case we will represent a single on.

Let's add the code that will let us transform the data:

```typescript
// Since we are going to use stack layout
// We are going to format the data in the following format
// {
//   PSOE: 120,
//   PP: 88,
//   VOX: 52
//   ...
// }
// This will represent a serie for a single entry (in this
// case we are handling a single bar, an example of multiple
// bar would be showing result elections of several years)
const singleElectionResult = resultCollectionSpainNov19.reduce(
  (total, item) => ({
    ...total,
    [item.party]: item.seats,
  }),
  {}
);

// Stack Layout will expect an array of objects
// In this case we are going to display only one bar
// we just wrap it in an array
const data = [singleElectionResult];
```

- Now is time to make use of _d3js.stack_ layout (layout do not render data, they
  are just preprocessor, prepare the data to be easily displayed in e.g. a stack like
  layout, or a pie / arc like layout, etc...).

```typescript
// Let's create our stack layout
// we are going to pass the keys (PSOE, PP, VOX, UP, Cs...)
// to have them attached on every item
const stack = d3.stack().keys(politicalPartiesKeys);

// Now we get the data formatted in the follwing way:
//[
//  [[0,120]] // PSOE entry (seats), starts on 0 ends on 120
//  [[120,208]] // PP entry (88), but starts on previous items 120 (PSOE)
//  [[208, 260]] // VOX Entry
//]
const series = stack(data);
```

- Now is time to render the chart.

```typescript
chartGroup
  .selectAll("rect")
  .data(series)
  .enter()
  .append("rect")
  .attr("width", (d) => {
    // To get the width of the current item we have to substract
    // the final stack value - the initial stack value
    return xScale(d[0][1] - d[0][0]);
  })
  .attr("height", barHeight)
  .attr("x", (d, i) => {
    // We take as starting point the first coordinate
    // e.g. PP 120, 208 -> we start at 120 (where PSOE ended, and on the width param sum up that value)
    return xScale(d[0][0]);
  })
  .attr("y", (d) => chartDimensions.height - barHeight)
  .attr("fill", (d, i) => partiesColorScale(d.key));
```

- Let's run this code now

```bash
npm start
```

# Excercise

Same as in previous example (just in case you didn't implement it)

Couldn't it be cool to add an indicator showing how many seat are needed to
get overall majority? Something like:

Tips:

- The number of seats to get overall majority is half of the aviable seat + 1.
- You can use the xScale to get the exact position where to draw a line.
- you can draw a vertical line (check svg attribute to give it the right
  widht and color).

¡That's all!

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
