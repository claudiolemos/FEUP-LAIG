% obtem e realiza uma jogada do humano
playerTurn(human, Game, PlayerIndex, NewGame, _Difficulty) :-
  getCurrentPlayer(Game, PlayerIndex),
  selectPit(Move, PlayerIndex, Game),
  move(Move, Game, NewGame).

% obtem e realiza uma jogada do computador

playerTurn(computer, Game, PlayerIndex, NewGame, Difficulty) :-
  getCurrentPlayer(Game, PlayerIndex),
  choose_move(Move, PlayerIndex, Difficulty, Game),
  move(Move, Game, NewGame),
  message(computerTurn).

/* realiza uma jogada do jogador, semeando as peças no seu tabuleiro
e quando possível, recolhendo peças ao oponente */

move([RowIndex, ColumnIndex], Game, FinalGame) :-
  getCurrentPlayer(Game, PlayerIndex),
  startSowing(RowIndex, ColumnIndex, FinalRowIndex, FinalColumnIndex, Game, NewGame, PlayerIndex),
  captureSeeds(NewGame, FinalRowIndex, FinalColumnIndex, PlayerIndex, FinalGame, _FinalSeeds).

% guarda em ValidMoves todas as jogadas possíveis para o jogador atual

valid_moves(Game, PlayerIndex, ValidMoves) :-
 findall([X,Y], checkValidPit(X, Y, PlayerIndex, Game), ValidMoves).

% guarda em ValidMoves todas as jogadas possíveis para o jogador atual

validMoves(Game, PlayerIndex, ValidMoves) :-
  findall([X,Y], (checkValidPit(OldX, OldY, PlayerIndex, Game), getPlayerIndex(CurrentPlayer, PlayerIndex), convertIndex(OldX, OldY, CurrentPlayer, X, Y)), ValidMoves).

/* predicado que verifica que é uma jogada possível
quando o buraco tem mais do que 1 pedra */

checkValidPit(RowIndex, ColumnIndex, PlayerIndex, Game) :-
 between(1, 2, RowIndex),
 between(1, 7, ColumnIndex),
 getSeeds(Game, RowIndex, ColumnIndex, PlayerIndex, Seeds),
 (Seeds > 1; (Seeds == 1, checkValidPitOne(RowIndex, ColumnIndex, PlayerIndex, Game, Seeds))).

 /* predicado que verifica que é uma jogada possível
 quando o buraco tem apenas 1 pedra e o restante
 tabuleiro tem apenas buracos com 1 ou 0 pedras */

checkValidPitOne(_RowIndex, _ColumnIndex, PlayerIndex, Game, _Seeds) :-
 getPlayerRow(Game, Row1, PlayerIndex, 1),
 getPlayerRow(Game, Row2, PlayerIndex, 2),
 maplist(isEqual(X), Row1),
 maplist(isEqual(X), Row2).

% recebendo um membro da linha, verifica se tem 1 ou 0 pedras

isEqual(_X,Y):-
 Y == 0; Y == 1.

/* predicado que para uma lista de ValidMoves, guarda em
SeedsPerMove a quantidade de pedras que cada jogada irá recolher */

getSeedsPerMove(Game, PlayerIndex, ValidMoves, SeedsPerMove) :-
 (foreach([RowIndex,ColumnIndex],ValidMoves), foreach(FinalSeeds,SeedsPerMove) do (startSowing(RowIndex, ColumnIndex, FinalRowIndex, FinalColumnIndex, Game, NewGame, PlayerIndex), captureSeeds(NewGame, FinalRowIndex, FinalColumnIndex, PlayerIndex, _FinalGame, FinalSeeds))).


/* inicia o processo de semear pedras, esvaziando
o buraco iniciale entrando no loop de semear*/
startSowing(RowIndex, ColumnIndex, FinalRowIndex, FinalColumnIndex, Game, FinalGame, PlayerIndex) :-
  getSeeds(Game, RowIndex, ColumnIndex, PlayerIndex, Seeds),
  setPit(Game, RowIndex, ColumnIndex, PlayerIndex, 0, NewGame),
  sowSeeds(NewGame, RowIndex, ColumnIndex, FinalRowIndex, FinalColumnIndex, PlayerIndex, Seeds, FinalGame).

/* predicado de término do loop de semear pedras, isto é,
quando a quantidades de pedras a semear termina */
sowSeeds(Game, RowIndex, ColumnIndex, FinalRowIndex, FinalColumnIndex, PlayerIndex, 0, FinalGame) :-
  getSeeds(Game, RowIndex, ColumnIndex, PlayerIndex, Seeds),
  endSowing(Game, RowIndex, ColumnIndex, FinalRowIndex, FinalColumnIndex, PlayerIndex, Seeds, FinalGame).

% loop que semeia as pedras

sowSeeds(Game, RowIndex, ColumnIndex, FinalRowIndex, FinalColumnIndex, PlayerIndex, Seeds, FinalGame) :-
  getNewIndexes(RowIndex, ColumnIndex, NewRowIndex, NewColumnIndex),
  addPit(Game, NewRowIndex, NewColumnIndex, PlayerIndex, NewGame),
  NewSeeds is Seeds - 1,
  sowSeeds(NewGame, NewRowIndex, NewColumnIndex, FinalRowIndex, FinalColumnIndex, PlayerIndex, NewSeeds, FinalGame).

