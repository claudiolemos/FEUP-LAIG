/**
 * Represents the Hawalis game
 */
class Hawalis extends CGFobject {
  /**
   * [constructor description]
   * @param {XMLScene} scene	 represents the CGFscene
   */
  constructor(scene) {
    super(scene);

    this.mode = {
      PvP: '1',
      PvC: '2',
      CvC: '3'
    };
    this.state = {
      playerTurn: '1',
      botTurn: '2',
      movingSeeds: '3',
      waiting: '4',
      quit: '5',
      movie: '6'
    };
    this.difficulty = {
      easy: '1',
      hard: '2'
    };

    this.server = new Server();
    this.gameState = this.state.waiting;
    this.gameDifficulty = this.difficulty.hard;
    this.gameMode = this.mode.PvP;
    this.board = new Board(scene);
    this.seeds = [];
    this.prevseeds = [];
    this.previousBoards = [];
    this.previousSeeds = [];
    this.allScore = [];
    this.turnQueue = [];
    this.scoreQueue = [];
    this.score = [[],[]];
    this.velocity = 1;
    this.time = 0;
    this.timeout = 30;
    this.moves = [];
    this.init();
    this.scene.setPickEnabled(false);
  };

  /**
   * displays the game
   */
  display() {
    this.updateHTML();
    this.checkState();
    this.board.display();
    this.displaySeeds();
    this.displayQueuedSeeds();
  };

  /**
   * checks what needs to happen wether it's the player's or bot's turn
   */
  checkState() {
    switch (this.gameState) {
      case this.state.playerTurn:
        this.picking();
        this.checkTimeout();
        break;
      case this.state.botTurn:
        this.getBotMove();
        break;
    }
  };

  /**
   * increases time and checks if player's turn's timeout has been reached
   */
  checkTimeout() {
    this.time += this.scene.delta / 1000;
    if (this.time > this.timeout) {
      this.updateBoard();
      this.updateState();
      this.time = 0;
    }
  }

  /**
   * initializes everything needed to start a new game
   */
  startGame() {
    var hawalis = this;
    this.server.makeRequest('start', function(data) {
      hawalis.scene.setPickEnabled(true);
      hawalis.init();
      hawalis.turnQueue = [];
      hawalis.previousBoards = [];
      hawalis.time = 0;
      hawalis.scoreQueue = [];
      hawalis.score = [[],[] ];
      hawalis.points = [0, 0];
      hawalis.currentPlayer = 'player1';
      hawalis.prologBoard = '[[[[2,2,2,2,2,2,2],[2,2,2,2,2,2,2]],[[2,2,2,2,2,2,2],[2,2,2,2,2,2,2]]],player1,0,0]';
      hawalis.updateState();
    });
  }

  /**
   * exits the current game
   */
  quitGame() {
    this.gameState = this.state.quit;
    this.scene.setPickEnabled(false);
  }

  /**
   * undo's a human player's last move
   */
  undo() {
    if (this.gameMode == this.mode.PvP) {
      if (this.gameState != this.state.waiting && this.gameState != this.state.movie && this.gameState != this.state.movingSeeds) {
        if (this.previousBoards.length > 0) {
          this.prologBoard = this.previousBoards[this.previousBoards.length - 1];
          this.previousSeeds.pop();
          this.prevToSeeds(this.previousSeeds[this.previousSeeds.length - 1].slice());
          this.allScore.pop();
          this.score = this.allScore[this.allScore.length - 1].slice();
          this.previousBoards.pop();
          this.changePlayer();
        }
        else
          swal("Can't undo", "Please make a move so you can undo it", "error");
      }
      else
        swal("Can't undo", "Wait for the turn to finish", "error");
    } else
        swal("Can't undo", "You can only undo on Player v Player", "error");
  };

