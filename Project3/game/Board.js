class Board extends CGFobject
{
	constructor(scene)
	{
		super(scene);
		this.pit = new Pit(this.scene);
	};

	display() {
		this.logPicking();

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
	};

	logPicking() {
		if (this.scene.pickMode == false) {
			if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
				for (var i=0; i< this.scene.pickResults.length; i++) {
					var obj = this.scene.pickResults[i][0];
					if (obj)
					{
						var cellID = this.scene.pickResults[i][1];
						console.log("Cell: " + cellID);
					}
				}
				this.scene.pickResults.splice(0,this.scene.pickResults.length);
			}
		}
	};

	updateTexCoords(s,t){
	};
};
