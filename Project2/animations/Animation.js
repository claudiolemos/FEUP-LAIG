/**
* Animation class, which representes an animation that will be applied on a node
*/
class Animation
{
	/**
  * @constructor
  * @param {number} span duration of the animation in milliseconds
  */
	constructor(span)
	{
    this.span = span;
		this.matrix = mat4.create();
		mat4.identity(this.matrix);
		this.finished = false;
		this.time = 0;
		this.percentage = 0;
	};

	/**
	* Updates the animation matrix.
	* It is overridden on LinearAnimation and CircularAnimation.
	*/
  update(){
  };

	/**
	 * Applies the animation to the scene in which the node will be displayed
	 * @param {XMLScene} scene represents the CGFscene
	 */
	apply(scene){
		scene.multMatrix(this.matrix);
  };

	/**
	 * Checks if the animation has ended
	 * @return {boolean} value of finished
	 */
	isFinished(){
		return this.finished;
	};

};
