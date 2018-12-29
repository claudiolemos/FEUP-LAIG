class BezierAnimation extends Animation
{
	constructor(span, controlpoints)
	{
    super(span);
    this.controlpoints = controlpoints;
	};

	copy(){
		return new BezierAnimation(this.span, this.controlpoints);
	};

	update(delta){
		if(this.percentage + delta/this.span < 1){
			this.time += delta;
			this.percentage += delta/this.span;
      this.updateMatrix(this.percentage);
		}
		else{
      this.updateMatrix(1);
			this.finished = true;
		}
  };

  updateMatrix(percentage){
    this.current = this.bezier(percentage);
    this.matrix = mat4.create();
		mat4.identity(this.matrix);
    mat4.translate(this.matrix, this.matrix, this.current);
  };

  bezier(s){
    let b1 = (1-s)*(1-s)*(1-s);
  	let b2 = 3*s*(1-s)*(1-s);
  	let b3 = 3*s*s*(1-s);
  	let b4 = s*s*s;

  	return vec3.fromValues(
  		b1*this.controlpoints[0][0]+b2*this.controlpoints[1][0]+b3*this.controlpoints[2][0]+b4*this.controlpoints[3][0],
  		b1*this.controlpoints[0][1]+b2*this.controlpoints[1][1]+b3*this.controlpoints[2][1]+b4*this.controlpoints[3][1],
  		b1*this.controlpoints[0][2]+b2*this.controlpoints[1][2]+b3*this.controlpoints[2][2]+b4*this.controlpoints[3][2]);
  };

	reset(){
		this.finished = false;
		this.time = 0;
		this.percentage = 0;
	};

};
