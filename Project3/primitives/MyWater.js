/**
* MyWater class, which represents a water object
*/
class MyWater extends MyPlane
{
	/**
	 * @constructor
	 * @param {XMLScene} scene	     represents the CGFscene
	 * @param {string}   idtexture   id of the water's texture
	 * @param {string}   idwavemap   id of the water's height map
	 * @param {number}   parts       number of division of the NURBS object in the u and v coordinates
	 * @param {number}   heightscale factor scale for the height map
	 * @param {number}   texscale    number of times the water texture will be repeated
	 */
	constructor(scene, idtexture, idwavemap, parts, heightscale, texscale)
	{
		super(scene,parts,parts);
		this.texture = scene.graph.textures[idtexture];
    this.wavemap = scene.graph.textures[idwavemap];
    this.heightscale = heightscale;
    this.texscale = texscale;
		this.delta = 0;
		this.setShader();
	};

	/**
	 * Initializes the water's shader, setting its uniform
	 * values (texture scale, height map, and height scale)
	 * and creates the water's appearance
	 */
	setShader() {
		this.shader = new CGFshader(this.scene.gl, "./shaders/water.vert", "./shaders/water.frag");
		this.shader.setUniformsValues({uSampler2: 1, heightScale: this.heightscale, texScale: this.texscale});

		this.appearance = new CGFappearance(this.scene);
		this.appearance.setTexture(this.texture);
	};

	/**
	 * Displays the water.
	 * Before doing that, calculates the delta for the water movement, sets the water's
	 * shader as active and binds the water's texture and waves map.
	 * After displaying the water, it sets back the scene's default shader
	 */
	display() {
		this.delta = (this.delta + 0.0005) % 1;
		this.shader.setUniformsValues({delta: this.delta});
		this.scene.setActiveShader(this.shader);
		this.appearance.apply();
		this.wavemap.bind(1);
		this.nurbsObject.display();
		this.scene.setActiveShader(this.scene.defaultShader);
	};

	updateTexCoords(s,t){
	};
};
