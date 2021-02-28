/**
 * Represents a draggable object
 */
class Draggable {
    /**
     * Create a new draggable object
     * @param {number} r The radius of this draggable
     * @param {function} draw Overrides the default draw function
     */
    constructor(x = 0, y = 0, z = 0, r = 10, draw = this.draw) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.r = r;
        this.draw = draw;
    }

    // /**
    //  * Determines if the mouse is within this draggable's radius
    //  */
    // canDrag(s, mouseX, mouseY) {
    //     return math.abs(mouseX - this.x) < this.r / 2
    //         && math.abs(mouseY - this.y) < this.r / 2;
    // }

    /**
     * Determines if the current object being dragged is this
     */
    isDragging(s) {
        return s.currentDraggable == this;
    }

    /**
     * Draw the draggable object to the screen, defaults to a point
     */
    draw(s) {
        s.strokeWeight(1);
        if (this.isDragging(s)) {
            s.stroke(255, 0, 0, 0);
            s.circle(this.x, this.y, this.r);
            s.stroke(0);
        } else {
            s.circle(this.x, this.y, this.r);
        }
    }
}