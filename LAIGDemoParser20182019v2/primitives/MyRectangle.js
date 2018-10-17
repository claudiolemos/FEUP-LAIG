/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyRectangle extends CGFobject
{
	constructor(scene, x1, x2, y1, y2)
	{
		super(scene);

		// Position coordinates
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;

		this.defaultTexCoords = [];

		this.initBuffers();
	};

	initBuffers()
	{
		this.vertices = [
			this.x2, this.y2, 0,
			this.x1, this.y2, 0,
			this.x1, this.y1, 0,
			this.x2, this.y1, 0
		];

		this.indices = [
			3, 0, 1,
			1, 2, 3
		];

		this.primitiveType=this.scene.gl.TRIANGLES;

		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		];

		this.texCoords = [
			1, 0,
			0, 0,
			0, 1,
			1, 1
		];

		this.defaultTexCoords = this.texCoords;

		this.initGLBuffers();
	};

	updateTexCoords(s,t){
		this.texCoords = this.defaultTexCoords.slice();

		for(var i = 0; i < this.texCoords.length; i+=2){
			this.texCoords[i] *= s;
			this.texCoords[i+1] *= t;
		}

		this.updateTexCoordsGLBuffers();
	};
};
