/**
* MyPlane class, which represents a rectangle object
*/
class Animation
{
	constructor(span)
	{
    this.span = span;
		this.currentMatrix;
		this.matrix = mat4.create();
		mat4.identity(this.matrix);
		this.finished = false;
		this.time = 0;
	};

  update(){
  };

	apply(scene){
		scene.multMatrix(this.matrix);
  };

	isFinished(){
		return this.finished;
	}

};
