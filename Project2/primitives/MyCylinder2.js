/**
* MyCylinder2 class, which represents a cylinder NURBS object
*/
class MyCylinder2 extends CGFobject
{
	/**
	* @constructor
	* @param {XMLScene} scene	 represents the CGFscene
	* @param {number}   base   radius of cylinder's base
	* @param {number}   top    radius of cylinder's top
	* @param {number}   height cylinder's height
	* @param {number}   slices number of cylinder slices
	* @param {number}   stacks number of cylinder stacks
	*/
	constructor(scene, base, top, height, slices, stacks)
	{
		super(scene);
		this.base = base;
		this.top = top;
		this.height = height;
		this.slices = slices;
		this.stacks = stacks;
		this.init();
	};

	/**
	 * Initializes a quarter of the cylinder's control vertexes, its NURBS surface and object
	 */
	init() {
		var w = Math.pow(2, 0.5)/2;
		this.controlvertexes = [
			[[        0,-this.top,this.height,1],[         0,-this.base,0,1]],
			[[-this.top,-this.top,this.height,w],[-this.base,-this.base,0,w]],
			[[-this.top,        0,this.height,1],[-this.base,         0,0,1]]
		];

		this.surface = new CGFnurbsSurface(2, 1, this.controlvertexes);
		this.nurbsObject = new CGFnurbsObject(this.scene, this.slices, this.stacks, this.surface);
	};

	/**
	 * Displays the first quarter of the cylinder, and rotates
	 * it 3 times in order to make the complete cylinder
	 */
	display() {
		this.nurbsObject.display();

		this.scene.pushMatrix();
			this.scene.rotate(Math.PI/2,0,0,1);
			this.nurbsObject.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
			this.scene.rotate(Math.PI,0,0,1);
			this.nurbsObject.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
			this.scene.rotate(-Math.PI/2,0,0,1);
			this.nurbsObject.display();
		this.scene.popMatrix();
	};

	updateTexCoords(s,t){
	};
};
