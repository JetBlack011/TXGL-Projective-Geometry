/// <reference path="../p5.d.ts"/>
/// <reference path="../math.d.ts"/>

let poly, newPoly, circumcircle = {x: 0, y: 0, r: Infinity}, prevCircle;
let normal = 300;
let transform = math.identity(3), det = 1;

function setup() {
    createCanvas(1000, 600);
    angleMode(RADIANS);

    poly = [
        [0, 0],
        [5, 5],
        [3, 5]
    ];

    newPoly = poly;

    let furthestPoints = findFurthestPoints(newPoly);
    let scale = getScaleMatrix(0.999 * (normal / furthestPoints.s), normal / furthestPoints.s);
    poly = applyTransformation(scale, poly);
}

function draw() {
    if (det >= 1) {
        translate(width / 2 - normal / 2, height / 2 - normal / 2);
        stroke(255);
        strokeWeight(1);
        noFill();
        background(0);
    
        let furthestPoints = findFurthestPoints(newPoly);
        let p1 = createVector(...furthestPoints.p1);
        let p2 = createVector(...furthestPoints.p2);
    
        let theta = p1.sub(p2).angleBetween(createVector(1, 0));
    
        let rot = getRotationMatrix(theta);
        let scale = getScaleMatrix(0.999 * (normal / furthestPoints.s), normal / furthestPoints.s);
    
        det = math.det(scale);
    
        prevTransform = transform;
    
        newPoly = applyTransformation(rot, newPoly);
        transform = math.multiply(transform, rot);
        newPoly = applyTransformation(scale, newPoly);
        transform = math.multiply(transform, scale);
    
        rot = getRotationMatrix(-theta);
    
        newPoly = applyTransformation(rot, newPoly);
        transform = math.multiply(transform, rot);
    
        prevCircle = circumcircle;
        circumcircle = findCircumcircle(newPoly, furthestPoints.p1, furthestPoints.p2);
    
        if (circumcircle.r === Infinity || det < 1) {
            circumcircle = prevCircle;
        }

        let matrix = transform.toArray();
        let matrixString = '';
        for (let i = 0; i < matrix.length; i++) {
            matrixString += '[ ';
            for (let j = 0; j < matrix[i].length; j++)
                matrixString += matrix[i][j].toFixed(3) + ' ';
            matrixString += ']\n';
        }

        document.getElementById('matrix').innerText = matrixString;
    
        circle(circumcircle.x, circumcircle.y, circumcircle.r * 2);
    
        fill(255);
        for (let i = 0; i < newPoly.length; i++) {
            stroke(255);
            strokeWeight(5);
            point(newPoly[i][0], newPoly[i][1]);
            stroke(100);
            point(poly[i][0], poly[i][1]);
            
            stroke(255);
            strokeWeight(1);
            line(newPoly[i][0], newPoly[i][1], newPoly[(i + 1) % newPoly.length][0], newPoly[(i + 1) % newPoly.length][1]);
            stroke(100);
            line(poly[i][0], poly[i][1], poly[(i + 1) % poly.length][0], poly[(i + 1) % poly.length][1]);
        }
    }
}

function findFurthestPoints(poly) {
    let furthestPoints = [0, 0], largestTotalDistance = 0;

    for (let i = 0; i < poly.length; i++) {
        let furthestPoint = i, largestDistance = 0;

        for (let j = 0; j < poly.length; j++) {
            let distance = dist(poly[i][0], poly[i][1], poly[j][0], poly[j][1]);

            if (distance > largestDistance) {
                largestDistance = distance;
                furthestPoint = j;
            }
        }

        if (largestDistance > largestTotalDistance) {
            largestTotalDistance = largestDistance;
            furthestPoints = [i, furthestPoint];
        }
    }

    return {p1: poly[furthestPoints[0]], p2: poly[furthestPoints[1]], s: largestTotalDistance};
}

function shift(poly, shiftX, shiftY) {
    poly.map(p => {
        p[0] += shiftX;
        p[1] += shiftY;
    });
}

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
        [0, 0, tx],
        [0, 0, ty],
        [0, 0, 1],
    ];
}

function applyTransformation(m, points) {
    let newPoints = new Array(points.length).fill(0);

    for (let i = 0; i < points.length; i++) {
        let x = points[i][0], y = points[i][1];

        newPoints[i] = new Array(2).fill(0);
        newPoints[i][0] = (m[0][2] + m[0][0] * x + m[0][1] * y) / (m[2][2] + m[2][0] * x + m[2][1] * y);
        newPoints[i][1] = (m[1][2] + m[1][0] * x + m[1][1] * y) / (m[2][2] + m[2][0] * x + m[2][1] * y);
    }

    return newPoints;
}

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

