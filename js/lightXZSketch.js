const lightXZSketch = (s) => {
    s.draggables = [],
    s.currentDraggable = null;

    s.setup = () => {
        s.createCanvas(500, 300, WEBGL);
        s.angleMode(RADIANS);

        light.x = 250;
        light.y = 175;
        light.z = 50;

        light.draw = function (s) {
            s.strokeWeight(1);
            if (this.isDragging(s)) {
                s.stroke(255, 0, 0, 0);
                s.circle(this.x, this.z, this.r);
                s.stroke(0);
            } else {
                s.circle(this.x, this.z, this.r);
            }
        }
    
        s.draggables = [light];
    }

    s.draw = () => {
        s.background(0);
        s.translate(-s.width / 2, -s.height / 2);
        
        // Axes
        s.stroke(0, 0, 255);
        s.strokeWeight(5);
        s.line(5, -1000, 5, 1000);
        s.stroke(0, 255, 0);
        s.line(-1000, 5, 1000, 5);
    
        s.fill(255);
        s.stroke(0);
        s.draggables.forEach(d => d.draw(s));
    
        s.stroke(255);
        s.fill(255, 255, 255, 100);
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
            s.currentDraggable.z = s.mouseY;
        }
    }

    s.mouseReleased = () => {
        s.currentDraggable = null;
    }

    s.canDrag = (draggable) => {
        return math.abs(s.mouseX - draggable.x) < draggable.r / 2
            && math.abs(s.mouseY - draggable.z) < draggable.r / 2;
    }
}