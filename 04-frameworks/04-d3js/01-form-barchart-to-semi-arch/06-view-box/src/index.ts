import * as d3 from "d3";
import { resultCollectionSpainNov19 } from "./data";

const svgDimensions = { width: 500, height: 250 };
const margin = { left: 5, right: 5, top: 10, bottom: 10 };
const chartDimensions = {
  width: svgDimensions.width - margin.left - margin.right,
  height: svgDimensions.height - margin.bottom - margin.top,
};

const partiesColor = [
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
  "#BECD48",
  "#017252",
];

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr(
    "viewBox",
    `${margin.left} ${margin.top} ${svgDimensions.width - margin.right} ${
      svgDimensions.height - margin.bottom
    }`
  );

const chartGroup = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)
  .attr("width", chartDimensions.width)
  .attr("height", chartDimensions.height);

const radius = chartDimensions.width / 2.3;

const pieMarginLeft = (chartDimensions.width - radius * 2) / 2;
const pieMarginBottom = chartDimensions.height - radius;

chartGroup.attr(
  "transform",
  `translate(${pieMarginLeft + radius},${pieMarginBottom + radius})`
);

const arc = d3
  .arc()
  .innerRadius(radius / 1.7) // We want to have an arc with a propotional width
  .outerRadius(radius);

const pieChart = d3
  .pie()
  .startAngle(-90 * (Math.PI / 180))
  .endAngle(90 * (Math.PI / 180));

const politicalResultsOnlyNumbers: number[] = resultCollectionSpainNov19.map(
  (result) => result.seats
);

const pie = pieChart(politicalResultsOnlyNumbers);

const arcs = chartGroup.selectAll("slice").data(pie).enter();

arcs
  .append("path")
  .attr("d", <any>arc) // Hack typing: https://stackoverflow.com/questions/35413072/compilation-errors-when-drawing-a-piechart-using-d3-js-typescript-and-angular/38021825
  .attr("fill", (d, i) => partiesColor[i]); // TODO color ordinal
