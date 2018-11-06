/**
* MyPlane class, which represents a rectangle object
*/
class MyPlane extends CGFobject
{
	constructor(scene, npartsU, npartsV)
	{
		super(scene);
		this.npartsU = npartsU;
    this.npartsV = npartsV;
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];
		this.defaultTexCoords = [];
		this.initBuffers();
	};


	initBuffers()
	{
    var incU = 1/this.npartsU;
    var incV = 1/this.npartsV;

    for(var v = 0; v < this.npartsV; v++)
      for(var u = 0; u < this.npartsU; u++){
        this.vertices.push(
          -0.5 + incU*u, 0, -0.5 + incV*v,
           0.5 + incU*u, 0, -0.5 + incV*v,
          -0.5 + incU*u, 0,  0.5 + incV*v,
           0.5 + incU*u, 0,  0.5 + incV*v
        )

        this.indices.push(
          0 + 4*((v*this.npartsV)+u), 2 + 4*((v*this.npartsV)+u), 1 + 4*((v*this.npartsV)+u),
          1 + 4*((v*this.npartsV)+u), 2 + 4*((v*this.npartsV)+u), 3 + 4*((v*this.npartsV)+u)
        )

        this.normals.push(
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
          0, 1, 0
        )

        this.texCoords.push(
                 incU*u,        incV*v,
          incU + incU*u,        incV*v,
                 incU*u, incV + incV*v,
          incU + incU*u, incV + incV*v
        )

      }


    this.primitiveType=this.scene.gl.TRIANGLES;
		this.defaultTexCoords = this.texCoords;
		this.initGLBuffers();
	};

	updateTexCoords(s,t){
	};
};
