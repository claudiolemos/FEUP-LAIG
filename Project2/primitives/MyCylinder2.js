/**
* MyPlane class, which represents a rectangle object
*/
class MyCylinder2 extends CGFobject
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
