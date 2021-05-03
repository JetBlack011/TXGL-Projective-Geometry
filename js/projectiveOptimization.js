/// <reference path="../p5.d.ts"/>
/// <reference path="../math.d.ts"/>

let poly, dot, normal = 400;
let transform = math.identity(3);

function setup() {
    createCanvas(1000, 600);
    angleMode(RADIANS);

    // poly = [
    //     [0, 0],
    //     [1, 0],
    //     [1, 5],
    //     [0, 1]
    // ];
    
    // for (let i = 0; i < poly.length; i++) {
    //     poly[i] = new Point(poly[i][0], poly[i][1]);
    // }
    
    poly = generateRandomConvexPoly(15);

    normalize(poly);
}

function draw() {
    translate(width / 2, height / 2);
    stroke(255);
    strokeWeight(1);
    noFill();
    background(0);

    optimize(0.001);
    normalize(poly);

    // Draw circumcircle and incircle
    let circumcircle = makeCircle(poly);
    let incircle = polylabel([poly]);
    let roundness = incircle.r / circumcircle.r;

    circle(circumcircle.x, circumcircle.y, circumcircle.r * 2);
    circle(incircle.x, incircle.y, incircle.r * 2);

    document.getElementById('roundness').innerText = `Roundness = ${roundness.toFixed(4)}`;

    drawPoly();
    outputTransform();
}

function affineOptimize(rate) {
    let furthestPoints = findFurthestPoints(poly);
    let p1 = createVector(furthestPoints.p1.x, furthestPoints.p1.y);
    let p2 = createVector(furthestPoints.p2.x, furthestPoints.p2.y);

    let theta = p1.sub(p2).angleBetween(createVector(1, 0));

    let rot = getRotationMatrix(theta);
    let scale = getScaleMatrix((1 - rate) * (normal / furthestPoints.s), normal / furthestPoints.s);

    // det = math.det(scale);

    applyTransformation(rot, poly);
    transform = math.multiply(transform, rot);
    applyTransformation(scale, poly);
    transform = math.multiply(transform, scale);

    rot = getRotationMatrix(-theta);

    applyTransformation(rot, poly);
    transform = math.multiply(transform, rot);
}

function projectiveOptimize(rate) {

}

function optimize(rate) {
    // projectiveOptimize(rate);
    affineOptimize(rate);
}

// Point functions
function getCenterOfMass(points) {
    let totalMass = 0, totalx = 0, totaly = 0;

    for (let i = 0; i < points.length; i++) {
        totalMass++;
        totalx += points[i].x;
        totaly += points[i].y;
    }

    return new Point(totalx / totalMass, totaly / totalMass);
}

function findFurthestPoints(points) {
    let furthestPoints = new Point(0, 0), largestTotalDistance = 0;

    for (let i = 0; i < points.length; i++) {
        let furthestPoint = i, largestDistance = 0;

        for (let j = 0; j < points.length; j++) {
            let distance = dist(points[i].x, points[i].y, points[j].x, points[j].y);

            if (distance > largestDistance) {
                largestDistance = distance;
                furthestPoint = j;
            }
        }

        if (largestDistance > largestTotalDistance) {
            largestTotalDistance = largestDistance;
            furthestPoints = new Point(i, furthestPoint);
        }
    }

    return {p1: poly[furthestPoints.x], p2: poly[furthestPoints.y], s: largestTotalDistance};
}

// Centers and scales poly to fit in the field of view
function normalize() {
    let furthestPoints = findFurthestPoints(poly);
    let scale = getScaleMatrix(normal / furthestPoints.s, normal / furthestPoints.s);
    applyTransformation(scale, poly);
    
    let centerOfMass = getCenterOfMass(poly);
    let translation = getTranslateMatrix(-centerOfMass.x, -centerOfMass.y);
    applyTransformation(translation, poly);
    
    transform = math.multiply(transform, scale);
    transform = math.multiply(transform, translation);
}

// Matrix functions
function getRotationMatrix(theta) {
    return [
        [cos(theta), -sin(theta), 0],
        [sin(theta), cos(theta), 0],
        [0, 0, 1],
    ];
}

function getScaleMatrix(sx, sy) {
    return [
        [sx, 0, 0],
        [0, sy, 0],
        [0, 0, 1],
    ];
}

function getTranslateMatrix(tx, ty) {
    return [
        [1, 0, tx],
        [0, 1, ty],
        [0, 0, 1],
    ];
}

function getTwistMatrix(tx, ty) {
    return [
        [1, 0, 0],
        [0, 1, 0],
        [tx, ty, 1],
    ];
}

// Transform points by a matrix m
function applyTransformation(m, points) {
    for (let i = 0; i < points.length; i++) {
        let x = points[i].x, y = points[i].y;

        points[i].x = (m[0][2] + m[0][0] * x + m[0][1] * y) / (m[2][2] + m[2][0] * x + m[2][1] * y);
        points[i].y = (m[1][2] + m[1][0] * x + m[1][1] * y) / (m[2][2] + m[2][0] * x + m[2][1] * y);
    }
}

function generateRandomConvexPoly(n) {
    let angles = [];

    for (let i = 0; i < n; i++) {
        angles[i] = Math.random() * Math.PI * 2;
    }

    angles.sort();

    let poly = [];

    for (let i = 0; i < n; i++) {
        poly.push(new Point(Math.cos(angles[i]), Math.sin(angles[i])));
    }

    return poly;
}

// Output functions
function outputTransform() {
    let matrix = transform.toArray();
    let matrixString = '';

    for (let i = 0; i < matrix.length; i++) {
        matrixString += '[ ';
        for (let j = 0; j < matrix[i].length; j++)
            matrixString += matrix[i][j].toFixed(3) + ' ';
        matrixString += ']\n';
    }

    document.getElementById('matrix').innerText = matrixString;
}

function drawPoly() {
    stroke(255, 0, 0);
    strokeWeight(5);
    // point(...dot);

    fill(255);

    for (let i = 0; i < poly.length; i++) {
        stroke(255);
        strokeWeight(5);
        point(poly[i].x, poly[i].y);
        
        strokeWeight(1);
        line(poly[i].x, poly[i].y, poly[(i + 1) % poly.length].x, poly[(i + 1) % poly.length].y);

        // stroke(255);
        // strokeWeight(1);

        // for (let j = 0; j < poly.length; j++) {
        //     line(poly[i].x, poly[i].y, poly[j].x, poly[j].y);
        // }

        // stroke(100);
        // point(poly[i].x, poly[i].y);
        // line(poly[i].x, poly[i].y, poly[(i + 1) % poly.length].x, poly[(i + 1) % poly.length].y);
    }
}


// Array manipulation
function equal(m1, m2) {
    if (!Array.isArray(m1) && !Array.isArray(m2)) {
        return m1 === m2;
    }

    if (m1.length !== m2.length) {
        return false;
    }

    for (let i = 0, len = m1.length; i < len; i++) {
        if (!equal(m1[i], m2[i])) {
            return false;
        }
    }

    return true;
}

function deepCopy(arr) {
    let copy = new Array(arr.length);
    for (let i = 0; i < arr.length; i++) {
        copy[i] = arr[i].slice(0);
    }
}