/**
* MyCylinder class, which represents a cylinder object
*/
class MyCylinder
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
		this.scene = scene;
		this.base = base;
		this.top = top;
		this.height = height;
		this.slices = slices;
		this.stacks = stacks;
		this.cylinder = new MyUncoveredCylinder(scene, base, top, height, slices, stacks);
		this.circle1 = new MyCircle(scene, slices, base);
		this.circle2 = new MyCircle(scene, slices, top);
	};

	/**
	* Display's the cylinder object
	*/
	display()
	{
		this.cylinder.display();

		this.scene.pushMatrix();
			this.scene.rotate(Math.PI,1,0,0);
			this.circle1.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
			this.scene.translate(0,0,this.height);
			this.circle2.display();
		this.scene.popMatrix();
	}

	/**
	* Updates the cylinder's texCoords
	* @param {number} s represents the amount of times the texture will be repeated in the s coordinate
	* @param {number} t represents the amount of times the texture will be repeated in the t coordinate
	*/
	updateTexCoords(s,t){
		this.cylinder.updateTexCoords(s,t);
		this.circle1.updateTexCoords(s,t);
		this.circle2.updateTexCoords(s,t);
	};


};
