/**
* MyUncoveredCylinder class, which represents a cylinder without covers
*/
class MyUncoveredCylinder extends CGFobject
{
	/**
	* @constructor
	* @param {XMLScene} scene	 represents the CGFscene
	* @param {number}   base   radius of cylinder's base
	* @param {number}   top    radius of cylinder's top
	* @param {number}   height cylinder's height
	* @param {number}   slices number of circle slices
	* @param {number}   stacks number of circle slices
	*/
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
		var substack = this.height/this.stacks;
		var k = 0;
		var m;
		var inc = (this.top - this.base)/this.stacks;
		var mult1 = this.base;
		var mult2 = this.base + inc;
		var incS = 1/this.slices;
		var incT = 1/this.stacks;
		var angleSlope = 90-(Math.atan((substack/this.base)))/degToRad;

		var z = 0;
		for (var j = 0; j < this.stacks; j++) {
			m = (this.slices * 2 + 2) * j;

			var angle = 0;
			k = m;
			for (var i = 0; i < this.slices; i++) {
				this.vertices.push(mult1 * Math.cos(angle * degToRad), mult1 * Math.sin(angle * degToRad), z);
				this.vertices.push(mult2 * Math.cos(angle * degToRad), mult2 * Math.sin(angle * degToRad), z+substack);

				this.indices.push(k+2, k+1, k);
				this.indices.push(k+1, k+2, k+3);
				k += 2;

				this.normals.push(Math.cos(angle * degToRad), Math.sin(angle * degToRad), Math.sin(angleSlope * degToRad));
				this.normals.push(Math.cos(angle * degToRad), Math.sin(angle * degToRad), Math.sin(angleSlope * degToRad));
				angle += 360/this.slices;

				this.texCoords.push(i*incS, j*incT);
				this.texCoords.push(i*incS, (j+1)*incT);
			}

			this.vertices.push(mult1 * Math.cos(angle * degToRad), mult1 * Math.sin(angle * degToRad), z);
			this.vertices.push(mult2 * Math.cos(angle * degToRad), mult2 * Math.sin(angle * degToRad), z+substack);

			this.normals.push(Math.cos(angle * degToRad), Math.sin(angle * degToRad), Math.sin(angleSlope * degToRad));
			this.normals.push(Math.cos(angle * degToRad), Math.sin(angle * degToRad), Math.sin(angleSlope * degToRad));

			this.texCoords.push(1,j*incT);
			this.texCoords.push(1,(j+1)*incT);

			mult1 = mult2;
			mult2 = (j + 2) * inc + this.base;

			z+= substack;
		}

		this.defaultTexCoords = this.texCoords;
		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

	/**
	* Updates the cylinder's texCoords
	* @param {number} s represents the amount of times the texture will be repeated in the s coordinate
	* @param {number} t represents the amount of times the texture will be repeated in the t coordinate
	*/
	updateTexCoords(s,t){
		this.texCoords = this.defaultTexCoords.slice();

		for(var i = 0; i < this.texCoords.length; i+=2){
			this.texCoords[i] *= s;
			this.texCoords[i+1] *= t;
		}

		this.updateTexCoordsGLBuffers();
	};

};
