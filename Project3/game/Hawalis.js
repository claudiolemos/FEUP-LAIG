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
    this.cells = Array(4).fill(null).map(()=>Array(7).fill([( new Seed(scene)), (new Seed(scene)) ,  (new Seed(scene)) ,  (new Seed(scene)) ,  (new Seed(scene)) ,  (new Seed(scene)) ]));
		this.cells[0][0][4].animation = new BezierAnimation(20*1000,[[0,0,0],[0,0.2,0.25],[0,0.2,0.75],[0,0,1]])
	};

  display() {
    this.board.display();
    this.displaySeeds();
  };

  displaySeeds(){
    for(var i = 0; i < this.cells.length; i++)
      for(var j = 0; j < this.cells[i].length; j++)
        for(var k = 0; k < this.cells[i][j].length; k++)
          if(!this.cells[i][j][k].animated){
            this.scene.pushMatrix();
              var offset = (i == 0 || i == 1)? 0 : 1;
							var x = (k & 1)? 0.375 : 0.625;
							var y = 0.1 + 0.2*~~(k/4);
							var z = (k % 4 == 0 || k % 4 == 3)? 0.375 : 0.625;
							this.scene.translate(j+x,y,i+z+offset)
              this.cells[i][j][k].display();
            this.scene.popMatrix();
          }
  }

  updateTexCoords(s,t){
  };

};