  /**
   * creates a list with all the seeds as they were in the last turn
   */
  cloneSeeds() {
    for (var i = 0; i < 4; i++) {
      this.prevseeds[i] = [];
      for (var j = 0; j < 7; j++) {
        this.prevseeds[i][j] = [];
        var offset = (i == 0 || i == 1) ? 0 : 1;
        for (var k = 0; k < this.seeds[i][j].length; k++) {
          this.prevseeds[i][j].push(new Seed(this.scene, this.getCellFreePosition(i, j)));
        }
      }
    }
  };

  /**
   * updates the board with the seeds from the previous turn
   * @param  {array} prev array with all the seeds from the previous turn
   */
  prevToSeeds(prev) {
    console.log(prev);
    for (var i = 0; i < 4; i++) {
      this.seeds[i] = [];
      for (var j = 0; j < 7; j++) {
        this.seeds[i][j] = [];
        var offset = (i == 0 || i == 1) ? 0 : 1;
        for (var k = 0; k < prev[i][j].length; k++) {
          this.seeds[i][j].push(new Seed(this.scene, this.getCellFreePosition(i, j)));
        }
      }
    }
  };

  /**
   * play's the movie of the last played game
   */
  playMovie() {
    if (this.moves.length == 0) {
      swal("Can't play movie", "Play a game in order for the movie to be played", "error");
    } else {
      this.init();
      this.turnQueue = [];
      this.time = 0;
      this.scoreQueue = [];
      this.score = [
        [],
        []
      ];
      this.points = [0, 0];
      this.currentPlayer = 'player1';
      this.prologBoard = '[[[[2,2,2,2,2,2,2],[2,2,2,2,2,2,2]],[[2,2,2,2,2,2,2],[2,2,2,2,2,2,2]]],player1,0,0]';
      this.gameState = this.state.movie;
      var move = this.moves.shift();
      this.move(move[0], move[1]);
    }
  }

  /**
   * updates the HTML with the game info
   */
  updateHTML() {
    if (this.gameState == this.state.botTurn || this.gameState == this.state.playerTurn || this.gameState == this.state.movingSeeds) {
      if (this.gameState == this.state.playerTurn)
        document.getElementById("time").innerText = `${("00"+parseInt(this.time / 60)).slice(-"00".length)}:${    ("00"+parseInt(this.time % 60)).slice(-"00".length)}`;
      document.getElementById("score").innerText = `${this.score[0].length} seeds : ${this.score[1].length} seeds`;
      document.getElementById("turn").innerText = (this.currentPlayer == 'player1') ? "Player 1's turn" : "Player 2's turn\n";
    } else
      document.getElementById("turn").innerText = "";

    switch (this.gameState) {
      case this.state.waiting:
        document.getElementById("info").innerText = "Start a game";
        break;
      case this.state.quit:
        document.getElementById("info").innerText = "You've exited the game";
        break;
      case this.state.playerTurn:
        document.getElementById("info").innerText = "Please select your pit";
        break;
      case this.state.movingSeeds:
        document.getElementById("info").innerText = "Moving seeds";
        break;
      case this.state.botTurn:
        document.getElementById("info").innerText = "Moving seeds";
        break;
      case this.state.movie:
        document.getElementById("score").innerText = `${this.score[0].length} seeds : ${this.score[1].length} seeds`;
        document.getElementById("time").innerText = "";
        document.getElementById("info").innerText = "Playing the movie";
        break;
      default:
        document.getElementById("info").innerText = "";
        break;
    }
  }

  /**
   * updates the game state, depending on the mode chosen
   */
  updateState() {
    switch (this.gameMode) {
      case this.mode.PvP:
        this.gameState = this.state.playerTurn;
        this.scene.setPickEnabled(true);
        break;
      case this.mode.PvC:
        this.gameState = (this.currentPlayer == 'player1') ? this.state.playerTurn : this.state.botTurn;
        if (this.gameState == this.state.playerTurn)
          this.scene.setPickEnabled(true);
        break;
      case this.mode.CvC:
        this.gameState = this.state.botTurn;
        break;
    }
  }

