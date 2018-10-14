/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
  */


class MyTriangle extends CGFobject
{
	constructor(scene, x1, x2, x3, y1, y2, y3, z1, z2, z3)
	{
		super(scene);

		// Position coordinates
		this.x1 = x1;
		this.x2 = x2;
		this.x3 = x3;
		this.y1 = y1;
		this.y2 = y2;
		this.y3 = y3;
		this.z1 = z1;
		this.z2 = z2;
		this.z3 = z3;

		// Texture coordinates
		this.minS = 0.0;
		this.maxS = 1.0;
		this.minT = 0.0;
		this.maxT = 1.0;

		this.initBuffers();
	};

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

		this.primitiveType=this.scene.gl.TRIANGLES;

		// Calculate normal vector depending on triangle coordinates
		var v1 = vec3.fromValues(this.x1, this.y1, this.z1);
		var v2 = vec3.fromValues(this.x2, this.y2, this.z2);
		var v3 = vec3.fromValues(this.x3, this.y3, this.z3);

		var v12 = vec3.create();
		var v13 = vec3.create();
		var normal = vec3.create();

		v12 = [v2[0]-v1[0], v2[1]-v1[1], v2[2]-v1[2]];
		v13 = [v3[0]-v1[0], v3[1]-v1[1], v3[2]-v1[2]];
		vec3.cross(normal, v12, v13);
		vec3.normalize(normal, normal);

		this.normals = [
			normal[0], normal[1], normal[2],
			normal[0], normal[1], normal[2],
			normal[0], normal[1], normal[2],
		];

		this.texCoords = [
			this.maxS, this.minT,
			this.minS, this.minT,
			this.minS, this.maxT,
			this.maxS, this.maxT,
		];

		this.initGLBuffers();
	};

	updateTexCoords(s,t){

     var v1 = vec3.fromValues(this.x1, this.y1, this.z1);
     var v2 = vec3.fromValues(this.x2, this.y2, this.z2);
     var v3 = vec3.fromValues(this.x3, this.y3, this.z3);

     var v23 = Math.sqrt(Math.pow(v2[0] - v3[0], 2) + Math.pow(v2[1] - v3[1], 2) + Math.pow(v2[2] - v3[2], 2));
     var v13 = Math.sqrt(Math.pow(v1[0] - v3[0], 2) + Math.pow(v1[1] - v3[1], 2) + Math.pow(v1[2] - v3[2], 2));
     var v12 = Math.sqrt(Math.pow(v2[0] - v1[0], 2) + Math.pow(v2[1] - v1[1], 2) + Math.pow(v2[2] - v1[2], 2));

     var angle = Math.acos((Math.pow(v23, 2) - Math.pow(v13, 2) + Math.pow(v12, 2)) / (2 * v23 * v12));

     var d = v23 * Math.sin(angle);

     this.texCoords = [
         0, d*t,
         v12*s, d*t,
         (v12-v23*Math.cos(angle))*s,(d-v23*Math.sin(angle))*t
     ];

     this.updateTexCoordsGLBuffers();
    };
};
