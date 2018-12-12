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

	};

	/**
	 * Displays all the individual parts of the vehicle
	 */
	display() {
    for(var i = 0; i < 2; i++){
      for (var j = 0; j < 7; j++) {
        this.scene.pushMatrix();
    			this.scene.translate(i*2,j*2,0);
    			this.pit.display();
    		this.scene.popMatrix();
      }
    }
	};

	updateTexCoords(s,t){
	};
};
