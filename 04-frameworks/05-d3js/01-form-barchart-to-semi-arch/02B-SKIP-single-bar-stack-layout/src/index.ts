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

const politicalPartiesKeys: string[] = resultCollectionSpainJul23.map(
  (item) => item.party
);

// Since we are going to use stack layout
// We are going to format the data in the following format
// {
//   PP: 137,
//   PSOE: 121,
//   VOX: 33,
//   ...
// }
// This will represent a serie for a single entry (in this
// case we are handling a single bar, an example of multiple
// bar would be showing result elections of several years)
const singleElectionResult = resultCollectionSpainJul23.reduce(
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

const partiesColorScale = d3
  .scaleOrdinal(resultCollectionSpainJul23.map(party => party.color))
  .domain(resultCollectionSpainJul23.map(party => party.party));

const barHeight = 200; // We could calculate this based on svg height

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgDimensions.width)
  .attr("height", svgDimensions.height);

const totalNumberSeats = resultCollectionSpainJul23.reduce(
  (sum, item) => sum + item.seats,
  0
);

const xScale = d3
  .scaleLinear()
  .domain([0, totalNumberSeats])
  .range([0, chartDimensions.width]);

const chartGroup = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)
  .attr("width", chartDimensions.width)
  .attr("height", chartDimensions.height);

// Let's create our stack layout
// we are going to pass the keys (PP, PSOE, VOX, Sumar, ERC...)
// to have them attached on every item
const stack = d3.stack().keys(politicalPartiesKeys);

// Now we get the data formatted in the follwing way:
//[
//  [[0, 137]] // PP entry (seats), starts on 0 ends on 137
//  [[137, 258]] // PSOE entry (121), but starts on previous items 137 (PP)
//  [[258, 291]] // VOX Entry
//]
const series = stack(data);

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
  .attr("x", (d) => {
    // We take as starting point the first coordinate
    // e.g. PSOE 137, 258 -> we start at 137 (where PP ended, and on the width param sum up that value)
    return xScale(d[0][0]);
  })
  .attr("y", () => chartDimensions.height - barHeight)
  .attr("fill", (d) => partiesColorScale(d.key));
