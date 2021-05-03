/// <reference path="../p5.d.ts"/>
/// <reference path="../math.d.ts"/>

// Triangle points
let t1, t2, t3, b;
let tz = 100;

// Point light
let light;

// Projected shadow points
let s1, s2, s3, bs;

function setup() {

}

// function setup() {
//     t1 = new Draggable();
//     t2 = new Draggable();
//     t3 = new Draggable();
//     b = new Draggable();
    
//     light = new Draggable();
    
//     s1 = new Draggable();
//     s2 = new Draggable();
//     s3 = new Draggable();
//     bs = new Draggable();
// }

// let p5Triangle = new p5(triangleSketch, 'triangleSketch'),
//     p5LightXY = new p5(lightXZSketch, 'lightXZSketch'),
//     p5LightYZ = new p5(lightZYSketch, 'lightZYSketch'),
//     p5Projection = new p5(cameraSketch, 'cameraSketch');

// let p5Affine = new p5(affineOptimizationSketch, 'affineOptimizationSketch');
let p5Projective = new p5(projectiveOptimizationSketch, 'projectiveOptimizationSketch');