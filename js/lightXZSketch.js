/**
 * Defines light (and shadow) via lines stretching from point source to XZ plane, intersecting vertices of shape
 * @param {setup} s The current canvas instance
 */
const lightXZSketch = (s) => {
    s.draggables = [],
    s.currentDraggable = null;

    s.setup = () => {
        s.createCanvas(500, 300, WEBGL);
        s.angleMode(RADIANS);

        light.x = 250;
        light.y = 175;
        light.z = 200;

        light.draw2 = function (s) {
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

    /**
     * Define canvas axes, background color, draggable components
     */
    s.draw = () => {
        s.background(0);
        s.translate(-s.width / 2, -s.height / 2);
        
        // Axes
        s.stroke(0, 255, 0);
        s.strokeWeight(5);
        s.line(5, -1000, 5, 1000);
        s.stroke(255, 0, 0);
        s.line(-1000, 5, 1000, 5);
    
        // Draggable points
        s.fill(255);
        s.stroke(0);
        light.draw2(s);
    
        // Triangle fill
        s.stroke(255);
        s.fill(255, 255, 255, 100);

        // Lines
        s.line(light.x, light.z, t1.x, t1.z);
        s.line(light.x, light.z, t2.x, t2.z);
        s.line(light.x, light.z, t3.x, t3.z);
        
        s.line(t1.x, t1.z, t2.x, t2.z);
        s.line(t2.x, t2.z, t3.x, t3.z);
        s.line(t3.x, t3.z, t1.x, t1.z);
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