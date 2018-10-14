/**
 * MyObject
 * @constructor
 */

class MyCylinder
{
	constructor(scene, base, top, height, slices, stacks)
	{
		this.scene = scene;
		this.base = base;
		this.top = top;
		this.height = height;
		this.slices = slices;
		this.stacks = stacks;

		this.cylinder = new MyUncoveredCylinder(scene, base, top, height, slices, stacks);
		this.circle1 = new MyCircle(scene, slices);
		this.circle2 = new MyCircle(scene, slices);
	};

	display()
	{
		this.cylinder.display();

		this.scene.pushMatrix();
			this.scene.rotate(Math.PI,1,0,0);
				this.scene.scale(this.base,this.base,this.base);
			this.circle1.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
			this.scene.translate(0,0,this.height);
				this.scene.scale(this.top,this.top,this.top);
			this.circle2.display();
		this.scene.popMatrix();
	}

	updateTexCoords(s,t){
		this.cylinder.updateTexCoords(s,t);
		this.circle1.updateTexCoords(s,t);
		this.circle2.updateTexCoords(s,t);
	};


};
