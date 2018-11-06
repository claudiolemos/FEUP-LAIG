/**
* MyPlane class, which represents a rectangle object
*/
class MyWater extends CGFobject
{
	constructor(scene, idtexture, idwavemap, parts, heightscale, texscale)
	{
		super(scene);
		this.idtexture = idtexture;
    this.idwavemap = idwavemap;
    this.parts = parts;
    this.heightscale = heightscale;
    this.texscale = texscale;
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];
		this.defaultTexCoords = [];
		this.initBuffers();
	};


	initBuffers()
	{
    this.primitiveType=this.scene.gl.TRIANGLES;
		this.defaultTexCoords = this.texCoords;
		this.initGLBuffers();
	};

	updateTexCoords(s,t){
	};
};
