import * as d3 from "d3";
import * as topojson from "topojson-client";
import { coronaVirusAffectedByCountry } from "./stats";
const europejson = require("./europe.json");

// set the affected color scale
const color = d3
  .scaleThreshold<number, string>()
  .domain([0, 1, 100, 500, 700, 5000])
  .range([
    "#FFFFF",
    "#FFE8E5",
    "#F88F70",
    "#CD6A4E",
    "#A4472D",
    "#7B240E",
    "#540000",
  ]);

const assignCountryBackgroundColor = (countryName: string) => {
  const item = coronaVirusAffectedByCountry.find(
    (item) => item.country === countryName
  );
  return item ? color(item.affected) : color(0);
};

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
  .style("fill", function (d: any) {
    return assignCountryBackgroundColor(d.properties.geounit);
  });
