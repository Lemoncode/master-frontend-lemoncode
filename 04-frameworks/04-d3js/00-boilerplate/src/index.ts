import * as d3 from "d3";

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
  .attr("cy", 20);