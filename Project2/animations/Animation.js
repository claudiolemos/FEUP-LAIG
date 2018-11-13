/**
* MyPlane class, which represents a rectangle object
*/
class Animation
{
	constructor(span)
	{
    this.span = span;
		this.currentMatrix;
		this.over = false;
		this.passedTime = 0;
	};

  update(){
  };

	apply(node){
		mat4.multiply(node.transformation, node.transformation, this.currentMatrix);
  };

	isAnimationOver(){
		return this.over;
	}

};
