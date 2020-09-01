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

const politicalParties = [
  "PSOE",
  "PP",
  "VOX",
  "UP",
  "ERC",
  "Cs",
  "JxCat",
  "PNV",
  "Bildu",
  "Más pais",
  "CUP",
  "CC",
  "BNG",
  "Teruel Existe",
];

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
  .domain(politicalParties);

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

const xScale = d3
  .scaleLinear()
  .domain([0, totalNumberSeats])
  .range([0, chartDimensions.width]);

  let currentXPosition = 0;

chartGroup
  .selectAll("rect")
  .data(resultCollectionSpainNov19)
  .enter()
  .append("rect")
  .attr("width", d => xScale(d.seats))
  .attr("height", barHeight)
  .attr("x", (d, i) => {
    const position = currentXPosition;
    currentXPosition += xScale(d.seats);
    return position;
  })
  .attr("y", d => chartDimensions.height - barHeight)
  .attr("fill", d => partiesColorScale(d.party));