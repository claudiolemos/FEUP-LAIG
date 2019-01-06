/**
 * Represents a unique pit object, where player's seeds are stored
 */
class Pit extends CGFobject {
  /**
   * @constructor
   * @param {XMLScene} scene represents the CGFscene
   */
  constructor(scene) {
    super(scene);
    this.pit = new OBJ(this.scene, './models/pit.obj');
  };

  /**
   * displays the pit
   */
  display() {
    this.scene.pushMatrix();
    this.scene.translate(0.5, 0, 0.5);
    this.pit.display();
    this.scene.popMatrix();

  };

  updateTexCoords(s, t) {};
};
