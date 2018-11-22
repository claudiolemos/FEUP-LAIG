/**
* MyPlane class, which represents a rectangle object
*/
class MyTerrain extends MyPlane
{
	constructor(scene, idtexture, idheightmap, parts, heightscale)
	{
		super(scene);
		this.idtexture = idtexture;
    this.idheightmap = idheightmap;
    this.parts = parts;
    this.heightscale = heightscale;
	};

	updateTexCoords(s,t){
	};
};
