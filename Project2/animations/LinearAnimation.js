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
		this.percentagesPerVector = [];
		this.calculateVectors();
	};

	copy(){
		return new LinearAnimation(this.span, this.controlpoints);
	};

	calculateVectors(){
		var totalDistance = 0;

		for(var i = 0; i < this.controlpoints.length - 1; i++){
			var vector1 = vec3.fromValues(this.controlpoints[i][0],this.controlpoints[i][1],this.controlpoints[i][2]);
			var vector2 = vec3.fromValues(this.controlpoints[i+1][0],this.controlpoints[i+1][1],this.controlpoints[i+1][2]);
			var vector = vec3.create();
			vec3.subtract(vector,vector2,vector1);
			this.vectors.push(vector);
			totalDistance += vec3.length(vector);
		}

		for(var i = 0; i < this.vectors.length; i++)
			this.percentagesPerVector.push(vec3.length(this.vectors[i])/totalDistance);
	};

  update(delta){
		if(this.percentage + delta/this.span < 1){
			this.time += delta;
			this.percentage += delta/this.span;
			var vectorsPercentage = 0;
			for(var i = 0; i < this.vectors.length; i++){
				if(this.percentage < this.percentagesPerVector[i] + vectorsPercentage){
					this.updateMatrix(this.getVector(i,(this.percentage - vectorsPercentage)/this.percentagesPerVector[i]), this.getAngle(i));
					break;
				}
				else
					vectorsPercentage += this.percentagesPerVector[i];
			}
		}
		else{
			this.updateMatrix(this.getVector(this.vectors.length-1, 1), this.getAngle(this.vectors.length-1));
			this.finished = true;
		}
  };


	updateMatrix(vector, angle){
		var matrix = mat4.create();
		mat4.identity(matrix);
		mat4.translate(matrix, matrix, vector);
		mat4.rotateY(matrix, matrix, angle);
		this.matrix = matrix;
	};

	getVector(n, p){
		var vector = vec3.fromValues(this.controlpoints[0][0],this.controlpoints[0][1],this.controlpoints[0][2]);

		for(var i = 0; i < n; i++)
			vec3.add(vector,vector,this.vectors[i]);

		vec3.add(vector, vector, vec3.fromValues(this.vectors[n][0]*p, this.vectors[n][1]*p, this.vectors[n][2]*p));
		return vector;
	};

	getAngle(i){
			if(this.vectors[i][2] == 0 && this.vectors[i][0] == 0)
				return 0;
			else
				return Math.atan2(1,0) - Math.atan2(this.vectors[i][2],this.vectors[i][0]);
	};

};
