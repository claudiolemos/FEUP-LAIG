/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyUncoveredCylinder extends CGFobject
{
	constructor(scene, base, top, height, slices, stacks)
	{
		super(scene);

		this.base = base;
		this.top = top;
		this.height = height;
		this.slices = slices;
		this.stacks = stacks;
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

	initBuffers()
	{
		// Vertices definition
		var degToRad = Math.PI / 180;
		var substack = this.height/this.stacks;
		var k = 0;
		var verticesN = this.slices*2;
		var m;
		var inc = (this.top - this.base)/this.stacks;
		var mult1 = this.base;
		var mult2 = this.base + inc;
		var incS = Math.abs(this.maxS - this.minS)/(this.slices);
		var incT = Math.abs(this.maxT - this.minT)/(this.stacks);

		var z = 0;
		for (var j = 0; j < this.stacks; j++) {
			m = (this.slices * 2 + 2) * j;

			var angle = 0;
			k = m;
			for (var i = 0; i < this.slices; i++) {
				// VERTICES DEFINITION
				this.vertices.push(mult1 * Math.cos(angle * degToRad), mult1 * Math.sin(angle * degToRad), z);
				this.vertices.push(mult2 * Math.cos(angle * degToRad), mult2 * Math.sin(angle * degToRad), z+substack);

				// INDICES DEFINITION
				this.indices.push(k+2, k+1, k);
				this.indices.push(k+1, k+2, k+3);
				k += 2;

				// NORMALS DEFINITION
				this.normals.push(Math.cos(angle * degToRad), Math.sin(angle * degToRad), 0);
				this.normals.push(Math.cos(angle * degToRad), Math.sin(angle * degToRad), 0);
				angle += 360/this.slices;

				// TEXTURE COORDS
				this.texCoords.push(this.minS + i*incS, this.minT + j*incT);
				this.texCoords.push(this.minS + i*incS, this.minT + (j+1)*incT);
			}

			this.vertices.push(mult1 * Math.cos(angle * degToRad), mult1 * Math.sin(angle * degToRad), z);
			this.vertices.push(mult2 * Math.cos(angle * degToRad), mult2 * Math.sin(angle * degToRad), z+substack);
			this.normals.push(Math.cos(angle * degToRad), Math.sin(angle * degToRad), 0);
			this.normals.push(Math.cos(angle * degToRad), Math.sin(angle * degToRad), 0);
			this.texCoords.push(1,this.minT + j*incT);
			this.texCoords.push(1,this.minT + (j+1)*incT);

			mult1 = mult2;
			mult2 = (j + 2) * inc + this.base;

			z+= substack;
		}

		this.initGLBuffers();
	};

};
