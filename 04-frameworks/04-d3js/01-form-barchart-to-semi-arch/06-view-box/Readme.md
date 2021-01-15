# ViewBox

It was great to build a semi arch chart, but now the boss when the final user to be able to resize it... oopps :)

Something like:

![semi arc chart](./content/chart.gif "semi arc chart")

Live demo: [codesandbox](https://codesandbox.io/s/musing-wilson-ymnv7)

**ViewBox** to the rescue.

# Steps

- We will take as starting sample _03-arc-chart_.

- Let's copy the content from _03-arc-chart_ and execute _npm install_

```bash
npm install
```

- Let's update the size of our svg (this will be enclosed in a viewbox, inside the viewBox we will play with exact coordinates, outside with percentages)

```diff
- const svgDimensions = { width: 800, height: 500 };
+ const svgDimensions = { width: 500, height: 250 };
```

- Let's enclose the **svg** we are displaying in a **viewBox** (now sgv will have a _width_ and _height_ of 100%)

```diff
const svg = d3
  .select("body")
  .append("svg")
-  .attr("width", svgDimensions.width)
-  .attr("height", svgDimensions.height)
+  .attr("width", "100%")
+  .attr("height", "100%")
-  .attr("style", "background-color: #FBFAF0");
+  .attr("preserveAspectRatio", "xMinYMin meet")
+  .attr(
+    "viewBox",
+    `${margin.left} ${margin.top} ${svgDimensions.width -
+      margin.right} ${svgDimensions.height - margin.bottom}`
+  );
```

- Let's create a group + rectangle to set the background fill:

```typescript
svg
  .append("g")
  .append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", chartDimensions.width)
  .attr("height", chartDimensions.height)
  .attr("style", "fill: #FBFAF0");
```

- Now on the radius size, since we now exactly the _viewBox_ witdth and height we can adjust this entry:

```diff
- const radius = Math.min(chartDimensions.width, chartDimensions.height) / 2;
+ const radius = chartDimensions.width / 2.3;
```

- Let's now proper center our pie chart:

```diff
- chartGroup.attr("transform", `translate(${radius},${radius})`);
+ const pieMarginLeft = (chartDimensions.width - radius * 2) / 2;
+ const pieMarginBottom = chartDimensions.height - radius;
+
+ chartGroup.attr(
+  "transform",
+  `translate(${pieMarginLeft + radius},${pieMarginBottom + radius})`
+ );
```

- Let's run this code now

```bash
npm start
```

# Additional resources

Check this great example from Saninn: https://jsfiddle.net/Saninn/15pwLf7u/

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
