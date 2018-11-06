/**
* MyPlane class, which represents a rectangle object
*/
class MyVehicle extends CGFobject
{
	constructor(scene)
	{
		super(scene);
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
