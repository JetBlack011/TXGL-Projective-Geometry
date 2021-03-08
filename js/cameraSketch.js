/// <reference path="../p5.d.ts"/>
/// <reference path="../math.d.ts"/>

const cameraSketch = (s) => {
    /**
    * Allows for WASD movement of camera
    */
    let cameraSpeed = 10,
        cameraX = 0, cameraY = 0, cameraZ,
        cameraLock = false,
        offsetZ = 0;
    
    // Define our rotation view
    // let alpha  = 0,
    //     beta   = 0,
    //     gamma  = 0,
    //     deltaX = -500,
    //     deltaY = -400;
    // let translation = math.matrix([
    //         [1, 0, 0, deltaX],
    //         [0, 1, 0, deltaY],
    //         [0, 0, 1, 0],
    //         [0, 0, 0, 1]
    //     ]),
    //     transformX = math.matrix([
    //         [1, 0, 0, 0],
    //         [0, math.cos(alpha), -math.sin(alpha), 0],
    //         [0, math.sin(alpha), math.cos(alpha), 0],
    //         [0, 0, 0, 1]
    //     ]),
    //     transformY = math.matrix([
    //         [math.cos(beta), 0, math.sin(beta), 0],
    //         [0, 1, 0, 0],
    //         [-math.sin(beta), 0, math.cos(beta), 0],
    //         [0, 0, 0, 1]
    //     ]),
    //     transformZ = math.matrix([
    //         [math.cos(gamma), -math.sin(gamma), 0, 0],
    //         [math.sin(gamma), math.cos(gamma), 0, 0],
    //         [0, 0, 1, 0],
    //         [0, 0, 0, 1]
    //     ]),
    //     transformation = math.multiply(transformZ, math.multiply(transformY, transformX)),
    //     transform = (x = 0, y = 0, z = 0) => {
    //         return math.multiply([x, y, z, 1], transformation).toArray();
    //     };
    
    s.draggables = [],
    s.currentDraggable = null;
    
    s.setup = () => {
        s.createCanvas(750, 500, WEBGL);
        s.angleMode(RADIANS);
    
        cameraZ = (height / 2) / math.tan(PI / 6) + 400;
    }
    
    s.draw = () => {
        s1.x = -(-light.z * t1.x + light.x * t1.z) / (light.z - t1.z);
        s1.y = -(-light.z * t1.y + light.y * t1.z) / (light.z - t1.z);
        s1.z = 0;
    
        s2.x = -(-light.z * t2.x + light.x * t2.z) / (light.z - t2.z);
        s2.y = -(-light.z * t2.y + light.y * t2.z) / (light.z - t2.z);
        s2.z = 0;
    
        s3.x = -(-light.z * t3.x + light.x * t3.z) / (light.z - t3.z);
        s3.y = -(-light.z * t3.y + light.y * t3.z) / (light.z - t3.z);
        s3.z = 0;

        s.background(0);
        //translate(-500, -400);
        s.stroke(255);
        s.fill(255, 255, 255, 100);
    
        s.strokeWeight(2);
        // X axis
        s.stroke(0, 0, 255);
        s.line(0, -1000, 0, 1000);
        // Y axis
        s.stroke(255, 0, 0);
        s.line(-1000, 0, 1000, 0);
        // Z axis
        s.stroke(0, 255, 0);
        s.line(0, 0, -1000, 0, 0, 1000);
    
        if (s.mouseX > 0 && s.mouseX < s.width && s.mouseY > 0 && s.mouseY < s.height && !cameraLock) {
            s.moveCamera();
            s.camera(cameraX, cameraY, cameraZ + offsetZ, cameraX + 3 * (s.mouseX - s.width / 2), cameraY + 3 * (s.mouseY - s.height / 2), offsetZ, 0, 1, 0);
        }
    
        // if (keyIsDown(ENTER)) {
        //     //applyMatrix(...transformation.toArray().flat());
        //     rotateY(math.PI / 2)
        // }
    
        // COMMENT IN FOR ROTATING TRIANGLE
        // s.rotateY(millis() * .001);
    
        s.stroke(255);
        s.fill(255, 255, 255, 100);

        let offset = -height * 2.5;

        s.line(t1.x, t1.y + offset, t1.z, t2.x, t2.y + offset, t2.z);
        s.line(t2.x, t2.y + offset, t2.z, t3.x, t3.y + offset, t3.z);
        s.line(t3.x, t3.y + offset, t3.z, t1.x, t1.y + offset, t1.z);

        s.line(s1.x, s1.y + offset, s1.z, s2.x, s2.y + offset, s2.z);
        s.line(s2.x, s2.y + offset, s2.z, s3.x, s3.y + offset, s3.z);
        s.line(s3.x, s3.y + offset, s3.z, s1.x, s1.y + offset, s1.z);
    
        // Lines
        s.line(light.x, light.y + offset, light.z, s1.x, s1.y + offset, s1.z);
        s.line(light.x, light.y + offset, light.z, s2.x, s2.y + offset, s2.z);
        s.line(light.x, light.y + offset, light.z, s3.x, s3.y + offset, s3.z);
    
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
        // line(80, 80, 80, s1.x, s1.y, s1.z);
        // line(80, 80, 80, s2.x, s2.y, s2.z);
        // line(80, 80, 80, s3.x, s3.y, s3.z);
        // stroke(255);
    
        // TESTING MANUAL MANIPULATION OF TRIANGLE--ANY WAY TO MAKE s.draggables IN 3D?
        // if (keyIsDown('G'.charCodeAt(0)))
        //     // rotateY(30);
        //     rotateY(millis() * .001);
        // if (keyIsDown('H'.charCodeAt(0)))
        //     rotateY(-30);
    
        // circle((s1.x + s2.x + s3.x) / 3, (s2.x + s2.x + s3.x) / 3, (s3.x + s2.x + s3.x) / 3);
    }
    
    s.moveCamera = () => {
        if (keyIsDown('D'.charCodeAt(0)))
            cameraX += cameraSpeed;
        if (keyIsDown('A'.charCodeAt(0)))
            cameraX -= cameraSpeed;
        if (keyIsDown('W'.charCodeAt(0)))
            cameraY -= cameraSpeed; // Awkward flipped axes
        if (keyIsDown('S'.charCodeAt(0)))
            cameraY += cameraSpeed;
    }

    s.mouseWheel = (e) => {
        offsetZ += e.delta;
    }

    s.keyPressed = () => {
        if (keyCode == ENTER)
            cameraLock ^= true;
    }
    
    // s.mousePressed = () => {
    //     for (let i = 0; i < s.draggables.length; ++i) {
    //         if (s.canDrag(s.draggables[i]) && !s.currentDraggable) {
    //             s.currentDraggable = s.draggables[i];
    //         }
    //     }
    // }
    
    // s.mouseDragged = () => {
    //     if (s.currentDraggable) {
    //         s.currentDraggable.x = mouseX;
    //         s.currentDraggable.y = mouseY;
    //     }
    // }
    
    // s.mouseReleased = () => {
    //     s.currentDraggable = null;
    // }
}