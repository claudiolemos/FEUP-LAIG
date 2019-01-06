/**
 * BezierAnimation class, which represents a bezier trajectory animation
 */
class BezierAnimation extends Animation {
  /**
   * @constructor
   * @param {number} span         duration of the animation in milliseconds
   * @param {array} controlpoints control points of the trajectory
   */
  constructor(span, controlpoints) {
    super(span);
    this.controlpoints = controlpoints;
  };

  /**
   * Returns a copy of the animation, in order to prevent conflicts when
   * different nodes reference the same animation
   * @return {BezierAnimation} new instance of the animation
   */
  copy() {
    return new BezierAnimation(this.span, this.controlpoints);
  };

  /**
   * Updates the bezier animation matrix, depending on
   * the current percentage of animation completed.
   * While the percentage doesn't reach 100, it will update the current span and
   * percentage of animation, and update the animation matrix accordingly.
   * When the percentage reaches 100, it will update
   * the matrix representing the completed animation.
   * @param  {number} delta time in milliseconds since last update
   */
  update(delta) {
    if (this.percentage + delta / this.span < 1) {
      this.time += delta;
      this.percentage += delta / this.span;
      this.updateMatrix(this.percentage);
    } else {
      this.updateMatrix(1);
      this.finished = true;
    }
  };

  /**
   * Updates the animation matrix, applying the current
   * animation position and angle to an identity matrix
   * @param  {number} percentage current animation percentage
   */
  updateMatrix(percentage) {
    this.current = this.bezier(percentage);
    this.matrix = mat4.create();
    mat4.identity(this.matrix);
    mat4.translate(this.matrix, this.matrix, this.current);
  };

  /**
   * Calculates the current animation position
   * @param  {number} s current animation percentage
   * @return {vec3} current position of the animation
   */
  bezier(s) {
    let b1 = (1 - s) * (1 - s) * (1 - s);
    let b2 = 3 * s * (1 - s) * (1 - s);
    let b3 = 3 * s * s * (1 - s);
    let b4 = s * s * s;

    return vec3.fromValues(
      b1 * this.controlpoints[0][0] + b2 * this.controlpoints[1][0] + b3 * this.controlpoints[2][0] + b4 * this.controlpoints[3][0],
      b1 * this.controlpoints[0][1] + b2 * this.controlpoints[1][1] + b3 * this.controlpoints[2][1] + b4 * this.controlpoints[3][1],
      b1 * this.controlpoints[0][2] + b2 * this.controlpoints[1][2] + b3 * this.controlpoints[2][2] + b4 * this.controlpoints[3][2]);
  };

  /**
   * Resets the bezier animation.
   */
  reset() {
    this.finished = false;
    this.time = 0;
    this.percentage = 0;
  };

};
