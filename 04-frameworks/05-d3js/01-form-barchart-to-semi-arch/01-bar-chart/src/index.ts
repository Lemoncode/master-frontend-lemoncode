import * as d3 from "d3";
import { resultCollectionSpainJul23 } from "./data";

const svgDimensions = { width: 500, height: 500 };
const margin = { left: 5, right: 5, top: 10, bottom: 10 };
const chartDimensions = {
  width: svgDimensions.width - margin.left - margin.right,
  height: svgDimensions.height - margin.bottom - margin.top,
};

const maxNumberSeats = resultCollectionSpainJul23.reduce(
  (max, item) => (item.seats > max ? item.seats : max),
  0
);

const partiesColorScale = d3
  .scaleOrdinal(resultCollectionSpainJul23.map(party => party.color))
  .domain(resultCollectionSpainJul23.map(party => party.party));

const politicalPartiesCount = resultCollectionSpainJul23.length;
const barPadding = 5; // We could calculate this value as well
const barWidth =
  (chartDimensions.width - barPadding * politicalPartiesCount) /
  politicalPartiesCount;

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgDimensions.width)
  .attr("height", svgDimensions.height);

const yScale = d3
  .scaleLinear()
  .domain([0, maxNumberSeats])
  .range([0, chartDimensions.height]);

const chartGroup = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)
  .attr("width", chartDimensions.width)
  .attr("height", chartDimensions.height);

chartGroup
  .selectAll("rect")
  .data(resultCollectionSpainJul23)
  .enter()
  .append("rect")
  .attr("width", barWidth)
  .attr("height", (d) => yScale(d.seats))
  .attr("x", (d, i) => i * (barWidth + barPadding))
  .attr("y", (d) => chartDimensions.height - yScale(d.seats))
  .attr("fill", (d) => partiesColorScale(d.party));
