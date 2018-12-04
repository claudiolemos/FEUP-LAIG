/**
* MyTerrain class, which represents a terrain object
*/
class MyTerrain extends MyPlane
{
	/**
	 * @constructor
	 * @param {XMLScene} scene	     represents the CGFscene
	 * @param {string}   idtexture   id of the terrain's texture
	 * @param {string}   idheightmap id of the terrain's height map
	 * @param {number}   parts       number of division of the NURBS object in the u and v coordinates
	 * @param {number}   heightscale factor scale for the height map
	 */
	constructor(scene, idtexture, idheightmap, parts, heightscale)
	{
		super(scene,parts,parts);
		this.texture = scene.graph.textures[idtexture];
    this.heightmap = scene.graph.textures[idheightmap];
    this.heightscale = heightscale;
		this.setShader();
	};

	/**
	 * Initializes the terrain's shader, setting its uniform
	 * values (height map texture and height scale)
	 */
	setShader() {
		this.shader = new CGFshader(this.scene.gl, "./shaders/terrain.vert", "./shaders/terrain.frag");
		this.shader.setUniformsValues({uSampler2: 1, heightScale: this.heightscale});
	};

	/**
	 * Displays the terrain.
	 * Before doing that, sets the terrain's shader as active and
	 * binds the terrain's texture and height map.
	 * After displaying the terrain, it sets back to the scene's default shader
	 */
	display() {
		this.scene.setActiveShader(this.shader);
		this.texture.bind();
		this.heightmap.bind(1);
		this.nurbsObject.display();
		this.scene.setActiveShader(this.scene.defaultShader);
	};

	updateTexCoords(s,t){
	};
};
