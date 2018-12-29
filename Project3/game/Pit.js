class Pit extends CGFobject
{
	constructor(scene)
	{
		super(scene);
		this.pit = new OBJ(this.scene, './models/pit.obj');
	};

	display() {
		this.scene.pushMatrix();
			this.scene.translate(0.5,0,0.5);
	    this.pit.display();
		this.scene.popMatrix();

	};

	updateTexCoords(s,t){
	};
};
