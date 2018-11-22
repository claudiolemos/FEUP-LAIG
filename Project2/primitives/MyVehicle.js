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
		var tankNosePoints = [[-0.36,0, 0.36], [-0.65,0,    0], [-0.36,0,-0.36],
											[    0,0, 0.65], [    0,3,    0], [    0,0,-0.65],
											[ 0.36,0, 0.36], [ 0.65,0,    0], [ 0.36,0,-0.36]];

		var flap2Points = [[0,0,0], [1,0,0],
											 [1,1.75,0], [1,1.75,0]];

		var flap1Points = [[1,1.75,0], [1,0,0],
											 [1,1.75,0], [0,0,0]];

		this.frame = new MyCylinder2(this.scene, 0.3, 0.3, 6, 30, 30);
		this.tank = new MyCylinder2(this.scene, 0.3, 0.3, 4.5, 30, 30);
		this.adapter = new MyCylinder2(this.scene, 0.3, 0.4, 0.25, 30, 30);
		this.top = new MyCylinder2(this.scene, 0.4, 0.4, 1, 30, 30);
		this.tankNose = new MyPatch(this.scene,3,3,30,30,tankNosePoints);
		this.nose = new MyCylinder2(this.scene, 0.4, 0, 0.5, 30, 30);
		this.flap1 = new MyPatch(this.scene,2,2,30,30,flap1Points);
		this.flap2 = new MyPatch(this.scene,2,2,30,30,flap2Points);
	};

	display() {

		// frame
		this.scene.pushMatrix();
			this.scene.rotate(-Math.PI/2,1,0,0);
			this.frame.display();
		this.scene.popMatrix();

		// right tank + nose
		this.scene.pushMatrix();
			this.scene.translate(0.6,0,0);
			this.scene.rotate(-Math.PI/2,1,0,0);
			this.tank.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
			this.scene.translate(-0.6,4.5,0);
			this.scene.scale(0.6,0.6,0.6);
			this.tankNose.display();
		this.scene.popMatrix();

		// left tank + nose
		this.scene.pushMatrix();
			this.scene.translate(-0.6,0,0);
			this.scene.rotate(-Math.PI/2,1,0,0);
			this.tank.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
			this.scene.translate(0.6,4.5,0);
			this.scene.scale(0.6,0.6,0.6);
			this.tankNose.display();
		this.scene.popMatrix();

		// adapter
		this.scene.pushMatrix();
			this.scene.translate(0,6,0);
			this.scene.rotate(-Math.PI/2,1,0,0);
			this.adapter.display();
		this.scene.popMatrix();

		// top + nose
		this.scene.pushMatrix();
			this.scene.translate(0,6.25,0);
			this.scene.rotate(-Math.PI/2,1,0,0);
			this.top.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
			this.scene.translate(0,7.25,0);
			this.scene.rotate(-Math.PI/2,1,0,0);
			this.nose.display();
		this.scene.popMatrix();

		// left flap
		this.scene.pushMatrix();
			this.scene.translate(-1.9,0.5,0);
			this.flap1.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
			this.scene.translate(-1.9,0.5,0);
			this.flap2.display();
		this.scene.popMatrix();

		// right flap
		this.scene.pushMatrix();
			this.scene.translate(1.9,0.5,0);
			this.scene.rotate(Math.PI,0,1,0);
			this.flap1.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
			this.scene.translate(1.9,0.5,0);
			this.scene.rotate(Math.PI,0,1,0);
			this.flap2.display();
		this.scene.popMatrix();

	};

	updateTexCoords(s,t){
	};
};
