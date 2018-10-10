/**
 * MySphere
 * @constructor
 */

class MySphere
{
	constructor(scene, radius, slices, stacks)
	{
		this.scene = scene;
		this.radius = radius;
		this.slices = slices;
		this.stacks = stacks;
		this.hemisphere1 = new MyHemisphere(scene, slices, stacks)
		this.hemisphere2 = new MyHemisphere(scene, slices, stacks)
	};

	display()
	{
		this.scene.pushMatrix();
			this.scene.scale(this.radius, this.radius, this.radius);
			this.hemisphere1.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
			this.scene.scale(this.radius, this.radius, this.radius);
			this.scene.rotate(Math.PI, 1, 0, 0);
			this.hemisphere2.display();
		this.scene.popMatrix();
	};

};
