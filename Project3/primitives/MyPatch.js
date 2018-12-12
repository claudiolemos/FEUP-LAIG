/**
* MyPatch class, which represents a patch NURBS object
*/
class MyPatch extends CGFobject
{
	/**
	 * @constructor
	 * @param {XMLScene} scene	       represents the CGFscene
	 * @param {number}   npointsU      number of control points of the NURBS surface in the u coordinate
	 * @param {number}   npointsV      number of control points of the NURBS surface in the v coordinate
	 * @param {number}   npartsU       number of division of the NURBS object in the u coordinate
	 * @param {number}   npartsV       number of division of the NURBS object in the v coordinate
	 * @param {array}    controlpoints npointsUxnpointsV array that represents the NURBS surface control points
	 */
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

	/**
	 * Initializes the patch's control vertexes, its NURBS surface and object
	 */
	init() {
		for(var u = 0; u < this.npointsU; u++)
			for(var v = 0; v < this.npointsV; v++)
				this.controlvertexes[u][v] = [this.controlpoints[this.npointsV*u+v][0], this.controlpoints[this.npointsV*u+v][1], this.controlpoints[this.npointsV*u+v][2], 1];

		this.surface = new CGFnurbsSurface(this.npointsU-1, this.npointsV-1, this.controlvertexes);
		this.nurbsObject = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, this.surface);
	};

	/**
	 * Displays the patch
	 */
	display() {
		this.nurbsObject.display();
	};

	updateTexCoords(s,t){
	};
};
