import * as d3 from "d3";

function create() {
     d3.select("body").append("h1").text("Insert a heading with D3");
    setInterval(update, 60)
}

function update() {
}
