/**
* MyPlane class, which represents a rectangle object
*/
class MyCylinder2 extends CGFobject
{
	constructor(scene, base, top, height, slices, stacks)
	{
		super(scene);
		this.base = base;
		this.top = top;
		this.height = height;
		this.slices = slices;
		this.stacks = stacks;
		this.init();
	};

	init() {
		var mid = (this.base+this.top)/2;
		var z = this.height/2;
		var w = Math.pow(2, 0.5)/2;

		this.controlvertexes = [
			[[         0, -this.base, -z, 1], [   0, -mid, 0, 1], [        0, -this.top, z, 1]],
			[[ this.base, -this.base, -z, w], [ mid, -mid, 0, w], [ this.top, -this.top, z, w]],
			[[ this.base,          0, -z, 1], [ mid,    0, 0, 1], [ this.top,         0, z, 1]],
			[[ this.base,  this.base, -z, w], [ mid,  mid, 0, w], [ this.top,  this.top, z, w]],
			[[         0,  this.base, -z, 1], [   0,  mid, 0, 1], [        0,  this.top, z, 1]],
			[[-this.base,  this.base, -z, w], [-mid,  mid, 0, w], [-this.top,  this.top, z, w]],
			[[-this.base,          0, -z, 1], [-mid,    0, 0, 1], [-this.top,         0, z, 1]],
			[[-this.base, -this.base, -z, w], [-mid, -mid, 0, w], [-this.top, -this.top, z, w]],
			[[         0, -this.base, -z, 1], [   0, -mid, 0, 1], [        0, -this.top, z, 1]]
		];

		this.surface = new CGFnurbsSurface(8, 2, this.controlvertexes);
		this.nurbsObject = new CGFnurbsObject(this.scene, this.slices, this.stacks, this.surface);
	};

	display() {
		this.nurbsObject.display();
	};

	updateTexCoords(s,t){
	};
};
