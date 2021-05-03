/// <reference path="../p5.d.ts"/>
/// <reference path="../math.d.ts"/>

const affineOptimizationSketch = (s) => {
    s.normal = 400;
    s.rate = 0.003;
    s.transform = math.identity(3);
    
    s.draggables = [];
    s.currentDraggable = null;
    
    s.setup = () => {
        s.createCanvas(1000, 600);
        s.angleMode(RADIANS);
    
        // s.poly = [
        //     [0, 0],
        //     [1, 0],
        //     [1, 5],
        //     [0, 1]
        // ];

        s.poly = generateRandomConvexPoly(10);
        
        for (let i = 0; i < s.poly.length; i++) {
            s.poly[i] = new Draggable(s.poly[i][0], s.poly[i][1]);
            s.draggables.push(s.poly[i]);
        }
    
        s.normalize();
    }
    
    s.draw = () => {
        s.translate(s.width / 2, s.height / 2);
        s.stroke(255);
        s.strokeWeight(1);
        s.noFill();
        s.background(0);
    
        if (!s.currentDraggable) {
            s.optimize(s.rate);
            s.normalize();
        }
    
        // Draw circumcircle and incircle
        let circumcircle = makeCircle(s.poly);
        let incircle = makeIncircle([s.poly]);
        let roundness = incircle.r / circumcircle.r;
    
        s.strokeWeight(0.5);
        s.circle(circumcircle.x, circumcircle.y, circumcircle.r * 2);
        s.circle(incircle.x, incircle.y, incircle.r * 2);
    
        document.getElementById('roundness').innerText = `Roundness = ${roundness.toFixed(4)}`;
    
        s.drawPoly();
        s.outputTransform();
    }
    
    s.optimize = (rate) => {
        let furthestPoints = findFurthestPoints(s.poly);
        let p1 = createVector(furthestPoints.p1.x, furthestPoints.p1.y);
        let p2 = createVector(furthestPoints.p2.x, furthestPoints.p2.y);
    
        let theta = p1.sub(p2).angleBetween(createVector(1, 0));
    
        let rot = rotationMatrix(theta);
        let scale = scaleMatrix((1 - rate) * (s.normal / furthestPoints.s), s.normal / furthestPoints.s);
    
        // det = math.det(scale);
    
        applyTransformation(rot, s.poly);
        s.transform = math.multiply(s.transform, rot);
        applyTransformation(scale, s.poly);
        s.transform = math.multiply(s.transform, scale);
    
        rot = rotationMatrix(-theta);
    
        applyTransformation(rot, s.poly);
        s.transform = math.multiply(s.transform, rot);
    }
    
    // Centers and scales poly to fit in the field of view
    s.normalize = () => {
        let furthestPoints = findFurthestPoints(s.poly);
        let scale = scaleMatrix(s.normal / furthestPoints.s, s.normal / furthestPoints.s);
        applyTransformation(scale, s.poly);
        
        let centerOfMass = getCenterOfMass(s.poly);
        let translation = translationMatrix(-centerOfMass.x, -centerOfMass.y);
        applyTransformation(translation, s.poly);
        
        s.transform = math.multiply(s.transform, scale);
        s.transform = math.multiply(s.transform, translation);
    }
    
    // Output functions
    s.outputTransform = () => {
        let matrix = s.transform.toArray();
        let matrixString = '';
    
        for (let i = 0; i < matrix.length; i++) {
            matrixString += '[ ';
            for (let j = 0; j < matrix[i].length; j++)
                matrixString += matrix[i][j].toFixed(3) + ' ';
            matrixString += ']\n';
        }
    
        document.getElementById('matrix').innerText = matrixString;
    }
    
    s.drawPoly = () => {
        // s.stroke(255, 0, 0);
        // s.strokeWeight(5);
        // point(...dot);

        // Draw center of mass
        s.stroke(255, 0, 0);
        s.strokeWeight(5);
        
        let centerOfMass = getCenterOfMass(s.poly);
        s.point(centerOfMass.x, centerOfMass.y)
    
        s.stroke(255);
        s.fill(255);
    
        for (let i = 0; i < s.poly.length; i++) {
            s.poly[i].draw(s);
            
            s.strokeWeight(1);
            s.line(s.poly[i].x, s.poly[i].y, s.poly[(i + 1) % s.poly.length].x, s.poly[(i + 1) % s.poly.length].y);
    
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

    s.mousePressed = () => {
        for (let i = 0; i < s.draggables.length; ++i) {
            if (s.canDrag(s.draggables[i]) && !s.currentDraggable) {
                s.currentDraggable = s.draggables[i];
            }
        }
    }

    s.mouseDragged = () => {
        if (s.currentDraggable) {
            s.currentDraggable.x = s.mouseX - s.width / 2;
            s.currentDraggable.y = s.mouseY - s.height / 2;
        }
    }

    s.mouseReleased = () => {
        s.currentDraggable = null;
    }

    s.canDrag = (draggable) => {
        return Math.abs(s.mouseX - s.width / 2 - draggable.x) < draggable.r / 2
            && Math.abs(s.mouseY - s.height / 2 - draggable.y) < draggable.r / 2;
    }
}
    
// Matrix functions
rotationMatrix = (theta) => [
    [cos(theta), -sin(theta), 0],
    [sin(theta), cos(theta), 0],
    [0, 0, 1],
];

scaleMatrix = (sx, sy) => [
    [sx, 0, 0],
    [0, sy, 0],
    [0, 0, 1],
];

translationMatrix = (tx, ty) => [
    [1, 0, tx],
    [0, 1, ty],
    [0, 0, 1],
];

twistMatrix = (tx, ty) => [
    [1, 0, 0],
    [0, 1, 0],
    [tx, ty, 1],
];

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

    return {p1: points[furthestPoints.x], p2: points[furthestPoints.y], s: largestTotalDistance};
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
        poly.push([Math.cos(angles[i]), Math.sin(angles[i])]);
    }

    return poly;
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