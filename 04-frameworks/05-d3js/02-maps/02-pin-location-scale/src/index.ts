import * as d3 from "d3";
import * as topojson from "topojson-client";
const spainjson = require("./spain.json");
const d3Composite = require("d3-composite-projections");
import { latLongCommunities } from "./communities";
import { unemploymentRate2023Q4 } from "./stats";

const highestPercentage = unemploymentRate2023Q4.reduce(
  (max, item) => (item.value > max ? item.value : max),
  0
);

const unemploymentPercentageRadiusScale = d3
  .scaleLinear()
  .domain([0, highestPercentage])
  .range([0, 50]); // 50 pixel max radius, we could calculate it relative to width and height

const calculateRadiusBasedOnUnemploymentPercentage = (comunidad: string) => {
  const entry = unemploymentRate2023Q4.find((item) => item.name === comunidad);
  return entry ? unemploymentPercentageRadiusScale(entry.value) : 0;
};

const aProjection = d3Composite.geoConicConformalSpain();

const geoPath = d3.geoPath().projection(aProjection);

const geojson = topojson.feature(spainjson, spainjson.objects.ESP_adm1);

aProjection.fitSize([1024, 800], geojson);

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", 1024)
  .attr("height", 800)
  .attr("style", "background-color: #FBFAF0");

svg
  .selectAll("path")
  .data(geojson["features"])
  .enter()
  .append("path")
  .attr("class", "region")
  // use geoPath to convert the data into the current projection
  // https://stackoverflow.com/questions/35892627/d3-map-d-attribute
  .attr("d", geoPath as any);

svg
  .selectAll("circle")
  .data(latLongCommunities)
  .enter()
  .append("circle")
  .attr("class", "marker")
  .attr("r", (d) => calculateRadiusBasedOnUnemploymentPercentage(d.name))
  .attr("cx", (d) => aProjection([d.long, d.lat])[0])
  .attr("cy", (d) => aProjection([d.long, d.lat])[1])
  .on("mouseover", function() {
    d3.select(this)
      .attr("class", "selected-marker")
      .style("cursor", "pointer");
  })
  .on("mouseout", function() {
    d3.select(this)
      .attr("class", "marker")
      .style("cursor", "default");
  })
  .on("click", function(event, d) {
    const percentage = unemploymentRate2023Q4.find((element) => element.name === d.name).value;
    alert(`Unemployment rate in ${d.name}: ${percentage}%`)
  });
