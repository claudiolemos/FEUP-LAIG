/**
* MyVehicle class, which represents a vehicle object
*/
class MyRock extends CGFobject
{
	/**
	 * @constructor
	 * @param {XMLScene} scene represents the CGFscene
	 */
	constructor(scene){
		super(scene);
		this.init();
	};

	/**
	 * Initializes the primitives and appearances needed to build the vehicle
	 */
	init(){
    this.rock = new MySphere(this.scene,0.25,30,30);
	};

	/**
	 * Displays all the individual parts of the vehicle
	 */
	display() {
    this.rock.display();
	};



	updateTexCoords(s,t){
	};
};
