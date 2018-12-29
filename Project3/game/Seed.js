class Seed extends CGFobject
{
	constructor(scene){
		super(scene);
		this.seed = new MySphere(this.scene,0.1,30,30);
		this.animated = false;
		this.animation;
	};

	display() {

		if(this.animation != null){
			this.animation.update(this.scene.delta);
			this.animation.apply(this.scene);
		}

    this.seed.display();
	};

	updateTexCoords(s,t){
	};
};
