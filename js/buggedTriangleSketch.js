/**
 * Defines basis triangle for shadow of bug on triangle scenario
 * @param {setup} s The current canvas instance
 */
 const buggedTriangleSketch = (s) => {
    s.draggables = [],
    s.currentDraggable = null;

    s.setup = () => {
        s.createCanvas(500, 300, WEBGL);
        s.angleMode(RADIANS);

        s.mouseZ = 0

        p1.x = 200;
        p1.y = 200;
        p2.x = 200;
        p2.y = 100;
        p3.x = 300;
        p3.y = 200;
    
        s.draggables = [p1, p2, p3];
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
        s.triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
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