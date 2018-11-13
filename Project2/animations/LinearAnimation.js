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
		this.passedTime = 0;
		this.currentMatrix;
		this.over = false;
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

	getVector(deltaTime){
		if(this.passedTime + deltaTime < this.span){
			this.passedTime += deltaTime;
			var previousVectors = 0;
			for(var i = 0; i < this.vectorsTime.length; i++){
				if(this.passedTime < this.vectorsTime[i] + previousVectors){
					this.getMatrix(this.vectors[i], deltaTime/this.vectorsTime[i]);
					return this.currentMatrix;
				}
				else
					previousVectors += this.vectorsTime[i];
			}
		}
		else
			this.over = true;
	}

	getMatrix(vector, percentage){
		var matrix = mat4.create();
		mat4.identity(matrix);
		mat4.translate(matrix, matrix,[vector[0]*percentage,vector[1]*percentage,vector[2]*percentage]);
		this.currentMatrix = matrix;
	}

  update(){
  };

  apply(){
  };

};
