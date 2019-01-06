/**
 * CircularAnimation class, which represents a circular trajectory animation
 */
class CircularAnimation extends Animation {
  /**
   * @constructor
   * @param {number} span     duration of the animation in milliseconds
   * @param {vec3}   center   center position of the trajectory
   * @param {number} radius   radius of the circular trajectory
   * @param {number} startang angle in which the animation will start
   * @param {number} rotang   total angle rotation of the trajectory
   */
  constructor(span, center, radius, startang, rotang) {
    super(span);
    this.center = center;
    this.radius = radius;
    this.angle = startang;
    this.startang = startang;
    this.rotang = rotang;
    this.offset = rotang > 0 ? 0 : Math.PI;
  };

  /**
   * Returns a copy of the animation, in order to prevent conflicts when
   * different nodes reference the same animation
   * @return {CircularAnimation} new instance of the animation
   */
  copy() {
    return new CircularAnimation(this.span, this.center, this.radius, this.startang, this.rotang);
  };

  /**
   * Updates the circular animation matrix, depending on
   * the current percentage of animation completed.
   * While the percentage doesn't reach 100, it will update the current span and
   * percentage of animation, and update the animation matrix accordingly.
   * When the percentage reaches 100, it will update
   * the matrix representing the completed animation.
   *
   * @param  {number} delta time in milliseconds since last update
   */
  update(delta) {
    if (this.percentage + delta / this.span < 1) {
      this.time += delta;
      this.percentage += delta / this.span;
      this.angle += this.rotang * (delta / this.span);
      this.updateMatrix(this.angle);
    } else {
      this.updateMatrix(this.startang + this.rotang);
      this.finished = true;
    }
  };

  /**
   * Updates the animation matrix, applying the current angle of the circular
   * trajectory to an identity matrix, while also positioning it in the correct
   * position based on the trajectory radius
   * @param  {number} angle current angle of the trajectory
   */
  updateMatrix(angle) {
    var matrix = mat4.create();
    mat4.identity(matrix);
    mat4.translate(matrix, matrix, this.center);
    mat4.translate(matrix, matrix, vec3.fromValues(Math.cos(angle) * this.radius, 0, Math.sin(angle) * this.radius));
    mat4.rotateY(matrix, matrix, -angle + this.offset);
    this.matrix = matrix;
  };

  /**
   * Resets the circular animation.
   */
  reset() {
    this.finished = false;
    this.time = 0;
    this.percentage = 0;
    this.angle = this.startang;
  };

};
