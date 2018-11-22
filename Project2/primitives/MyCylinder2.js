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
		var w = Math.pow(2, 0.5)/2;

		console.log('BASE:' + this.base + ' TOP:' + this.top + ' HEIGHT:' + this.height + ' MID:' + mid + 'w:' + w);

		this.controlvertexes = [
			[[         0, -this.base, 0, 1], [   0, -mid, this.height/2, 1], [        0, -this.top, this.height, 1]],
			[[ this.base, -this.base, 0, w], [ mid, -mid, this.height/2, w], [ this.top, -this.top, this.height, w]],
			[[ this.base,          0, 0, 1], [ mid,    0, this.height/2, 1], [ this.top,         0, this.height, 1]],
			[[ this.base,  this.base, 0, w], [ mid,  mid, this.height/2, w], [ this.top,  this.top, this.height, w]],
			[[         0,  this.base, 0, 1], [   0,  mid, this.height/2, 1], [        0,  this.top, this.height, 1]],
			[[-this.base,  this.base, 0, w], [-mid,  mid, this.height/2, w], [-this.top,  this.top, this.height, w]],
			[[-this.base,          0, 0, 1], [-mid,    0, this.height/2, 1], [-this.top,         0, this.height, 1]],
			[[-this.base, -this.base, 0, w], [-mid, -mid, this.height/2, w], [-this.top, -this.top, this.height, w]],
			[[         0, -this.base, 0, 1], [   0, -mid, this.height/2, 1], [        0, -this.top, this.height, 1]]
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
