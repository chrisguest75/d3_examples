import * as d3 from "d3";

class Point {  
    x: number;
    y: number;
    z: number;  
  
    constructor(x: number, y: number, z: number) {
      this.x = x;
      this.y = y;
      this.z = z;
    }
  
  }

let points: Array<Point> = new Array<Point>();

function create() {
    d3.select("body").append("h1").text("Insert a heading with D3");

    const points_per_circle = 20.0;
    const radians = 2.0 * Math.PI;
    const circle_radians = radians / points_per_circle;

    for(let i = 0; i < points_per_circle; i++) {
        let ang = circle_radians * i; 
        let x = (0 * Math.cos(ang)) - (200.0 * Math.sin(ang));
        let y = (0 * Math.sin(ang)) + (200.0 * Math.cos(ang));
        let z = 10;
        points.push(new Point(x, y, z));    
    }

    // for(let z = 0; z < 10; z++) {
    //     for(let y = 0; y < 10; y++) {
    //         for(let x = 0; x < 10; x++) {
    //             points.push(new Point(x, y, z));    
    //         }
    //     }
    // }

    setInterval(update, 60)
    //update();
}

function update() {
    let svg = d3.select("#svgcontainer").html("").append("svg");

    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

    const center_x=vw/2.0, center_y=vh/2.0;

    for(let point of points) {
        svg.append("circle")
        .attr("cx", point.x + center_x)
        .attr("cy", point.y + center_y)
        .attr("r", point.z)
        .attr("fill", "hsl(" + 50 + ", 70%, 63%)")
        .attr("fill-opacity", "1.00");           
    }
}

create()