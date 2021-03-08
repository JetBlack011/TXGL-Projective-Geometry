/**
 * Defines light (and shadow) via lines stretching from point source to XZ plane, intersecting vertices of shape
 * @param {setup} s The current canvas instance
 */
const lightZYSketch = (s) => {
    s.draggables = [],
    s.currentDraggable = null;

    s.setup = () => {
        s.createCanvas(500, 300, WEBGL);
        s.angleMode(RADIANS);

        light.draw = function (s) {
            s.strokeWeight(1);
            if (this.isDragging(s)) {
                s.stroke(255, 0, 0, 0);
                s.circle(this.z, this.y, this.r);
                s.stroke(0);
            } else {
                s.circle(this.z, this.y, this.r);
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
        s.stroke(0, 0, 255);
        s.strokeWeight(5);
        s.line(5, -1000, 5, 1000);
        s.stroke(0, 255, 0);
        s.line(-1000, 5, 1000, 5);
    
        // Draggable points
        s.fill(255);
        s.stroke(0);
        s.draggables.forEach(d => d.draw(s));
    
        // Triangle fill
        s.stroke(255);
        s.fill(255, 255, 255, 100);

        // Lines
        s.line(light.z, light.y, t1.z, t1.y);
        s.line(light.z, light.y, t2.z, t2.y);
        s.line(light.z, light.y, t3.z, t3.y);
        
        s.line(t1.z, t1.y, t2.z, t2.y);
        s.line(t2.z, t2.y, t3.z, t3.y);
        s.line(t3.z, t3.y, t1.z, t1.y);
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
            s.currentDraggable.z = s.mouseX;
            s.currentDraggable.y = s.mouseY;
        }
    }

    s.mouseReleased = () => {
        s.currentDraggable = null;
    }

    s.canDrag = (draggable) => {
        return math.abs(s.mouseX - draggable.z) < draggable.r / 2
            && math.abs(s.mouseY - draggable.y) < draggable.r / 2;
    }
}