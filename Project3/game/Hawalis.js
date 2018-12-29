class Hawalis extends CGFobject
{
	constructor(scene)
	{
    super(scene);
    // this.board;
    // this.currentPlayer;
    // this.player1Seeds;
    // this.player2Seeds;
    // this.difficulty;
    this.board = new Board(scene);
    this.seeds = [];
		this.queue = [];
		this.fillSeeds();
		this.move(1,5);
	};

  display() {
    this.board.display();
    this.displaySeeds();
  };

  displaySeeds(){
		for(var i = 1; i < this.queue.length; i++)
			this.queue[i].display();

		if(this.queue.length >= 1)
			this.animateSeed(this.queue[0]);

    for(var i = 0; i < this.seeds.length; i++)
      for(var j = 0; j < this.seeds[i].length; j++)
        for(var k = 0; k < this.seeds[i][j].length; k++)
						this.seeds[i][j][k].display();
  };

	animateSeed(seed){
		if(seed.animation != null && !seed.animation.finished){
				this.scene.pushMatrix();
					seed.animation.update(this.scene.delta);
					seed.animation.apply(this.scene);
					seed.display();
				this.scene.popMatrix();
		}
		else if(seed.animation != null && seed.animation.finished){
			seed.animation = null;
			var next = this.getFreePosition(seed.next[0],seed.next[1]);
			seed.coord = [next[0],next[1],next[2]];
			this.seeds[seed.next[0]][seed.next[1]].push(seed)
			seed.next = [];
			this.queue.shift();
		}
	};

	move(i,j){
		var next = [i,j]
		while(this.seeds[i][j].length > 0){
			var seed = this.seeds[i][j].pop();
			seed.next = (next = this.getNext(next[0],next[1]));
			seed.animation = this.getAnimation(seed.coord,this.getFreePosition(next[0],next[1]));
			this.queue.push(seed);
		}
	}

	getFreePosition(i, j){
		var k = this.seeds[i][j].length;
		var offset = (i == 0 || i == 1)? 0 : 1;
		var x = (k & 1)? 0.625 : 0.375;
		var y = 0.1 + 0.2*~~(k/4);
		var z = (k % 4 == 0 || k % 4 == 3)? 0.375 : 0.625;
		return vec3.fromValues(j+x,y,i+z+offset);
	};

	getAnimation(initial, final){
		let p = [final[0]-initial[0], final[1]-initial[1], final[2]-initial[2]];
		return (new BezierAnimation(1000,[[0,0,0],[p[0]/4,p[1]/2+1,p[2]/4],[p[0],p[1]+1,p[2]],p]));
	};

	fillSeeds(){
    for(var i = 0; i < 4; i++){
			this.seeds[i] = [];
      for(var j = 0; j < 7; j++){
				this.seeds[i][j] = [];
				var offset = (i == 0 || i == 1)? 0 : 1;
				this.seeds[i][j].push(new Seed(this.scene, this.getFreePosition(i,j)));
				this.seeds[i][j].push(new Seed(this.scene, this.getFreePosition(i,j)));
			}}
	};

	getNext(i,j){
		if((i == 0 || i == 2) && j == 0)
			return [i+1,j];
		else if((i == 1 || i == 3) && j == 6)
			return [i-1,j];
		else if(i == 0 || i == 2)
			return [i,j-1];
		else if(i == 1 || i == 3)
			return [i,j+1];
	};

  updateTexCoords(s,t){
  };

};
