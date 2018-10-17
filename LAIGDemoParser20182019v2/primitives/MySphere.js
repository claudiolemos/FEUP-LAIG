/**
 * MySphere
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MySphere extends CGFobject
{
	constructor(scene, radius, slices, stacks)
	{
		super(scene);

		this.radius = radius;
		this.slices = slices;
		this.stacks = stacks;
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];
		this.defaultTexCoords = [];

		this.initBuffers();
	};

	initBuffers()
	{
		// VERTICES DEFINITION
		var degToRad = Math.PI / 180;
		var k = 0;
		var m;
		var angleFiInc = 180/this.stacks;

		var angleFi = 0;
		for (var j = 0; j < this.stacks; j++) {
			m = (this.slices * 2 + 2) * j;

			var angleTeta = 0;
			k = m;
			for (var i = 0; i < this.slices; i++) {
				// VERTICES DEFINITION
				this.vertices.push(this.radius*Math.sin(angleFi * degToRad) * Math.cos(angleTeta * degToRad), this.radius*Math.sin(angleFi * degToRad) * Math.sin(angleTeta * degToRad), this.radius*Math.cos(angleFi * degToRad));
				this.vertices.push(this.radius*Math.sin((angleFi+angleFiInc) * degToRad) * Math.cos(angleTeta * degToRad), this.radius*Math.sin((angleFi+angleFiInc) * degToRad) * Math.sin(angleTeta * degToRad), this.radius*Math.cos((angleFi+angleFiInc) * degToRad));

				// INDICES DEFINITION
				this.indices.push(k, k+1, k+2);
				this.indices.push(k+3, k+2, k+1);
				k += 2;

				// NORMALS DEFINITION
				this.normals.push(Math.sin(angleFi * degToRad) * Math.cos(angleTeta * degToRad), Math.sin(angleFi * degToRad) * Math.sin(angleTeta * degToRad), Math.cos(angleFi * degToRad));
				this.normals.push(Math.sin((angleFi+angleFiInc) * degToRad) * Math.cos(angleTeta * degToRad), Math.sin((angleFi+angleFiInc) * degToRad) * Math.sin(angleTeta * degToRad), Math.cos((angleFi+angleFiInc) * degToRad));

				// TEXTURE COORDS
				this.texCoords.push(0.5+(Math.sin(angleFi * degToRad) * Math.cos(angleTeta * degToRad))/2, 0.5-(Math.sin(angleFi * degToRad) * Math.sin(angleTeta * degToRad))/2);
				this.texCoords.push(0.5+(Math.sin((angleFi+angleFiInc) * degToRad) * Math.cos(angleTeta * degToRad))/2, 0.5-(Math.sin((angleFi+angleFiInc) * degToRad) * Math.sin(angleTeta * degToRad))/2);

				angleTeta += 360/this.slices;
			}
			this.vertices.push(this.radius*Math.sin(angleFi * degToRad) * Math.cos(angleTeta * degToRad), this.radius*Math.sin(angleFi * degToRad) * Math.sin(angleTeta * degToRad), this.radius*Math.cos(angleFi * degToRad));
			this.vertices.push(this.radius*Math.sin((angleFi+angleFiInc) * degToRad) * Math.cos(angleTeta * degToRad), this.radius*Math.sin((angleFi+angleFiInc) * degToRad) * Math.sin(angleTeta * degToRad), this.radius*Math.cos((angleFi+angleFiInc) * degToRad));
			this.normals.push(Math.sin(angleFi * degToRad) * Math.cos(angleTeta * degToRad), Math.sin(angleFi * degToRad) * Math.sin(angleTeta * degToRad), Math.cos(angleFi * degToRad));
			this.normals.push(Math.sin((angleFi+angleFiInc) * degToRad) * Math.cos(angleTeta * degToRad), Math.sin((angleFi+angleFiInc) * degToRad) * Math.sin(angleTeta * degToRad), Math.cos((angleFi+angleFiInc) * degToRad));
			this.texCoords.push(0.5+(Math.sin(angleFi * degToRad) * Math.cos(angleTeta * degToRad))/2, 0.5-(Math.sin(angleFi * degToRad) * Math.sin(angleTeta * degToRad))/2);
			this.texCoords.push(0.5+(Math.sin((angleFi+angleFiInc) * degToRad) * Math.cos(angleTeta * degToRad))/2, 0.5-(Math.sin((angleFi+angleFiInc) * degToRad) * Math.sin(angleTeta * degToRad))/2);

			angleFi += angleFiInc;
		}
		this.texCoords.push(0.5, 0.5);
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
