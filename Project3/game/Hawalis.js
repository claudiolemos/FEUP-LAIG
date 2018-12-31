class Hawalis extends CGFobject
{
	constructor(scene)
	{
		super(scene);
    this.server = new Server();
		this.currentPlayer = 'player1';
		this.difficulty = 1;
		this.mode = 1; // 1 - HvH / 2 - HvC / 3 - CvC
		this.prologBoard = '[[[[2,2,2,2,2,2,2],[2,2,2,2,2,2,2]],[[2,2,2,2,2,2,2],[2,2,2,2,2,2,2]]],player1,0,0]';
		this.board = new Board(scene);
		this.seeds = []; // seeds nos buracos
		this.turnQueue = []; // seeds em animação de um buraco para o outro
		this.scoreQueue = []; // seeds em animação de um buraco para o score board
		this.score = [[],[]]; // seeds no score board
		this.points = [0,0];
		this.fillSeeds();

	};

	display() {
		this.picking();
		this.board.display();
		this.displaySeeds();
		this.displayQueuedSeeds();
	};

	displaySeeds(){
		for(var i = 0; i < this.seeds.length; i++)
			for(var j = 0; j < this.seeds[i].length; j++)
				for(var k = 0; k < this.seeds[i][j].length; k++)
					this.seeds[i][j][k].display();

		for(var i = 0; i < this.score.length; i++)
			for(var j = 0; j < this.score[i].length; j++)
				this.score[i][j].display();
	};

	displayQueuedSeeds(){
		for(var i = 1; i < this.turnQueue.length; i++)
			this.turnQueue[i].display();

		for(var i = 1; i < this.scoreQueue.length; i++)
			this.scoreQueue[i].display();

		if(this.turnQueue.length >= 1)
			this.animateSeed(this.turnQueue[0], 'turn');

		if(this.scoreQueue.length >= 1)
			this.animateSeed(this.scoreQueue[0], 'score');
	};

	animateSeed(seed, type){
		if(seed.animation != null && !seed.animation.finished){
			this.scene.pushMatrix();
				seed.animation.update(this.scene.delta*this.scene.velocity);
				seed.animation.apply(this.scene);
				seed.display();
			this.scene.popMatrix();
		}
		else if(seed.animation != null && seed.animation.finished){
			switch(type) {
			  case 'turn':
					var cell = this.addToCell(seed);
					this.nextMove(cell);
			    break;
			  case 'score':
					this.addToScore(seed);
			    break;
			}
		}
	};

	addToCell(seed){
		var cell = seed.next;
		seed.coord = this.getCellFreePosition(cell[0],cell[1]);
		seed.animation = null;
		// seed.next = [];
		this.turnQueue.shift();
		this.seeds[cell[0]][cell[1]].push(seed);
		// seed.cell = [];
		seed.display();
		return cell;
	};

	addToScore(seed){
		seed.animation = null;
		this.scoreQueue.shift();
		this.score[seed.score].push(seed);
		seed.coord = seed.nextCoord;
		seed.display();
	};

	nextMove(cell){
		if(this.turnQueue.length == 0)
			if(this.seeds[cell[0]][cell[1]].length > 1)
				this.move(cell[0], cell[1]);
			else if(this.seeds[cell[0]][cell[1]].length == 1){
				if(cell[0] == 1 || cell[0] == 2)
					this.captureSeeds(cell);
				this.updateBoard();
			}
	};

	captureSeeds(cell){
		var player = cell[0] == 1? 1 : 2;
		var coords = [];
		coords[0] = cell[0] == 1? [2,cell[1]] : [1,cell[1]];
		coords[1] = cell[0] == 1? [3,cell[1]] : [0,cell[1]];

		if(this.seeds[coords[0][0]][coords[0][1]].length > 0){
			var index = this.score[player-1].length;
			for(var i = 0; i < 2; i++){
				while(this.seeds[coords[i][0]][coords[i][1]].length > 0){
					var seed = this.seeds[coords[i][0]][coords[i][1]].pop();
					seed.score = player - 1;
					this.points[player - 1]++;
					seed.nextCoord = this.getScoreFreePosition(player-1,index);
					seed.animation = this.getAnimation(seed.coord,seed.nextCoord);
					this.scoreQueue.push(seed);
					index++;
				}
			}
		}
	};

	move(i,j){
		var next = [i,j]
		while(this.seeds[i][j].length > 0){
			var seed = this.seeds[i][j].pop();
			seed.next = (next = this.getNext(next[0],next[1]));
			seed.animation = this.getAnimation(seed.coord,this.getCellFreePosition(next[0],next[1]));
			this.turnQueue.push(seed);
		}
	};

	getCellFreePosition(i, j){
		var k = this.seeds[i][j].length;
		var offset = (i == 0 || i == 1)? 0 : 1;
		var x = (k & 1)? 0.625 : 0.375;
		var y = 0.1 + 0.2*~~(k/4);
		var z = (k % 4 == 0 || k % 4 == 3)? 0.375 : 0.625;
		return vec3.fromValues(j+x,y,i+z+offset);
	};

	getScoreFreePosition(i, index){
		let vec = i == 0? vec3.fromValues(7-(0.35+(0.2+(1/30))*index),0.25,2.25+0.5*i) : vec3.fromValues((0.35+(0.2+(1/30))*index),0.25,2.25+0.5*i);
		return vec;
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
				this.seeds[i][j].push(new Seed(this.scene, this.getCellFreePosition(i,j)));
				this.seeds[i][j].push(new Seed(this.scene, this.getCellFreePosition(i,j)));
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

		updateBoard(){
			this.changePlayer();
			this.boardToProlog();
			console.log(this.prologBoard);
		};

		changePlayer(){
			this.currentPlayer = (this.currentPlayer == 'player1')? 'player2' : 'player1';
		};

		boardToProlog(){
			this.prologBoard = '[[';
			for(var i = 0; i < 4; i+=2){
				this.prologBoard += '[';
				for(var j = 0; j < 2; j++){
					this.prologBoard += '[';
					for(var k = 0; k < 7; k++){
						this.prologBoard += this.seeds[i+j][k].length;
						this.prologBoard += (k < 6)? ',' : '';
					}
					this.prologBoard += ']';
					this.prologBoard += (j < 1)? ',' : '';
				}
				this.prologBoard += ']';
				this.prologBoard += (i < 2)? ',' : '';
			}
			this.prologBoard += `],${this.currentPlayer},${this.points[0]},${this.points[1]}]`;
		};

		picking() {
			if (this.scene.pickMode == false) {
				if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
					for (var i=0; i< this.scene.pickResults.length; i++) {
						var obj = this.scene.pickResults[i][0];
						if (obj) {
							var id = this.scene.pickResults[i][1];
							// this.move(~~((id-1)/7),(id-1)%7);
							var request = `isValidMove(${this.prologBoard},${~~((id-1)/7)},${(id-1)%7})`
							this.server.makeRequest(request);
						}
					}
					this.scene.pickResults.splice(0,this.scene.pickResults.length);
				}
			}
		};

		updateTexCoords(s,t){
		};

	};
