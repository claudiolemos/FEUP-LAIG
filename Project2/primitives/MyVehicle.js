/**
* MyPlane class, which represents a rectangle object
*/
class MyVehicle extends CGFobject
{
	constructor(scene)
	{
		super(scene);
		this.nurbs = [];
		this.init();
	};

	init()
	{
		this.frame = new MyCylinder2(this.scene, 0.5, 0.5, 6, 30, 30);
		this.tank = new MyCylinder2(this.scene, 0.5, 0.5, 3, 30, 30);
	};

	display() {
		this.scene.pushMatrix();
			// this.scene.rotate(-Math.PI/2,1,0,0);
			this.frame.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
			this.scene.translate(1,0,0);
			// this.scene.rotate(-Math.PI/2,1,0,0);
			this.tank.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
			this.scene.translate(-1,0,0);
			// this.scene.rotate(-Math.PI/2,1,0,0);
			this.tank.display();
		this.scene.popMatrix();


	};

	updateTexCoords(s,t){
	};
};
