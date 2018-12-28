/**
* MyVehicle class, which represents a vehicle object
*/
class MyBoard extends CGFobject
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
		this.pit = new MyBoardCell(this.scene);
		this.rock = new MyRock(this.scene);
		this.division = new MyRectangle(this.scene, 0, 1, 0, 1);
	};

	/**
	 * Displays all the individual parts of the vehicle
	 */
	display() {
		this.logPicking();
		this.scene.clearPickRegistration();
    for(var i = 0; i < 5; i++){
      for (var j = 0; j < 7; j++) {
				if(i == 2){
					this.scene.pushMatrix();
						this.scene.scale(4,4,4);
	    			this.scene.translate(0,0.5,0);
	    			this.scene.translate(i*1.25,j,-0.44);
						this.scene.rotate(-Math.PI/2,1,0,0);
						this.scene.rotate(Math.PI/2,0,1,0);
						this.scene.rotate(-Math.PI/2,1,0,0);
						this.division.display();
					this.scene.popMatrix();
				}
				else if(i < 2) {
					this.scene.pushMatrix();
						this.scene.scale(2,2,6);
	    			this.scene.translate(i*2,j*2,0);
						this.scene.rotate(-Math.PI/2,1,0,0);
						this.scene.registerForPick((i*7)+j+1, this.pit);
	    			this.pit.display();
	    		this.scene.popMatrix();

					this.scene.pushMatrix();
						this.scene.scale(2,2,2);
	    			this.scene.translate(i*2,j*2,0);
	    			this.rock.display();
	    		this.scene.popMatrix();

				}

				else if(i > 2) {
					this.scene.pushMatrix();
						this.scene.scale(2,2,6);
	    			this.scene.translate(i*2,j*2,0);
						this.scene.rotate(-Math.PI/2,1,0,0);
						this.scene.registerForPick((i*7)+j+1-7, this.pit);
	    			this.pit.display();
	    		this.scene.popMatrix();

					this.scene.pushMatrix();
						this.scene.scale(2,2,2);
	    			this.scene.translate(i*2,j*2,0);
	    			this.rock.display();
	    		this.scene.popMatrix();
				}
      }
			this.scene.clearPickRegistration();
    }
	};

	logPicking() {
		if (this.scene.pickMode == false) {
			if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
				for (var i=0; i< this.scene.pickResults.length; i++) {
					var obj = this.pit;
					if (obj)
					{
						var customId = this.scene.pickResults[i][1];
						console.log("Picked object: " + obj + ", with pick id " + customId);
						if(customId == 2){
						this.scene.pushMatrix();
							this.scene.scale(5,5,5);
							this.pit.display();
						this.scene.popMatrix();
					}
				}
			}
			this.scene.pickResults.splice(0,this.scene.pickResults.length);
		}
	}
};

	updateTexCoords(s,t){
	};
};
