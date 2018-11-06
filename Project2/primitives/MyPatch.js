/**
* MyPlane class, which represents a rectangle object
*/
class MyPatch extends CGFobject
{
	constructor(scene, npointsU, npointsV, npartsU, npartsV, controlpoints)
	{
		super(scene);
		this.npointsU = npointsU;
    this.npointsV = npointsV;
		this.npartsU = npartsU;
    this.npartsV = npartsV;
    this.controlpoints = controlpoints;
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
