import * as d3 from "d3";
import {
  resultCollectionSpainJul23,
  resultCollectionSpainNov19,
  ResultEntry,
} from "./data";

const svgDimensions = { width: 500, height: 500 };
const margin = { left: 5, right: 5, top: 10, bottom: 10 };

const chartDimensions = {
  width: svgDimensions.width - margin.left - margin.right,
  height: svgDimensions.height - margin.bottom - margin.top,
};

const partiesColorScale = d3
  .scaleOrdinal(resultCollectionSpainJul23.map(party => party.color)
    .concat(['#6B2E68', '#FA5000', '0FDDC4', '#FFF200', 'E51C13', '#00C6A4', '#037252']))
  .domain(resultCollectionSpainJul23.map(party => party.party)
    .concat(['UP', 'Cs', 'Más pais', 'CUP', 'NA+', 'PRC', 'Teruel Existe']));

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr(
    "viewBox",
    `${margin.left} ${margin.top} ${svgDimensions.width - margin.right}
      ${svgDimensions.height - margin.bottom}`
  );

svg
  .append("g")
  .append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", chartDimensions.width)
  .attr("height", chartDimensions.height)
  .attr("style", "fill: #FBFAF0");

const chartGroup = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

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
  .pie<ResultEntry>()
  .startAngle(-90 * (Math.PI / 180))
  .endAngle(90 * (Math.PI / 180))
  .value(d => d["seats"])
  .sort(null);

const generateChart = (data: ResultEntry[]) => {
  const arcs = chartGroup
  .selectAll("slice")
  .data(pieChart(data))
  .enter();

arcs
  .append("path")
  .attr("d", <any>arc) // Hack typing: https://stackoverflow.com/questions/35413072/compilation-errors-when-drawing-a-piechart-using-d3-js-typescript-and-angular/38021825
  .attr("fill", (d, i) => {
    console.log(d.data.party);
    return partiesColorScale(d.data.party);
  });

};

// Update chart functionality
const updateChart = (data: ResultEntry[]) => {
  d3.selectAll("path").remove();
  generateChart(data);
};

window.onload = () => updateChart(resultCollectionSpainJul23);

document
  .getElementById("july2023")
  .addEventListener("click", () => updateChart(resultCollectionSpainJul23));

document
  .getElementById("november2019")
  .addEventListener("click", () => updateChart(resultCollectionSpainNov19));