function findCircumcircle(poly, p1, p2) {
    let smallestRadius = Infinity;
    let bestCircle = {x: 0, y: 0, r: Infinity};
    let epsilon = 0.01;

    for (let i = 0; i < poly.length; i++) {
        if (!equal(poly[i], p1) && !equal(poly[i], p2)) {
            let circle = circleFromPoints(p1, p2, poly[i]);
            let isValid = true;
            
            for (let j = 0; j < poly.length; j++) {
                isValid &= dist(circle.x, circle.y, poly[j][0], poly[j][1]) <= circle.r + epsilon;
            }

            if (isValid)
                bestCircle = circle;
        }
    }

    return bestCircle;
}

function circleFromPoints(p1, p2, p3) {
    let a = p1[0] * (p2[1] - p3[1]) - p1[1] * (p2[0] - p3[0]) + p2[0] * p3[1] - p3[0] * p2[1];

    let b = (p1[0] * p1[0] + p1[1] * p1[1]) * (p3[1] - p2[1]) 
            + (p2[0] * p2[0] + p2[1] * p2[1]) * (p1[1] - p3[1])
            + (p3[0] * p3[0] + p3[1] * p3[1]) * (p2[1] - p1[1]);
    
    let c = (p1[0] * p1[0] + p1[1] * p1[1]) * (p2[0] - p3[0]) 
            + (p2[0] * p2[0] + p2[1] * p2[1]) * (p3[0] - p1[0]) 
            + (p3[0] * p3[0] + p3[1] * p3[1]) * (p1[0] - p2[0]);
    
    let x = -b / (2 * a);
    let y = -c / (2 * a);

    return {
        x: x,
        y: y,
        r: Math.hypot(x - p1[0], y - p1[1])
    };
}

// Credit: Sander Verdonschot
function generateRandomConvexPoly(n) {
    // Generate two lists of random X and Y coordinates
    let xPool = [];
    let yPool = [];

    for (let i = 0; i < n; i++) {
        xPool.push(Math.random());
        yPool.push(Math.random());
    }

    // Sort them
    xPool.sort();
    yPool.sort();

    // Isolate the extreme points
    let minX = xPool[0];
    let maxX = xPool[n - 1];
    let minY = yPool[0];
    let maxY = yPool[n - 1];

    // Divide the interior points into two chains & Extract the vector components
    let xVec = [];
    let yVec = [];

    let lastTop = minX, lastBot = minX;

    for (let i = 1; i < n - 1; i++) {
        let x = xPool[i];

        if (Math.random() < 0.5) {
            xVec.push(x - lastTop);
            lastTop = x;
        } else {
            xVec.push(lastBot - x);
            lastBot = x;
        }
    }

    xVec.push(maxX - lastTop);
    xVec.push(lastBot - maxX);

    let lastLeft = minY, lastRight = minY;

    for (let i = 1; i < n - 1; i++) {
        let y = yPool[i];

        if (Math.random() < 0.5) {
            yVec.push(y - lastLeft);
            lastLeft = y;
        } else {
            yVec.push(lastRight - y);
            lastRight = y;
        }
    }

    yVec.push(maxY - lastLeft);
    yVec.push(lastRight - maxY);

    // Randomly pair up the X- and Y-components
    shuffle(yVec, true);

    // Combine the paired up components into vectors
    let vec = [];

    for (let i = 0; i < n; i++) {
        vec.push([xVec[i], yVec[i]]);
    }

    // Sort the vectors by angle
    vec.sort(v => Math.atan2(v[1], v[0]));

    // Lay them end-to-end
    let x = 0, y = 0;
    let minPolyX = 0;
    let minPolyY = 0;
    let points = [];

    for (let i = 0; i < n; i++) {
        points.push([x, y]);

        x += vec[i][0];
        y += vec[i][1];

        minPolyX = Math.min(minPolyX, x);
        minPolyY = Math.min(minPolyY, y);
    }

    // Move the polygon to the original min and max coordinates
    let xShift = minX - minPolyX;
    let yShift = minY - minPolyY;

    for (let i = 0; i < n; i++) {
        let p = points[i];
        points[i] = [p[0] + xShift, p[1] + yShift];
    }

    return points;
}