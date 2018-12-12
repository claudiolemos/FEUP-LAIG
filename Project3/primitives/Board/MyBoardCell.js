/**
* MyVehicle class, which represents a vehicle object
*/
class MyBoardCell extends CGFobject
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
		var pit = [
      [-1,-3,0],[-1,-2.5,0],[-1,-2,0],[-1,-1.5,0],[-1,-1,0],
      [-1.5,-3,0],[-1.5,-2.5,1],[-1.5,-2,1.5],[-1.5,-1.5,1],[-1.5,-1,0],
      [-2,-3,0],[-2,-2.5,1.5],[-2,-2,1.5],[-2,-1.5,1.5],[-2,-1,0],
      [-2.5,-3,0],[-2.5,-2.5,1],[-2.5,-2,1.5],[-2.5,-1.5,1],[-2.5,-1,0],
      [-3,-3,0],[-3,-2.5,0],[-3,-2,0],[-3,-1.5,0],[-3,-1,0]
    ];

		this.pit = new MyPatch(this.scene,5,5,30,30,pit);

	};

	/**
	 * Displays all the individual parts of the vehicle
	 */
	display() {
    this.pit.display();
	};

	updateTexCoords(s,t){
	};
};
