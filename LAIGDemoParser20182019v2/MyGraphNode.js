/**
 * MyGraphNode
 * @constructor
 */

 class MyGraphNode
 {
 	constructor(graph, id)
 	{
    this.graph = graph;
    this.id = id;
    this.transformation = mat4.create();
    mat4.identity(this.transformation);
    this.materials = [];
    this.textures = [];
    this.length_s = 1;
    this.length_t = 1;
    this.children = [];
    this.primitives = [];
 	};

 	addChild(id)
 	{
    this.children.push(id);
 	};

  addPrimitive(id)
 	{
    this.primitives.push(id);
 	};

 };
