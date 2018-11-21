/**
* MyPlane class, which represents a rectangle object
*/
class MyPatch extends CGFobject
{
	constructor(scene, npointsU, npointsV, npartsU, npartsV, controlpoints) {
		super(scene);
		this.npointsU = npointsU;
    this.npointsV = npointsV;
		this.npartsU = npartsU;
    this.npartsV = npartsV;
    this.controlpoints = controlpoints;
		this.controlvertexes = Array(npointsU).fill(null).map(()=>Array(npointsV).fill(null));
		this.init();
	};

	init() {

		for(var u = 0; u < this.npointsU; u++)
			for(var v = 0; v < this.npointsV; v++)
				this.controlvertexes[u][v] = [this.controlpoints[this.npointsU*u+v][0], this.controlpoints[this.npointsU*u+v][1], this.controlpoints[this.npointsU*u+v][2], 1];

		console.log(this.controlvertexes);
		// this.controlvertexes = [[[-0.5, 0, 0.5, 1], [-0.5, 0, -0.5, 1]], [[0.5, 0, 0.5, 1], [0.5, 0, -0.5, 1]]];

		this.surface = new CGFnurbsSurface(this.npointsU-1, this.npointsV-1, this.controlvertexes);
		this.nurbsObject = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, this.surface);
	};

	display() {
		this.nurbsObject.display();
	};

	updateTexCoords(s,t){
	};
};
