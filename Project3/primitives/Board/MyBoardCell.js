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
		this.pit = new CGFOBJModel(this.scene, 'models/pit.obj');
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
