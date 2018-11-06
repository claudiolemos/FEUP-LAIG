/**
* MyCircle class, which represents a circle object
*/
class MyCircle extends CGFobject{
	/**
  * @constructor
  * @param {XMLScene} scene	 represents the CGFscene
  * @param {number}   slices number of circle slices
  * @param {number}   radius number of circle slices
  */
	constructor(scene, slices, radius)
	{
     super(scene);
     this.slices = slices;
     this.radius = radius;
     this.vertices = [];
     this.indices = [];
     this.normals = [];
     this.texCoords = [];
		 this.defaultTexCoords = [];
     this.initBuffers();
  };

	/**
	* Creates vertices, indices, normals and texCoords
	*/
	initBuffers()
	{
		var degToRad = Math.PI / 180;

		var angle = 0;
		for (var i = 0; i < this.slices; i++) {
			this.vertices.push(this.radius*(Math.cos(angle * degToRad)), this.radius*(Math.sin(angle * degToRad)), 0);
			angle += 360/this.slices;
		}
		this.vertices.push(0,0,0);

		for (var i = 0; i < this.slices; i++)
			this.indices.push(this.vertices.length/3-1,i,(i+1)%this.slices);

		angle = 0;
		for (var i = 0; i < this.vertices.length/3; i++)
			this.normals.push(0, 0, 1);

		var angle = 0;
		for (var i = 0; i < this.slices; i++) {
			this.texCoords.push((0.5+Math.cos(angle*degToRad)/2), (0.5-Math.sin(angle*degToRad)/2));
			angle += 360/this.slices;
		}
		this.texCoords.push(0.5, 0.5);

		this.defaultTexCoords = this.texCoords;
		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

	/**
	* Updates the circle's texCoords
	* @param {number} s represents the amount of times the texture will be repeated in the s coordinate
	* @param {number} t represents the amount of times the texture will be repeated in the t coordinate
	*/
	updateTexCoords(s,t){
		this.texCoords = this.defaultTexCoords.slice();

		for(var i = 0; i < this.texCoords.length; i+=2){
			this.texCoords[i] /= s;
			this.texCoords[i+1] /= t;
		}

		this.updateTexCoordsGLBuffers();
	};

};
