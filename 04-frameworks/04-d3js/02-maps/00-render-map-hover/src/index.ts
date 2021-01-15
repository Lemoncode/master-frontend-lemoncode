import * as d3 from "d3";
import * as topojson from "topojson-client";
const europejson = require("./europe.json");

const aProjection = d3
  .geoMercator()
  // Let's make the map bigger to fit in our resolution
  .scale(500)
  // Let's center the map
  .translate([300, 900]);

const geoPath = d3.geoPath().projection(aProjection);

const geojson = topojson.feature(
  europejson,
  europejson.objects.continent_Europe_subunits
);

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
  .attr("class", "country")
  // data loaded from json file
  .attr("d", geoPath as any)
  .on("mouseover", function (d, i) {
    d3.select(this).attr("class", "selected-country");
  })
  .on("mouseout", function (d, i) {
    d3.select(this).attr("class", "country");
  });
