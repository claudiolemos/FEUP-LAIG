/**
 * LinearAnimation class, which represents a polygonal
 * trajectory animation based on control points
 */
class LinearAnimation extends Animation {
  /**
   * @constructor
   * @param {number} span          duration of the animation in milliseconds
   * @param {array}  controlpoints control points of the trajectory
   */
  constructor(span, controlpoints) {
    super(span);
    this.controlpoints = controlpoints;
    this.vectors = [];
    this.percentagesPerVector = [];
    this.calculateVectors();
  };

  /**
   * Returns a copy of the animation, in order to prevent conflicts when
   * different nodes reference the same animation
   * @return {LinearAnimation} new instance of the animation
   */
  copy() {
    return new LinearAnimation(this.span, this.controlpoints);
  };

  /**
   * Calculates the animation line segment vectors based on the control points,
   * while also calculating the percentage that each vector will take to animate
   */
  calculateVectors() {
    var totalDistance = 0;

    for (var i = 0; i < this.controlpoints.length - 1; i++) {
      var vector1 = vec3.fromValues(this.controlpoints[i][0], this.controlpoints[i][1], this.controlpoints[i][2]);
      var vector2 = vec3.fromValues(this.controlpoints[i + 1][0], this.controlpoints[i + 1][1], this.controlpoints[i + 1][2]);
      var vector = vec3.create();
      vec3.subtract(vector, vector2, vector1);
      this.vectors.push(vector);
      totalDistance += vec3.length(vector);
    }

    for (var i = 0; i < this.vectors.length; i++)
      this.percentagesPerVector.push(vec3.length(this.vectors[i]) / totalDistance);
  };

  /**
   * Updates the linear animation matrix, depending on
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
      var vectorsPercentage = 0;
      for (var i = 0; i < this.vectors.length; i++) {
        if (this.percentage < this.percentagesPerVector[i] + vectorsPercentage) {
          this.updateMatrix(this.getVector(i, (this.percentage - vectorsPercentage) / this.percentagesPerVector[i]), this.getAngle(i));
          break;
        } else
          vectorsPercentage += this.percentagesPerVector[i];
      }
    } else {
      this.updateMatrix(this.getVector(this.vectors.length - 1, 1), this.getAngle(this.vectors.length - 1));
      this.finished = true;
    }
  };

  /**
   * Updates the animation matrix, applying the current
   * animation position and angle to an identity matrix
   * @param  {vec3} vector 	 vector that represents the current position of the animation
   * @param  {number} angle  current angle that makes the object face the direction of the animation
   */
  updateMatrix(vector, angle) {
    var matrix = mat4.create();
    mat4.identity(matrix);
    mat4.translate(matrix, matrix, vector);
    mat4.rotateY(matrix, matrix, angle);
    this.matrix = matrix;
  };

  /**
   * Returns a vector that represents the current position
   * @param  {number} n 				 index of the line segment on which the animation is currently at
   * @param  {number} percentage current animation percentage
   * @return {vec3} current position
   */
  getVector(n, percentage) {
    var vector = vec3.fromValues(this.controlpoints[0][0], this.controlpoints[0][1], this.controlpoints[0][2]);

    for (var i = 0; i < n; i++)
      vec3.add(vector, vector, this.vectors[i]);

    vec3.add(vector, vector, vec3.fromValues(this.vectors[n][0] * percentage, this.vectors[n][1] * percentage, this.vectors[n][2] * percentage));
    return vector;
  };

  /**
   * Calculates the angle that will make the object face the direction of the animation
   * @param  {number} i index of the line segment on which the animation is currently at
   * @return {number} angle
   */
  getAngle(i) {
    if (this.vectors[i][2] == 0 && this.vectors[i][0] == 0)
      return 0;
    else
      return Math.atan2(1, 0) - Math.atan2(this.vectors[i][2], this.vectors[i][0]);
  };

  /**
   * Resets the linear animation.
   */
  reset() {
    this.finished = false;
    this.time = 0;
    this.percentage = 0;
  };
};
