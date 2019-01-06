/**
 * Represents a unique seed
 */
class Seed extends CGFobject {
  /**
   * @constructor
   * @param {XMLScene} scene represents the CGFscene
   * @param {array}    coord initial coordinate of the seed
   */
  constructor(scene, coord) {
    super(scene);
    this.seed = new MySphere(this.scene, 0.1, 30, 30);
    this.coord = coord;
  };

  /**
   * displays the seed
   */
  display() {
    this.scene.pushMatrix();
    this.scene.translate(this.coord[0], this.coord[1], this.coord[2]);
    this.seed.display();
    this.scene.popMatrix();
  };

  updateTexCoords(s, t) {};
};
