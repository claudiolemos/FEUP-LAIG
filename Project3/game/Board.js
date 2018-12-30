class Board extends CGFobject
{
	constructor(scene)
	{
		super(scene);
		this.pit = new Pit(this.scene);
		this.score = new OBJ(this.scene, './models/score.obj');

	};

	display() {
		for(var i = 0; i < 7; i++){
			for (var j = 0; j < 4; j++) {
				var offset = (j == 0 || j == 1)? 0 : 1;

				this.scene.pushMatrix();
					this.scene.translate(i,0,j+offset);
					this.scene.registerForPick(7*j+i+1, this.pit);
					this.pit.display();
					this.scene.clearPickRegistration();
				this.scene.popMatrix();
			}
		}

		this.scene.pushMatrix();
			this.scene.translate(0,0,2.5);
			this.scene.rotate(-Math.PI/2,0,1,0);
			this.score.display();
		this.scene.popMatrix();

	};

	updateTexCoords(s,t){
	};
};
