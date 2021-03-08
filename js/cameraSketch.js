/// <reference path="../p5.d.ts"/>
/// <reference path="../math.d.ts"/>
/**
 * Allows for WASD mvmt of camera
 */
let cameraSpeed = 10,
    cameraX = 0, cameraY = 0, cameraZ;

let p1, p2, p3;

// Define our rotation view
let alpha  = 0,
    beta   = 0,
    gamma  = 0,
    deltaX = -500,
    deltaY = -400;
let translation = math.matrix([
        [1, 0, 0, deltaX],
        [0, 1, 0, deltaY],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ]),
    transformX = math.matrix([
        [1, 0, 0, 0],
        [0, math.cos(alpha), -math.sin(alpha), 0],
        [0, math.sin(alpha), math.cos(alpha), 0],
        [0, 0, 0, 1]
    ]),
    transformY = math.matrix([
        [math.cos(beta), 0, math.sin(beta), 0],
        [0, 1, 0, 0],
        [-math.sin(beta), 0, math.cos(beta), 0],
        [0, 0, 0, 1]
    ]),
    transformZ = math.matrix([
        [math.cos(gamma), -math.sin(gamma), 0, 0],
        [math.sin(gamma), math.cos(gamma), 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ]),
    transformation = math.multiply(transformZ, math.multiply(transformY, transformX)),
    transform = (x = 0, y = 0, z = 0) => {
        return math.multiply([x, y, z, 1], transformation).toArray();
    };

let draggables = [],
    currentDraggable = null;

class Draggable {
    /**
     * Create a new draggable object
     * @param {number} r The radius of this draggable
     * @param {function} draw Overrides the default draw function
     */
    constructor(x = 0, y = 0, r = 10, draw = this.draw) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.draw = draw;
    }

    /**
     * Determines if the mouse is within this draggable's radius
     */
    canDrag() {
        let transformedPos = transform(this.x, this.y);
        return Math.abs(mouseX - transformedPos[0]) < this.r / 2
            && Math.abs(mouseY - transformedPos[1]) < this.r / 2;
    }

    /**
     * Determines if the current object being dragged is this
     */
    isDrag() {
        return currentDraggable == this;
    }

    /**
     * Draw the draggable object to the screen, defaults to a point
     */
    draw() {
        let transformedPos = transform(this.x, this.y);
        if (this.isDrag()) {
            stroke(255, 0, 0, 0);
            strokeWeight(1); 
            circle(this.x, this.y, this.r);
            circle(transformedPos[0], transformedPos[1], this.r);
            stroke(0);
        } else {
            circle(this.x, this.y, this.r);
            circle(transformedPos[0], transformedPos[1], this.r);
        }
    }
}

function setup() {
    createCanvas(1000, 800, WEBGL);
    angleMode(RADIANS);

    // cameraX = width / 2;
    // cameraY = height / 2;
    cameraZ = (height / 2) / tan(PI/6);

    p1 = new Draggable(0, 0);
    p2 = new Draggable(100, 100);
    p3 = new Draggable(100, -100);

    draggables = [p1, p2, p3];
}

function draw() {
    background(0);
    //translate(-500, -400);
    stroke(255);
    fill(255, 255, 255, 100);
    circle(mouseX, mouseY, 10);

    strokeWeight(2);
    // X axis
    stroke(0, 0, 255);
    line(0, -1000, 0, 1000);
    // Y axis
    stroke(255, 0, 0);
    line(-1000, 0, 1000, 0);
    // Z axis
    stroke(0, 255, 0);
    line(0, 0, -1000, 0, 0, 1000);

    moveCamera();
    camera(cameraX, cameraY, cameraZ, mouseX * 3 + cameraX - width * 3 / 2, mouseY * 3 + cameraY - height * 3 / 2 , 0, 0, 1, 0);

    // if (keyIsDown(ENTER)) {
    //     //applyMatrix(...transformation.toArray().flat());
    //     rotateY(math.PI / 2)
    // }

    // COMMENT IN FOR ROTATING TRIANGLE
    rotateY(millis() * .001);

    fill(255);
    stroke(0);
    draggables.forEach(d => d.draw());

    stroke(255);
    fill(255, 255, 255, 100);
    triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);

    // translate(mouseX, mouseY, 0);
    // normalMaterial();
    // push();
    // rotateZ(frameCount * 0.01);
    // rotateX(frameCount * 0.01);
    // rotateY(frameCount * 0.01);
    // triangle(0, 0, 250, 0, 0, 250);
    // pop();


    // BUG, BUGGED TRIANGLE BELOW
    
    // SIMULATE SHADOW WITH LINES FROM SOURCE THROUGH TRIANGLE VERTICES
    // line(80, 80, 80, p1.x, p1.y, p1.z);
    // line(80, 80, 80, p2.x, p2.y, p2.z);
    // line(80, 80, 80, p3.x, p3.y, p3.z);
    // stroke(255);

    // TESTING MANUAL MANIPULATION OF TRIANGLE--ANY WAY TO MAKE DRAGGABLES IN 3D?
    // if (keyIsDown('G'.charCodeAt(0)))
    //     // rotateY(30);
    //     rotateY(millis() * .001);
    // if (keyIsDown('H'.charCodeAt(0)))
    //     rotateY(-30);

    // circle((p1.x + p2.x + p3.x) / 3, (p2.x + p2.x + p3.x) / 3, (p3.x + p2.x + p3.x) / 3);
}

function moveTriangle() {
    if (keyIsDown('RIGHT_ARROW'.charCodeAt(0)))
        cameraX += cameraSpeed;
    if (keyIsDown('LEFT_ARROW'.charCodeAt(0)))
        cameraX -= cameraSpeed;
    if (keyIsDown('UP_ARROW'.charCodeAt(0)))
        cameraY -= cameraSpeed; // Awkward flipped axes
    if (keyIsDown('DOWN_ARROW'.charCodeAt(0)))
        cameraY += cameraSpeed;
}

function moveCamera() {
    if (keyIsDown('D'.charCodeAt(0)))
        cameraX += cameraSpeed;
    if (keyIsDown('A'.charCodeAt(0)))
        cameraX -= cameraSpeed;
    if (keyIsDown('W'.charCodeAt(0)))
        cameraY -= cameraSpeed; // Awkward flipped axes
    if (keyIsDown('S'.charCodeAt(0)))
        cameraY += cameraSpeed;
}

function mousePressed() {
    for (let i = 0; i < draggables.length; ++i) {
        if (draggables[i].canDrag() && !currentDraggable) {
            currentDraggable = draggables[i];
        }
    }
}

function mouseDragged() {
    if (currentDraggable) {
        currentDraggable.x = mouseX;
        currentDraggable.y = mouseY;
    }
}

function mouseReleased() {
    currentDraggable = null;
}