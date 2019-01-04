class CameraAnimation {

  constructor(span, from, to){
    this.from = from;
    this.to = to;
    this.span = span;
    this.init();
    this.calculate();
  };

  init(){
    this.fromPosition = vec3.fromValues(this.from.position[0],this.from.position[1],this.from.position[2]);
    this.fromDirection = vec3.fromValues(this.from.direction[0],this.from.direction[1],this.from.direction[2]);
    this.toPosition = vec3.fromValues(this.to.position[0],this.to.position[1],this.to.position[2]);
    this.toDirection = vec3.fromValues(this.to.direction[0],this.to.direction[1],this.to.direction[2]);
    this.position = vec3.create();
    this.direction = vec3.create();
    this.currentPosition = vec3.fromValues(0,0,0);
    this.currentDirection = vec3.fromValues(0,0,0);
  };

  calculate(){
    vec3.subtract(this.position, this.toPosition, this.fromPosition);
    this.positionVelocity = vec3.fromValues(this.position[0]/this.span,this.position[1]/this.span,this.position[2]/this.span);
    vec3.subtract(this.direction, this.toDirection, this.fromDirection);
    this.directionVelocity = vec3.fromValues(this.direction[0]/this.span,this.direction[1]/this.span,this.direction[2]/this.span);
  };

  finished(){
    return (Math.abs(this.currentPosition[0]) >= Math.abs(this.position[0]) && Math.abs(this.currentPosition[1]) >= Math.abs(this.position[1]) &&
      Math.abs(this.currentPosition[2]) >= Math.abs(this.position[2]) && Math.abs(this.currentDirection[0]) >= Math.abs(this.direction[0]) &&
      Math.abs(this.currentDirection[1]) >= Math.abs(this.direction[1]) && Math.abs(this.currentDirection[2]) >= Math.abs(this.direction[2]))
  };

};
