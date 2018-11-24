/**
* MyVehicle class, which represents a vehicle object
*/
class MyVehicle extends CGFobject
{
	/**
	 * @constructor
	 * @param {XMLScene} scene represents the CGFscene
	 */
	constructor(scene)
	{
		super(scene);
		this.init();
	};

	/**
	 * Initializes the primitives and appearances needed to build the vehicle
	 */
	init()
	{
		var tankNosePoints = [[-0.36,0,0.36],[-0.65,0,0],[-0.36,0,-0.36],
													[    0,0,0.65],[    0,3,0],[    0,0,-0.65],
											    [ 0.36,0,0.36],[ 0.65,0,0],[ 0.36,0,-0.36]];

		var flap1Points = [[1,1.75,0], [1,0,0],
											 [1,1.75,0], [0,0,0]];

		var flap2Points = [[0,   0,0],[1,   0,0],
											 [1,1.75,0],[1,1.75,0]];

		this.frame = new MyCylinder2(this.scene, 0.3, 0.3, 6, 30, 1);
		this.tank = new MyCylinder2(this.scene, 0.3, 0.3, 4.5, 30, 1);
		this.adapter = new MyCylinder2(this.scene, 0.3, 0.4, 0.25, 30, 1);
		this.top = new MyCylinder2(this.scene, 0.4, 0.4, 1, 30, 1);
		this.nose = new MyCylinder2(this.scene, 0.4, 0, 0.5, 30, 1);
		this.tankNose = new MyPatch(this.scene,3,3,30,30,tankNosePoints);
		this.flap1 = new MyPatch(this.scene,2,2,1,1,flap1Points);
		this.flap2 = new MyPatch(this.scene,2,2,1,1,flap2Points);
		this.circle = new MyCircle(this.scene, 30, 0.3);

		this.portugal = new CGFappearance(this.scene);
		this.portugal.setTexture(new CGFtexture(this.scene, './scenes/images/portugal.jpg'));

		this.nasa = new CGFappearance(this.scene);
		this.nasa.setTexture(new CGFtexture(this.scene, './scenes/images/nasa.jpg'));
	};

	/**
	 * Displays all the individual parts of the vehicle
	 */
	display() {

		// main frame's bottom lid
		this.scene.pushMatrix();
			this.scene.rotate(Math.PI/2,1,0,0);
			this.circle.display();
		this.scene.popMatrix();

		// right tank
		this.scene.pushMatrix();
			this.scene.translate(0.6,0,0);
			this.scene.rotate(-Math.PI/2,1,0,0);
			this.tank.display();
		this.scene.popMatrix();

		// right tank's nose
		this.scene.pushMatrix();
			this.scene.translate(0.6,4.5,0);
			this.scene.scale(0.6,0.6,0.6);
			this.tankNose.display();
		this.scene.popMatrix();

		// right tank's bottom lid
		this.scene.pushMatrix();
			this.scene.translate(0.6,0,0);
			this.scene.rotate(Math.PI/2,1,0,0);
			this.circle.display();
		this.scene.popMatrix();

		// left tank
		this.scene.pushMatrix();
			this.scene.translate(-0.6,0,0);
			this.scene.rotate(-Math.PI/2,1,0,0);
			this.tank.display();
		this.scene.popMatrix();

		// left tank's nose
		this.scene.pushMatrix();
			this.scene.translate(-0.6,4.5,0);
			this.scene.scale(0.6,0.6,0.6);
			this.tankNose.display();
		this.scene.popMatrix();

		// left tank's bottom lid
		this.scene.pushMatrix();
			this.scene.translate(-0.6,0,0);
			this.scene.rotate(Math.PI/2,1,0,0);
			this.circle.display();
		this.scene.popMatrix();

		// adapter
		this.scene.pushMatrix();
			this.scene.translate(0,6,0);
			this.scene.rotate(-Math.PI/2,1,0,0);
			this.adapter.display();
		this.scene.popMatrix();

		// top nose
		this.scene.pushMatrix();
			this.scene.translate(0,7.25,0);
			this.scene.rotate(-Math.PI/2,1,0,0);
			this.nose.display();
		this.scene.popMatrix();

		// left flap (back facing side)
		this.scene.pushMatrix();
			this.scene.translate(-1.9,0.5,0);
			this.flap1.display();
		this.scene.popMatrix();

		// left flap (front facing side)
		this.scene.pushMatrix();
			this.scene.translate(-1.9,0.5,0);
			this.flap2.display();
		this.scene.popMatrix();

		// right flap (back facing side)
		this.scene.pushMatrix();
			this.scene.translate(1.9,0.5,0);
			this.scene.rotate(Math.PI,0,1,0);
			this.flap1.display();
		this.scene.popMatrix();

		// right flap (front facing side)
		this.scene.pushMatrix();
			this.scene.translate(1.9,0.5,0);
			this.scene.rotate(Math.PI,0,1,0);
			this.flap2.display();
		this.scene.popMatrix();

		// top
		this.scene.pushMatrix();
			this.portugal.apply();
			this.scene.translate(0,6.25,0);
			this.scene.rotate(-Math.PI/2,1,0,0);
			this.top.display();
		this.scene.popMatrix();

		// main frame
		this.scene.pushMatrix();
			this.nasa.apply();
			this.scene.rotate(-Math.PI/2,1,0,0);
			this.frame.display();
		this.scene.popMatrix();

	};

	updateTexCoords(s,t){
	};
};
