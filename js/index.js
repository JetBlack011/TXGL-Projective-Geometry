/// <reference path="../p5.d.ts"/>
/// <reference path="../math.d.ts"/>

// Triangle points
let t1, t2, t3;

// Point light
let light;

// Projected shadow points
let p1, p2, p3;

function setup() {
    t1 = new Draggable();
    t2 = new Draggable();
    t3 = new Draggable();
    
    light = new Draggable();
    
    p1 = new Draggable();
    p2 = new Draggable();
    p3 = new Draggable();
}

let p5Triangle = new p5(triangleSketch, 'triangleSketch'),
    p5LightXY = new p5(lightXZSketch, 'lightXZSketch');
//    p5LightYZ = new p5(lightYZSketch),
//    p5Projection = new p5(projectionSketch);