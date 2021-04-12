/**
 * Defines basis triangle for shadow of bug on triangle scenario
 * @param {setup} s The current canvas instance
 */
 const triangleSketch = (s) => {
    s.draggables = [],
    s.currentDraggable = null;

    s.setup = () => {
        s.createCanvas(500, 300, WEBGL);
        s.angleMode(RADIANS);

        s.mouseZ = 0

        t1.x = 200;
        t1.y = 200;
        t1.z = tz;
        t2.x = 200;
        t2.y = 100;
        t2.z = tz;
        t3.x = 300;
        t3.y = 200;
        t3.z = tz;
    
        s.draggables = [t1, t2, t3];
    }

    
    s.draw = () => {
        s.background(0);
        s.translate(-s.width / 2, -s.height / 2);
        
        // Axes
        s.stroke(0, 0, 255);
        s.strokeWeight(5);
        s.line(5, -1000, 5, 1000);
        s.stroke(255, 0, 0);
        s.line(-1000, 5, 1000, 5);
    
        s.fill(255);
        s.stroke(0);
        s.draggables.forEach(d => d.draw(s));
    
        s.stroke(255);
        s.fill(255, 255, 255, 100);
        s.triangle(t1.x, t1.y, t2.x, t2.y, t3.x, t3.y);
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
            s.currentDraggable.x = s.mouseX;
            s.currentDraggable.y = s.mouseY;
        }
    }

    s.mouseReleased = () => {
        s.currentDraggable = null;
    }

    s.canDrag = (draggable) => {
        return math.abs(s.mouseX - draggable.x) < draggable.r / 2
            && math.abs(s.mouseY - draggable.y) < draggable.r / 2;
    }
}