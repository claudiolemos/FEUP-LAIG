/**
 * MyTorus class, which represents a torus object
 */
class MyTorus extends CGFobject {
  /**
   * @constructor
   * @param {XMLScene} scene	 represents the CGFscene
   * @param {number}   inner  inner radius
   * @param {number}   outer  outer radius
   * @param {number}   slices number of torus slices
   * @param {number}   loops  number of torus loops
   */
  constructor(scene, inner, outer, slices, loops) {
    super(scene);
    this.inner = inner;
    this.outer = outer;
    this.slices = slices;
    this.loops = loops;
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];
    this.defaultTexCoords = [];
    this.initBuffers();
  };

  /**
   * Creates vertices, indices, normals and texCoords
   */
  initBuffers() {

    var incSlices = (2 * Math.PI) / this.slices;
    var incLoops = (2 * Math.PI) / this.loops;

    for (var i = 0; i <= this.loops; i++) {
      for (var j = 0; j <= this.slices; j++) {

        this.vertices.push((this.outer + this.inner * Math.cos(incLoops * j)) * Math.cos(incSlices * i), (this.outer + this.inner * Math.cos(incLoops * j)) * Math.sin(incSlices * i), this.inner * Math.sin(incSlices * j));

        this.normals.push((this.inner * Math.cos(incLoops * j)) * Math.cos(incSlices * i), (this.inner * Math.cos(incLoops * j)) * Math.sin(incSlices * i), this.inner * Math.sin(incSlices * j));

        if (i != this.loops && j != this.slices) {
          this.indices.push(j * (this.slices + 1) + i, j * (this.slices + 1) + i + this.slices + 1, j * (this.slices + 1) + i + this.slices + 2);
          this.indices.push(j * (this.slices + 1) + i, j * (this.slices + 1) + i + this.slices + 2, j * (this.slices + 1) + i + 1);
        }

        this.texCoords.push(1 - i * (1 / this.loops), 1 - j * (1 / this.slices));
      }
    }

    this.defaultTexCoords = this.texCoords;
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  };

  /**
   * Updates the torus's texCoords
   * @param {number} s represents the amount of times the texture will be repeated in the s coordinate
   * @param {number} t represents the amount of times the texture will be repeated in the t coordinate
   */
  updateTexCoords(s, t) {
    this.texCoords = this.defaultTexCoords.slice();

    for (var i = 0; i < this.texCoords.length; i += 2) {
      this.texCoords[i] /= s;
      this.texCoords[i + 1] /= t;
    }

    this.updateTexCoordsGLBuffers();
  };

};
