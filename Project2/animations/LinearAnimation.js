/**
* MyPlane class, which represents a rectangle object
*/
class LinearAnimation extends Animation
{
	constructor(span, controlpoints)
	{
    super(span);
    this.controlpoints = controlpoints;
		this.vectors = [];
		this.vectorsLength = [];
		this.vectorsTime = [];
		this.totalDistance = 0;
		this.calculateVectors();
		this.calculateTime();
	};

	calculateVectors(){
		for(var i = 0; i < this.controlpoints.length - 1; i++){
			var vector = vec3.fromValues(this.controlpoints[i+1][0] - this.controlpoints[i][0],
															 this.controlpoints[i+1][1] - this.controlpoints[i][1],
															 this.controlpoints[i+1][2] - this.controlpoints[i][2]);

			this.vectors.push(vector);
			this.totalDistance += vec3.length(vector);
			this.vectorsLength.push(vec3.length(vector));
		}
	};

	calculateTime(){
		for(var i = 0; i < this.vectors.length; i++)
			this.vectorsTime.push((this.vectorsLength[i]/this.totalDistance)*this.span);
	}

	updateMatrix(vector, percentage){
		var matrix = mat4.create();
		mat4.identity(matrix);
		mat4.translate(matrix, matrix,[vector[0]*percentage,vector[1]*percentage,vector[2]*percentage]);
		this.currentMatrix = matrix;
	}

  update(delta){
		if(this.passedTime + delta < this.span){
			this.passedTime += delta;
			var previousVectors = 0;
			for(var i = 0; i < this.vectorsTime.length; i++){
				if(this.passedTime < this.vectorsTime[i] + previousVectors){
					this.updateMatrix(this.vectors[i], delta/this.vectorsTime[i]);
				}
				else
					previousVectors += this.vectorsTime[i];
			}
		}
		else
			this.over = true;
  };

	getAnimation(delta){
		if(this.animations.length > 0)
			return this.graph.animations[this.animations[0]].getVector(delta);
	}

};
