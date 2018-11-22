/**
* MyPlane class, which represents a rectangle object
*/
class CircularAnimation extends Animation
{
	constructor(span, center, radius, startang, rotang)
	{
    super(span);
    this.center = center;
    this.radius = radius;
    this.angle = startang;
    this.startang = startang;
    this.rotang = rotang;
	};

	copy(){
		return new CircularAnimation(this.span, this.center, this.radius, this.startang, this.rotang);
	};

	update(delta){
		if(this.percentage + delta/this.span < 1){
			this.time += delta;
			this.percentage += delta/this.span;
			this.angle += this.rotang*(delta/this.span);
			this.updateMatrix(this.angle);
		}
		else{
			this.updateMatrix(this.startang + this.rotang);
			this.finished = true;
		}
  };

	updateMatrix(angle){
		var matrix = mat4.create();
		mat4.identity(matrix);
		mat4.translate(matrix, matrix, this.center);
		mat4.translate(matrix, matrix, vec3.fromValues(Math.cos(angle)*this.radius,0,Math.sin(angle)*this.radius));
		mat4.rotateY(matrix, matrix, -angle);
		this.matrix = matrix;
	};

};