  /**
   * displays all the seeds in the game that are still
   */
  displaySeeds() {
    for (var i = 0; i < this.seeds.length; i++)
      for (var j = 0; j < this.seeds[i].length; j++)
        for (var k = 0; k < this.seeds[i][j].length; k++)
          this.seeds[i][j][k].display();

    for (var i = 0; i < this.score.length; i++)
      for (var j = 0; j < this.score[i].length; j++)
        this.score[i][j].display();
  };

  /**
   * displays all the seeds in the game that are being animated
   */
  displayQueuedSeeds() {
    for (var i = 1; i < this.turnQueue.length; i++)
      this.turnQueue[i].display();

    for (var i = 1; i < this.scoreQueue.length; i++)
      this.scoreQueue[i].display();

    if (this.turnQueue.length >= 1)
      this.animateSeed(this.turnQueue[0], 'turn');

    if (this.scoreQueue.length >= 1)
      this.animateSeed(this.scoreQueue[0], 'score');
  };

  /**
   * animates a seed to its destination
   * @param  {Seed}   seed current seed being animated
   * @param  {string} type wheter it's a turn seed (animated around the player's board) or a score seed (being collected by a player)
   */
  animateSeed(seed, type) {
    if (seed.animation != null && !seed.animation.finished) {
      this.scene.pushMatrix();
      seed.animation.update(this.scene.delta * this.velocity);
      seed.animation.apply(this.scene);
      seed.display();
      this.scene.popMatrix();
    } else if (seed.animation != null && seed.animation.finished) {
      switch (type) {
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

  /**
   * adds a seed to it's next cell
   * @param {Seed} seed seed being added to a cell
   */
  addToCell(seed) {
    var cell = seed.next;
    seed.coord = this.getCellFreePosition(cell[0], cell[1]);
    seed.animation = null;
    if (this.gameState != this.state.quit)
      this.turnQueue.shift();
    this.seeds[cell[0]][cell[1]].push(seed);
    seed.display();
    return cell;
  };

  /**
  * adds a seed to the score board
  * @param {Seed} seed seed being added to the score board
  */
  addToScore(seed) {
    seed.animation = null;
    if (this.gameState != this.state.quit)
    this.scoreQueue.shift();
    this.score[seed.score].push(seed);
    seed.coord = seed.nextCoord;
    seed.display();
    if (this.scoreQueue.length == 0){
      this.checkGameStatus();
      this.allScore.push([this.score[0].slice(0),this.score[1].slice(0)]);
    }
  };

  /**
   * checks whether a move needs to happen depending on the cell that the last seed landed on
   * @param  {array} cell position of the cell that the last seed landed on
   */
  nextMove(cell) {
    if (this.turnQueue.length == 0)
      if (this.seeds[cell[0]][cell[1]].length > 1)
        this.move(cell[0], cell[1]);
      else if (this.seeds[cell[0]][cell[1]].length == 1) {
      if (cell[0] == 1 || cell[0] == 2)
        this.captureSeeds(cell);
      this.updateBoard();
      if (this.scoreQueue.length == 0){
        this.allScore.push([this.score[0].slice(0),this.score[1].slice(0)]);
        this.checkGameStatus();
      }
    }
  };

  /**
   * captures the seeds from the other player depending on the cell that the last seed landed on
   * @param  {array} cell position of the cell that the last seed landed on
   */
  captureSeeds(cell) {
    var player = cell[0] == 1 ? 1 : 2;
    var coords = [];
    coords[0] = cell[0] == 1 ? [2, cell[1]] : [1, cell[1]];
    coords[1] = cell[0] == 1 ? [3, cell[1]] : [0, cell[1]];

    if (this.seeds[coords[0][0]][coords[0][1]].length > 0) {
      var index = this.score[player - 1].length;
      for (var i = 0; i < 2; i++) {
        while (this.seeds[coords[i][0]][coords[i][1]].length > 0) {
          var seed = this.seeds[coords[i][0]][coords[i][1]].pop();
          seed.score = player - 1;
          this.points[player - 1]++;
          seed.nextCoord = this.getScoreFreePosition(player - 1, index);
          seed.animation = this.getAnimation(seed.coord, seed.nextCoord);
          this.scoreQueue.push(seed);
          index++;
        }
      }
    }
  };

  /**
   * moves all the seeds in a cell
   * @param  {number} i cell's row index
   * @param  {number} j cell's column index
   */
  move(i, j) {
    var next = [i, j]
    while (this.seeds[i][j].length > 0) {
      var seed = this.seeds[i][j].pop();
      seed.next = (next = this.getNext(next[0], next[1]));
      seed.animation = this.getAnimation(seed.coord, this.getCellFreePosition(next[0], next[1]));
      this.turnQueue.push(seed);
    }
  };

  /**
   * gets the coordinates of the next free position in a cell, where a seed will be stacked on
   * @param  {number} i cell's row index
   * @param  {number} j cell's column index
   * @return {vec3} coordinates of the next free position
   */
  getCellFreePosition(i, j) {
    var k = this.seeds[i][j].length;
    var offset = (i == 0 || i == 1) ? 0 : 1;
    var x = (k & 1) ? 0.625 : 0.375;
    var y = 0.1 + 0.2 * ~~(k / 4);
    var z = (k % 4 == 0 || k % 4 == 3) ? 0.375 : 0.625;
    return vec3.fromValues(j + x, y, i + z + offset);
  };

  /**
   * gets the coordinates of the next free position in a player's score board
   * @param  {number} i     current player (0 if player 1 or 1 if player 2)
   * @param  {number} index length of player i's score board
   * @return {vec3} coordinates of the next free position
   */
  getScoreFreePosition(i, index) {
    let vec = i == 0 ? vec3.fromValues(7 - (0.35 + (0.2 + (1 / 30)) * index), 0.25, 2.25 + 0.5 * i) : vec3.fromValues((0.35 + (0.2 + (1 / 30)) * index), 0.25, 2.25 + 0.5 * i);
    return vec;
  };

  /**
   * gets a bezier animation to animate seeds around the board
   * @param  {array} initial coordinates of the initial position
   * @param  {array} final   coordinates of the final position
   * @return {BezierAnimation]} animation between initial and final that takes 1 second
   */
  getAnimation(initial, final) {
    let p = [final[0] - initial[0], final[1] - initial[1], final[2] - initial[2]];
    return (new BezierAnimation(1000, [
      [0, 0, 0],
      [p[0] / 4, p[1] / 2 + 1, p[2] / 4],
      [p[0], p[1] + 1, p[2]], p
    ]));
  };

  /**
   * cleans seeds array and fills it with the initial disposition of the seeds, which is 2 seeds per pit
   */
  init() {
    this.seeds = [];
    this.score = [[],[]];
    this.points = [0, 0];
    this.prologBoard = '[[[[2,2,2,2,2,2,2],[2,2,2,2,2,2,2]],[[2,2,2,2,2,2,2],[2,2,2,2,2,2,2]]],player1,0,0]';
    for (var i = 0; i < 4; i++) {
      this.seeds[i] = [];
      for (var j = 0; j < 7; j++) {
        this.seeds[i][j] = [];
        var offset = (i == 0 || i == 1) ? 0 : 1;
        this.seeds[i][j].push(new Seed(this.scene, this.getCellFreePosition(i, j)));
        this.seeds[i][j].push(new Seed(this.scene, this.getCellFreePosition(i, j)));
      }
    }
    this.cloneSeeds();
    this.previousSeeds.push(this.prevseeds.slice(0));
    this.allScore.push([this.score[0].slice(0),this.score[1].slice(0)]);
  };

  /**
   * gets the coordinate of the next cell, depending on the one that's currently in
   * @param  {number} i cell's row index
   * @param  {number} j cell's column index
   * @return {array} coordinate of the next cell
   */
  getNext(i, j) {
    if ((i == 0 || i == 2) && j == 0)
      return [i + 1, j];
    else if ((i == 1 || i == 3) && j == 6)
      return [i - 1, j];
    else if (i == 0 || i == 2)
      return [i, j - 1];
    else if (i == 1 || i == 3)
      return [i, j + 1];
  };

  /**
   * changes the current player and updates the prolog borad
   * @return {[type]}
   */
  updateBoard() {
    this.changePlayer();
    this.boardToProlog();
  };

  /**
   * transforms the seeds array into a string to prolog
   */
  boardToProlog() {
    this.previousBoards.push(this.prologBoard);
    this.cloneSeeds();
    this.previousSeeds.push(this.prevseeds.slice(0));
    this.prologBoard = '[[';
    for (var i = 0; i < 4; i += 2) {
      this.prologBoard += '[';
      for (var j = 0; j < 2; j++) {
        this.prologBoard += '[';
        for (var k = 0; k < 7; k++) {
          this.prologBoard += this.seeds[i + j][k].length;
          this.prologBoard += (k < 6) ? ',' : '';
        }
        this.prologBoard += ']';
        this.prologBoard += (j < 1) ? ',' : '';
      }
      this.prologBoard += ']';
      this.prologBoard += (i < 2) ? ',' : '';
    }
    this.prologBoard += `],${this.currentPlayer},${this.points[0]},${this.points[1]}]`;
  };

  /**
   * makes a request to prolog, checking if a cell is a valid move for the current player
   * @param  {number}  id cell id (from 1 to 28)
   */
  isValidMove(id) {
    var hawalis = this;
    var request = `isValidMove(${this.prologBoard},${~~((id-1)/7)},${(id-1)%7})`;
    this.server.makeRequest(request, function(data) {
      var response = JSON.parse(data.target.response);

      if (response[0]) {
        hawalis.move(response[1], response[2]);
        hawalis.moves.push([response[1], response[2]]);
        hawalis.scene.setPickEnabled(false);
        hawalis.gameState = hawalis.state.movingSeeds;
      } else
        swal("Invalid pit", "Please select a valid pit in your board", "error");
    });
  };

  /**
   * makes a request to prolog, check if the current game has been won or can continue
   * @return {[type]}
   */
  checkGameStatus() {
    var hawalis = this;
    var request = `checkGameStatus(${this.prologBoard})`;
    this.server.makeRequest(request, function(data) {
      var response = data.target.response;
      switch (response) {
        case 'player1':
          hawalis.win(1);
          break;
        case 'player2':
          hawalis.win(2);
          break;
        case 'continue':
          if (hawalis.gameState != hawalis.state.quit && hawalis.gameState != hawalis.state.movie)
            hawalis.updateState();
          else if (hawalis.gameState == hawalis.state.movie) {
            var move = hawalis.moves.shift();
            hawalis.move(move[0], move[1]);
          }
          hawalis.time = 0;
          break;
      }
    });
  };

  /**
   * makes a request to prolog, asking for a bot move
   */
  getBotMove() {
    var hawalis = this;
    var request = `getBotMove(${this.prologBoard},${this.gameDifficulty})`;
    this.server.makeRequest(request, function(data) {
      var response = JSON.parse(data.target.response);
      hawalis.move(response[0], response[1]);
      hawalis.moves.push([response[0], response[1]]);
    });
    this.gameState = this.state.movingSeeds;
  };

  /**
   * alerts the user the game has been won
   * @param  {number} player 1 or 2
   */
  win(player) {
    swal(`Player ${player} won the game`, `${this.score[0].length} seeds : ${this.score[1].length} seeds`, "success");
    this.gameState = this.state.waiting;
  };

  /**
   * changes the current player
   */
  changePlayer() {
    this.currentPlayer = (this.currentPlayer == 'player1') ? 'player2' : 'player1';
  };

  /**
   * pit picking
   */
  picking() {
    if (this.scene.pickMode == false) {
      if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
        for (var i = 0; i < this.scene.pickResults.length; i++) {
          var obj = this.scene.pickResults[i][0];
          if (obj) {
            this.isValidMove(this.scene.pickResults[i][1]);
          }
        }
        this.scene.pickResults.splice(0, this.scene.pickResults.length);
      }
    }
  };

  updateTexCoords(s, t) {};

};
