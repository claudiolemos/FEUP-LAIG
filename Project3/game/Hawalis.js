class Hawalis extends CGFobject
{
	constructor(scene)
	{
		super(scene);
    this.server = new Server();
		this.currentPlayer = 1;
		this.difficulty = 1;
		this.mode = 1; // 1 - HvH / 2 - HvC / 3 - CvC
		this.prologBoard = [[[2,2,2,2,2,2,2],[2,2,2,2,2,2,2]],[[2,2,2,2,2,2,2],[2,2,2,2,2,2,2]]];
		console.log(this.prologBoard);
		this.board = new Board(scene);
		this.seeds = []; // seeds nos buracos
		this.queue = []; // seeds em animação (de um buraco para o outro)
		this.score = [[],[]]; // seeds no score board
		this.fillSeeds();
	};

	display() {
		this.picking();
		this.board.display();
		this.displayQueuedSeeds();
		this.displaySeeds();
	};


	picking() {
		if (this.scene.pickMode == false) {
			if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
				for (var i=0; i< this.scene.pickResults.length; i++) {
					var obj = this.scene.pickResults[i][0];
					if (obj)
					{
						var cellID = this.scene.pickResults[i][1];
						this.move(~~((cellID-1)/7),(cellID-1)%7);
					}
				}
				this.scene.pickResults.splice(0,this.scene.pickResults.length);
			}
		}
	};

	displaySeeds(){
		for(var i = 0; i < this.seeds.length; i++)
			for(var j = 0; j < this.seeds[i].length; j++)
				for(var k = 0; k < this.seeds[i][j].length; k++)
					this.seeds[i][j][k].display();
	};

	displayQueuedSeeds(){
		for(var i = 1; i < this.queue.length; i++)
			this.queue[i].display();

		if(this.queue.length >= 1)
			this.animateSeed(this.queue[0]);
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
			var coord = this.getFreePosition(seed.next[0],seed.next[1]);
			seed.coord = [coord[0],coord[1],coord[2]];
			this.seeds[seed.next[0]][seed.next[1]].push(seed);
			var next = seed.next;
			seed.next = [];
			seed.animation = null;

			this.queue.shift();

			this.displaySeeds();

			if(this.queue.length == 0)
				if(this.seeds[next[0]][next[1]].length > 1)
					this.move(next[0], next[1]);
				else if(this.seeds[next[0]][next[1]].length == 1){
					this.boardToProlog();
					console.log(this.prologBoard);
				}
		}
	};

	move(i,j){
		var next = [i,j]
		while(this.seeds[i][j].length > 0){
			var seed = this.seeds[i][j].shift();
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

	getScoreFreePosition(i){
		return vec3.fromValues(7*i-(0.35+(0.2+(1/30))*this.score[i].length),0.25,2.25+0.5*i)
	}

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

		boardToProlog(){
			for(var j = 0; j < 7; j++){
				this.prologBoard[0][0][j] = this.seeds[0][j].length;
				this.prologBoard[0][1][j] = this.seeds[1][j].length;
				this.prologBoard[1][0][j] = this.seeds[2][j].length;
				this.prologBoard[1][1][j] = this.seeds[3][j].length;
			}
		}

		updateTexCoords(s,t){
		};

	};
