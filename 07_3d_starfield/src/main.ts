import * as d3 from "d3";

class Point {  
    x: number;
    y: number;
    z: number;  
    hue: number; 
  
    constructor(x: number, y: number, z: number, hue: number) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.hue = hue;
    }
  
  }

const radians = 2.0 * Math.PI;
let rotation_x = 0.0;
let rotation_y = 0.0;
let rotation_z = 0.0;
const rotation_xadd = radians / 2500.0;
const rotation_yadd = radians / 2200.0;
const rotation_zadd = radians / 2600.0;
//const rotation_xadd = 0.0;
//const rotation_yadd = 0.0;
//const rotation_zadd = 0.0;

let points: Array<Point> = new Array<Point>();

function create() {
    //d3.select("body").append("h1").text("Insert a heading with D3");

    const stars = 2000.0;
    const box_size = 2000.0;
    for(let i = 0; i < stars; i++) {
        let x = (Math.random() * box_size) - (box_size / 2);
        let y = (Math.random() * box_size) - (box_size / 2);
        let z = (Math.random() * box_size) - (box_size / 2);
        points.push(new Point(x, y, z, 250));    
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

        // calculate opacity and radius
        var opacity = 1.0;
        var pz = 1000/z;
        if (pz > 10.0) {
            opacity -= (pz / 100.0);
            if (opacity <= 0.0) {
                pz = -1.0;
            } else {
                pz = 10.0
            }
        }
        if (z >= 0.0) {
            svg.append("circle")
            .attr("cx", x + center_x)
            .attr("cy", y + center_y)
            .attr("r", pz) 
            .attr("fill", "hsl(" + point.hue + ", 70%, 63%)")
            .attr("fill-opacity", opacity);                           
        }
    }

    rotation_x += rotation_xadd;
    rotation_y += rotation_yadd;
    rotation_z += rotation_zadd;
}

create()