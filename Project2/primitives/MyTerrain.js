/**
* MyPlane class, which represents a rectangle object
*/
class MyTerrain extends CGFobject
{
	constructor(scene, idtexture, idheightmap, parts, heightscale)
	{
		super(scene);
		this.idtexture = idtexture;
    this.idheightmap = idheightmap;
    this.parts = parts;
    this.heightscale = heightscale;
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
