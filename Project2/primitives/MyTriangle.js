/**
* MyTriangle class, which represents a torus object
*/
class MyTriangle extends CGFobject
{
	/**
	* @constructor
	* @param {XMLScene} scene	represents the CGFscene
	* @param {number}   x1    bottom left x coordinate
	* @param {number}   x2    bottom right x coordinate
	* @param {number}   x3    top x coordinate
	* @param {number}   y1    bottom left y coordinate
	* @param {number}   y2    bottom right y coordinate
	* @param {number}   y3    top y coordinate
	* @param {number}   z1    bottom left z coordinate
	* @param {number}   z2    bottom right z coordinate
	* @param {number}   z3    top z coordinate
	*/
	constructor(scene, x1, x2, x3, y1, y2, y3, z1, z2, z3)
	{
		super(scene);
		this.x1 = x1;
		this.x2 = x2;
		this.x3 = x3;
		this.y1 = y1;
		this.y2 = y2;
		this.y3 = y3;
		this.z1 = z1;
		this.z2 = z2;
		this.z3 = z3;
		this.v1 = vec3.fromValues(x1, y1, z1);
		this.v2 = vec3.fromValues(x2, y2, z2);
		this.v3 = vec3.fromValues(x3, y3, z3);
		this.defaultTexCoords = [];
		this.initBuffers();
	};

	/**
	* Creates vertices, indices, normals and texCoords
	*/
	initBuffers()
	{
		this.vertices = [
			this.x1, this.y1, this.z1,
			this.x2, this.y2, this.z2,
			this.x3, this.y3, this.z3,
		];

		this.indices = [
			0, 1, 2,
		];

		var v12 = vec3.create();
		var v13 = vec3.create();
		var normal = vec3.create();
		v12 = [this.v2[0]-this.v1[0], this.v2[1]-this.v1[1], this.v2[2]-this.v1[2]];
		v13 = [this.v3[0]-this.v1[0], this.v3[1]-this.v1[1], this.v3[2]-this.v1[2]];
		vec3.cross(normal, v12, v13);
		vec3.normalize(normal, normal);

		this.normals = [
			normal[0], normal[1], normal[2],
			normal[0], normal[1], normal[2],
			normal[0], normal[1], normal[2],
		];


		var v23 = Math.sqrt(Math.pow(this.v2[0] - this.v3[0], 2) + Math.pow(this.v2[1] - this.v3[1], 2) + Math.pow(this.v2[2] - this.v3[2], 2));
		var v13 = Math.sqrt(Math.pow(this.v1[0] - this.v3[0], 2) + Math.pow(this.v1[1] - this.v3[1], 2) + Math.pow(this.v1[2] - this.v3[2], 2));
		var v12 = Math.sqrt(Math.pow(this.v2[0] - this.v1[0], 2) + Math.pow(this.v2[1] - this.v1[1], 2) + Math.pow(this.v2[2] - this.v1[2], 2));
		vec3.normalize(v23, v23);
		vec3.normalize(v13, v13);
		vec3.normalize(v12, v12);
		var angle = Math.acos((Math.pow(v23, 2) - Math.pow(v13, 2) + Math.pow(v12, 2)) / (2 * v23 * v12));
		var d = v23 * Math.sin(angle);

		this.texCoords = [
				0, d,
				v12, d,
				(v12-v23*Math.cos(angle)),(d-v23*Math.sin(angle))
		];

		this.defaultTexCoords = this.texCoords;
		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

	/**
	* Updates the triangle's texCoords
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
