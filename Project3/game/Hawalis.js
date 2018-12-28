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
    this.cells = Array(4).fill(null).map(()=>Array(7).fill([(new Seed(scene)),(new Seed(scene))]));

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
              (i == 0 || i == 1)? this.scene.translate(j+0.35,k*0.2+0.1,i+0.35) : this.scene.translate(j+0.65,k*0.2+0.1,i+1+0.65);
              this.cells[i][j][k].display();
            this.scene.popMatrix();
          }
  }

  updateTexCoords(s,t){
  };

};
