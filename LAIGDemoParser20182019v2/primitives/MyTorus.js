/**
* MyTorus
* @param gl {WebGLRenderingContext}
* @constructor
*/

class MyTorus extends CGFobject
{
	constructor(scene, inner, outer, slices, loops)
	{
		super(scene);
		this.inner = inner;
		this.outer = outer;
		this.slices = slices;
		this.loops = loops;
		this.vertices = [];
		this.indices = [];
		this.normals = [];

		this.minS = 0;
		this.maxS = 1;
		this.minT = 0;
		this.maxT = 1;
		this.texCoords = [];

		this.initBuffers();
	};

	initBuffers(){

	        var incSlices = (2 * Math.PI) / this.slices;
	    var incLoops = (2 * Math.PI) / this.loops;

	    for (var i = 0; i <= this.loops; i++) {
	        for (var j = 0; j <= this.slices; j++) {

	            this.vertices.push((this.outer + this.inner * Math.cos(incLoops * j)) * Math.cos(incSlices * i), (this.outer + this.inner * Math.cos(incLoops * j)) * Math.sin(incSlices * i), this.inner * Math.sin(incSlices * j));
	            this.normals.push((this.inner * Math.cos(incLoops * j)) * Math.cos(incSlices * i), (this.inner * Math.cos(incLoops * j)) * Math.sin(incSlices * i), this.inner * Math.sin(incSlices * j));

	                        if(i != this.loops && j != this.slices){
	                            this.indices.push(j*(this.slices + 1) + i, j*(this.slices + 1) + i + this.slices + 1, j*(this.slices + 1) + i + this.slices + 2);
	                            this.indices.push(j*(this.slices + 1) + i, j*(this.slices + 1) + i + this.slices + 2,    j*(this.slices + 1) + i + 1);
	                        }

	            this.texCoords.push(1-i*(1/this.loops), 1-j*(1/this.slices));


	        }
	    }


	        this.primitiveType=this.scene.gl.TRIANGLES;

	        this.initGLBuffers();
	    };

	updateTexCoords(s,t){

		this.texCoords = [];

		for (var i = 0; i <= this.loops; i++)
			for (var j = 0; j <= this.slices; j++)
				this.texCoords.push((1-i*(1/this.loops))*s, (1-j*(1/this.slices))*t);

		this.updateTexCoordsGLBuffers();
	};

};
