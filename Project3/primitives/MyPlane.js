/**
 * MyPlane class, which represents a plane NURBS object
 */
class MyPlane extends CGFobject {
  /**
   * @constructor
   * @param {XMLScene} scene	 represents the CGFscene
   * @param {number}   npartsU number of division of the NURBS object in the u coordinate
   * @param {number}   npartsV number of division of the NURBS object in the v coordinate
   */
  constructor(scene, npartsU, npartsV) {
    super(scene);
    this.npartsU = npartsU;
    this.npartsV = npartsV;
    this.init();
  };

  /**
   * Initializes the plane's control vertexes, its NURBS surface and object
   */
  init() {
    this.controlvertexes = [
      [
        [-0.5, 0, 0.5, 1],
        [-0.5, 0, -0.5, 1]
      ],
      [
        [0.5, 0, 0.5, 1],
        [0.5, 0, -0.5, 1]
      ]
    ];
    this.surface = new CGFnurbsSurface(1, 1, this.controlvertexes);
    this.nurbsObject = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, this.surface);
  };

  /**
   * Displays the plane
   */
  display() {
    this.nurbsObject.display();
  };

  updateTexCoords(s, t) {};
};
