/**
* MyPlane class, which represents a rectangle object
*/
class MyWater extends MyPlane
{
	constructor(scene, idtexture, idwavemap, parts, heightscale, texscale)
	{
		super(scene,parts,parts);
		this.texture = scene.graph.textures[idtexture];
    this.wavemap = scene.graph.textures[idwavemap];
    this.heightscale = heightscale;
    this.texscale = texscale;
		this.offset = 0;
		this.delta;
		this.setShader();
	};

	setShader() {
		this.shader = new CGFshader(this.scene.gl, "./shaders/water.vert", "./shaders/water.frag");
		this.shader.setUniformsValues({uSampler2: 1});
		this.shader.setUniformsValues({normScale: this.heightscale});
		this.shader.setUniformsValues({texScale: this.texscale});

		this.appearance = new CGFappearance(this.scene);
		this.appearance.setTexture(this.texture);
	};

	display() {
		this.offset = (this.offset + 0.0025) % 1;
		this.delta = this.offset - 0.5;
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
