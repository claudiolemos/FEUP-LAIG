/**
* MyPlane class, which represents a rectangle object
*/
class MyTerrain extends MyPlane
{
	constructor(scene, idtexture, idheightmap, parts, heightscale)
	{
		super(scene,parts,parts);
		this.texture = scene.graph.textures[idtexture];
    this.heightmap = scene.graph.textures[idheightmap];
    this.heightscale = heightscale;
		this.setShader();
	};

	setShader() {
		this.shader = new CGFshader(this.scene.gl, "./shaders/terrain.vert", "./shaders/terrain.frag");
		this.shader.setUniformsValues({uSampler2: 1});
		this.shader.setUniformsValues({normScale: this.heightscale});

		this.appearance = new CGFappearance(this.scene);
		this.appearance.setTexture(this.texture);
	};

	display() {
		this.scene.setActiveShader(this.shader);
		this.appearance.apply();
		this.heightmap.bind(1);
		this.nurbsObject.display();
		this.scene.setActiveShader(this.scene.defaultShader);
	};

	updateTexCoords(s,t){
	};
};
