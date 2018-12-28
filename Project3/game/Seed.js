class Seed extends CGFobject
{
	constructor(scene){
		super(scene);
		this.seed = new MySphere(this.scene,0.1,30,30);
		this.animated = false;
	};

	display() {
    this.seed.display();
	};

	updateTexCoords(s,t){
	};
};