/* predicado de término de uma jogada, isto é, quando o processo
de semear pedras termina num buraco com 0 pedras */
endSowing(Game, RowIndex, ColumnIndex, FinalRowIndex, FinalColumnIndex, _PlayerIndex, 1, FinalGame) :-
  switchPlayer(Game, NewGame),
  FinalRowIndex = RowIndex,
  FinalColumnIndex = ColumnIndex,
  FinalGame = NewGame.

% predicado que verifica que é possível continuar a semear pedras

endSowing(Game, RowIndex, ColumnIndex, FinalRowIndex, FinalColumnIndex, PlayerIndex, Seeds, FinalGame) :-
  setPit(Game, RowIndex, ColumnIndex, PlayerIndex, 0, NewGame),
  sowSeeds(NewGame, RowIndex, ColumnIndex, FinalRowIndex, FinalColumnIndex, PlayerIndex, Seeds, FinalGame).

/* quando a jogada do jogador 1 termina na linha do centro,
verifica se vai ser possível retirar pedras do jogador 2 */

captureSeeds(OldGame, 2, ColumnIndex, 1, FinalGame, FinalSeeds) :-
  getSeeds(OldGame, 1, ColumnIndex, 2, Seeds1),
  captureRow1(OldGame, 2, ColumnIndex, 1, FinalGame, Seeds1, FinalSeeds).

/* quando a jogada do jogador 2 termina na linha do centro,
verifica se vai ser possível retirar pedras do jogador 1 */

captureSeeds(OldGame, 1, ColumnIndex, 2, FinalGame, FinalSeeds) :-
  getSeeds(OldGame, 2, ColumnIndex, 1, Seeds1),
  captureRow1(OldGame, 1, ColumnIndex, 2, FinalGame, Seeds1, FinalSeeds).

% quando a jogada do jogador não termina na linha do centro

captureSeeds(OldGame, _RowIndex, _ColumnIndex, _PlayerIndex, FinalGame, FinalSeeds) :- FinalGame = OldGame, FinalSeeds is 0.

/* se o primeiro buraco imediato no tabuleiro do jogador 2
estiver vazio, o jogador 1 não irá recolher nenhuma pedra */

captureRow1(OldGame, 2, _ColumnIndex, 1, FinalGame, 0, FinalSeeds) :- FinalGame = OldGame, FinalSeeds is 0.

/* se o primeiro buraco imediato no tabuleiro do jogador 2
não estiver vazio, é verificado se o jogador 1 também poderá
retirar as pedras do segundo buraco */

captureRow1(OldGame, 2, ColumnIndex, 1, FinalGame, Seeds1, FinalSeeds) :-
  getSeeds(OldGame, 2, ColumnIndex, 2, Seeds2),
  captureRow2(OldGame, 2, ColumnIndex, 1, FinalGame, Seeds1, Seeds2, FinalSeeds).

/* se o primeiro buraco imediato no tabuleiro do jogador 1
estiver vazio, o jogador 2 não irá recolher nenhuma pedra */

captureRow1(OldGame, 1, _ColumnIndex, 2, FinalGame, 0, FinalSeeds) :- FinalGame = OldGame, FinalSeeds is 0.

/* se o primeiro buraco imediato no tabuleiro do jogador 1
não estiver vazio, é verificado se o jogador 2 também poderá
retirar as pedras do segundo buraco */

captureRow1(OldGame, 1, ColumnIndex, 2, FinalGame, Seeds1, FinalSeeds) :-
  getSeeds(OldGame, 1, ColumnIndex, 1, Seeds2),
  captureRow2(OldGame, 1, ColumnIndex, 2, FinalGame, Seeds1, Seeds2, FinalSeeds).

/* se o segundo buraco estiver vazio, o jogador 1 recolhe
apenas as pedras do primeiro buraco e o jogo é atualizado */

captureRow2(OldGame, 2, ColumnIndex, 1, FinalGame, Seeds1, 0, FinalSeeds) :-
  setPit(OldGame, 1, ColumnIndex, 2, 0, NewGame),
  FinalSeeds is Seeds1,
  updatePlayerSeeds(NewGame, FinalSeeds, 1, FinalGame).

/* se o segundo buraco tiver pedras, o jogador 1 recolhe
 as pedras dos dois buracos e o jogo é atualizado */

captureRow2(OldGame, 2, ColumnIndex, 1, FinalGame, Seeds1, Seeds2, FinalSeeds) :-
  setPit(OldGame, 1, ColumnIndex, 2, 0, Game),
  setPit(Game, 2, ColumnIndex, 2, 0, NewGame),
  FinalSeeds is (Seeds1 + Seeds2),
  updatePlayerSeeds(NewGame, FinalSeeds, 1, FinalGame).

/* se o segundo buraco estiver vazio, o jogador 2 recolhe
apenas as pedras do primeiro buraco e o jogo é atualizado */

captureRow2(OldGame, 1, ColumnIndex, 2, FinalGame, Seeds1, 0, FinalSeeds) :-
  setPit(OldGame, 2, ColumnIndex, 1, 0, NewGame),
  FinalSeeds is Seeds1,
  updatePlayerSeeds(NewGame, FinalSeeds, 2, FinalGame).

/* se o segundo buraco tiver pedras, o jogador 2 recolhe
 as pedras dos dois buracos e o jogo é atualizado */

captureRow2(OldGame, 1, ColumnIndex, 2, FinalGame, Seeds1, Seeds2, FinalSeeds) :-
  setPit(OldGame, 2, ColumnIndex, 1, 0, Game),
  setPit(Game, 1, ColumnIndex, 1, 0, NewGame),
  FinalSeeds is (Seeds1 + Seeds2),
  updatePlayerSeeds(NewGame, FinalSeeds, 2, FinalGame).
