/**
* MyPlane class, which represents a rectangle object
*/
class CircularAnimation extends Animation
{
	constructor(span, centerX, centerY, centerZ, radius, startang, rotang)
	{
    super(span);
    this.centerX = centerX;
    this.centerY = centerY;
    this.centerZ = centerZ;
    this.radius = radius;
    this.startang = startang;
    this.rotang = rotang;
	};

	copy(){
		return new CircularAnimation(this.span, this.centerX, this.centerY, this.centerZ, this.radius, this.startang, this.rotang);
	};

  update(){
  };

  apply(){
  };

};
