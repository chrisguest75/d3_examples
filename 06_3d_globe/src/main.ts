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

const points_per_circle = 20.0;
const radians = 2.0 * Math.PI;
const circle_radians = radians / points_per_circle;
let rotation_x = 0.0;
let rotation_y = 0.0;
let rotation_z = 0.0;
const rotation_xadd = radians / 200.0;
const rotation_yadd = radians / 200.0;
const rotation_zadd = radians / 200.0;
//const rotation_xadd = 0.0;
//const rotation_yadd = 0.0;
//const rotation_zadd = 0.0;

let points: Array<Point> = new Array<Point>();

function create() {
    d3.select("body").append("h1").text("Insert a heading with D3");

    for(let i = 0; i < points_per_circle; i++) {
        let ang = circle_radians * i; 
        let point_x = 0.0;
        let point_y = 300.0;
        let x = (point_x * Math.cos(ang)) - (point_y * Math.sin(ang));
        let y = (point_x * Math.sin(ang)) + (point_y * Math.cos(ang));
        let z = 20.0;
        points.push(new Point(x, y, z));    
    }

    setInterval(update, 60)
}

function update() {
    let svg = d3.select("#svgcontainer").html("").append("svg");

    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

    const center_x=vw/2.0, center_y=vh/2.0;

    for(let point of points) {
        let x = point.x
        let y = point.y
        let z = point.z

        let newx = (x * Math.cos(rotation_z)) - (y * Math.sin(rotation_z));
        let newy = (x * Math.sin(rotation_z)) + (y * Math.cos(rotation_z));
        let newz = z;

        x = newx
        y = newy
        z = newz

        newx = (x * Math.cos(rotation_y)) + (z * Math.sin(rotation_y));
        newy = y;
        newz = ((x * -1) * Math.sin(rotation_y)) + (z * Math.cos(rotation_y));

        x = newx
        y = newy
        z = newz

        newx = x;
        newy = (y * Math.cos(rotation_x)) - (z * Math.sin(rotation_x));
        newz = (y * Math.sin(rotation_x)) + (z * Math.cos(rotation_x));

        x = newx
        y = newy
        z = newz

        svg.append("circle")
        .attr("cx", x + center_x)
        .attr("cy", y + center_y)
        .attr("r", (z + 350.0) / 20.0)
        .attr("fill", "hsl(" + 50 + ", 70%, 63%)")
        .attr("fill-opacity", "0.50");           
    }

    rotation_x += rotation_xadd;
    rotation_y += rotation_yadd;
    rotation_z += rotation_zadd;
}

create()