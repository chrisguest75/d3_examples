import * as d3 from "d3";

function create() {
    d3.select("body").append("h1").text("Insert a heading with D3");
    setInterval(update, 60)
}

var posx = 0;
function update() {
    let svg = d3.select("#svgcontainer").html("").append("svg");
    svg.append("circle")
    .attr("cx", posx++)
    .attr("cy", 100)
    .attr("r", 100)
    .attr("fill", "hsl(" + 50 + ", 70%, 63%)")
    .attr("fill-opacity", "1.00");       
}

create()