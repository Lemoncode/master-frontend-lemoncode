import * as d3 from "d3";
import * as topojson from "topojson-client";
const europejson = require("./eurobasket.json");
import { finalStandingsEurobasket2022 } from "./stats";

// set the affected color scale
const color = d3
  .scaleOrdinal([
    "gold",
    "silver",
    "#b58e4e", //bronze
    "#006400",
    "#6D9062",
    "#DFF8D5",
    "#74B2DF",
    "black",
  ])
  .domain([
    "champion",
    "runner-up",
    "bronze",
    "semifinals",
    "quarterfinals",
    "knockout-stage",
    "group-stage",
    "DSQ",
  ]);

const assignCountryBackgroundColor = (countryName: string) => {
  const item = finalStandingsEurobasket2022.find(
    (item) => item.country === countryName
  );
  return item ? color(item.result) : "white";
};

const aProjection = d3.geoMercator();

const geoPath = d3.geoPath().projection(aProjection);

const geojson = topojson.feature(
  europejson,
  europejson.objects.continent_Europe_subunits
);

aProjection.fitSize([1024, 800], geojson);

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", 1024)
  .attr("height", 800)
  .attr("style", "background-color: #FBFAF0");

// Define the div for the tooltip
const div = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

svg
  .selectAll("path")
  .data(geojson["features"])
  .enter()
  .append("path")
  .attr("class", "country")
  .style("fill", function (d: any) {
    return assignCountryBackgroundColor(d.properties.geounit);
  })
  // use geoPath to convert the data into the current projection
  // https://stackoverflow.com/questions/35892627/d3-map-d-attribute
  .attr("d", geoPath as any)
  .on("mouseover", function (mouseEvent: MouseEvent, datum: any) {
    d3.select(this).attr("class", "selected-country");
    const country = datum.properties.geounit;
    const item = finalStandingsEurobasket2022.find(
      (item) => item.country === country
    );
    const countryResult = item ? item.result : "DNQ";

    const coords = { x: mouseEvent.pageX, y: mouseEvent.pageY };
    div.transition().duration(200).style("opacity", 0.9);
    div
      .html(`<span>${country}: ${countryResult}</span>`)
      .style("left", `${coords.x}px`)
      .style("top", `${coords.y - 28}px`);
  })
  .on("mouseout", function () {
    d3.select(this).attr("class", "country");
    div.transition()
      .duration(500)
      .style("opacity", 0);
  });