% limpa a consola

clearConsole :- write('\33\[2J').

% obtem o tabuleiro do jogo, guardando-o em Board

getBoard(Game, Board) :- nth1(1, Game, Board).

% obtem o jogador atual (1 ou 2), guardando-o em CurrentPlayer

getCurrentPlayer(Game, CurrentPlayer) :-
  nth1(2, Game, Player),
  getPlayerIndex(Player, CurrentPlayer).

% obtem a quantidade de pedras capturadas pelo jogador 1, guardando-as em Player1Seeds

getPlayerSeeds(Game, Player1Seeds, 1) :-
  nth1(3, Game, Player1Seeds).

% obtem a quantidade de pedras capturadas pelo jogador 2, guardando-as em Player2Seeds

getPlayerSeeds(Game, Player2Seeds, 2) :-
  nth1(4, Game, Player2Seeds).

% obtem o tabuleiro do jogador PlayerIndex, guardando-o em PlayerBoard

getPlayerBoard(Game, PlayerBoard, PlayerIndex) :-
  getBoard(Game, Board),
  nth1(PlayerIndex, Board, PlayerBoard).

% obtem a linha RowIndex do tabuleiro do jogador PlayerIndex, guardando-a em Row

getPlayerRow(Game, Row, PlayerIndex, RowIndex) :-
  getPlayerBoard(Game, PlayerBoard, PlayerIndex),
  nth1(RowIndex, PlayerBoard, Row).

/* obtem quantindade de pedras do buraco com coordenadas
[RowIndex, ColumnIndex] guardando-as em Seeds*/

getSeeds(Game, RowIndex, ColumnIndex, PlayerIndex, Seeds) :-
  getPlayerRow(Game, Row, PlayerIndex, RowIndex),
  nth1(ColumnIndex, Row, Seeds).

/* obtem os indíces das ocorrencias de
Value em List, guardando-os em Indexes */

getListIndexes(Value, List, Indexes):-
  getListIndexes(Value, List, [], 1, FinalIndexes),
  Indexes = FinalIndexes.

getListIndexes(_Value, List, Indexes, CurrentIndex, FinalIndexes):-
  length(List,Length),
  Index is CurrentIndex - 1,
  Length == Index,
  FinalIndexes = Indexes.

getListIndexes(Value, List, Indexes, CurrentIndex, FinalIndexes):-
  nth1(CurrentIndex, List, CurrentElement),
  Value == CurrentElement,
  append(Indexes, [CurrentIndex], NewIndexes),
  NewIndex is CurrentIndex + 1,
  getListIndexes(Value, List, NewIndexes, NewIndex, FinalIndexes).

getListIndexes(Value, List, Indexes, CurrentIndex, FinalIndexes):-
  NewIndex is CurrentIndex + 1,
  getListIndexes(Value, List, Indexes, NewIndex, FinalIndexes).

% obtem o index do jogador

getPlayerIndex(player1, 1).
getPlayerIndex(player2, 2).

% obtem o próximo jogador

getNewPlayer(1, player2).
getNewPlayer(2, player1).

/* obtem o índice da linha do
tabuleiro dependendo do jogador
ex: Jogador 1, Linha 1 -> Indice 1
    Jogador 2, Linha 3 -> Indice 1 */

getRowIndex(1, 1, 1).
getRowIndex(2, 2, 1).
getRowIndex(3, 1, 2).
getRowIndex(4, 2, 2).

% obtem o indice da coluna

getColummnIndex(a, 1).
getColummnIndex(b, 2).
getColummnIndex(c, 3).
getColummnIndex(d, 4).
getColummnIndex(e, 5).
getColummnIndex(f, 6).
getColummnIndex(g, 7).

/* obtem a coordenada do próximo buraco a semear,
de modo a manter o sentido anti-horário */

getNewIndexes(1, 1, NewRowIndex, NewColumnIndex) :- NewRowIndex is 2, NewColumnIndex is 1.
getNewIndexes(1, ColumnIndex, NewRowIndex, NewColumnIndex) :- NewColumnIndex is (ColumnIndex - 1), NewRowIndex is 1.
getNewIndexes(2, 7, NewRowIndex, NewColumnIndex) :- NewRowIndex is 1, NewColumnIndex is 7.
getNewIndexes(2, ColumnIndex, NewRowIndex, NewColumnIndex) :- NewColumnIndex is (ColumnIndex + 1), NewRowIndex is 2.

% converte os indices para javascript

convertIndex(1, Column, player1, 0, ColumnIndex):- ColumnIndex is Column - 1.
convertIndex(2, Column, player1, 1, ColumnIndex):- ColumnIndex is Column - 1.
convertIndex(1, Column, player2, 2, ColumnIndex):- ColumnIndex is Column - 1.
convertIndex(2, Column, player2, 3, ColumnIndex):- ColumnIndex is Column - 1.

% converte os indices para prolog

convertIndex(0, Column, 1, ColumnIndex):- ColumnIndex is Column + 1.
convertIndex(1, Column, 2, ColumnIndex):- ColumnIndex is Column + 1.
convertIndex(2, Column, 1, ColumnIndex):- ColumnIndex is Column + 1.
convertIndex(3, Column, 2, ColumnIndex):- ColumnIndex is Column + 1.

/* atualiza para Value, as pedras no buraco com coordenadas
[RowIndex, ColumnIndex] no tabuleiro do jogador PlayerIndex */

setPit(Game, RowIndex, ColumnIndex, PlayerIndex, Value, NewGame) :-
  getPlayerRow(Game, Row, PlayerIndex, RowIndex),
  getPlayerBoard(Game, PlayerBoard, PlayerIndex),
  getBoard(Game, Board),
  updateInList(Row, ColumnIndex, Value, NewRow),
  updateInList(PlayerBoard, RowIndex, NewRow, NewPlayerBoard),
  updateInList(Board, PlayerIndex, NewPlayerBoard, NewBoard),
  updateInList(Game, 1, NewBoard, NewGame).

/* adiciona uma pedra no buraco com coordenadas [RowIndex, ColumnIndex]
no tabuleiro do jogador PlayerIndex */

addPit(Game, RowIndex, ColumnIndex, PlayerIndex, NewGame) :-
  getPlayerRow(Game, Row, PlayerIndex, RowIndex),
  nth1(ColumnIndex, Row, Seeds),
  NewSeeds is Seeds + 1,
  setPit(Game, RowIndex, ColumnIndex, PlayerIndex, NewSeeds, NewGame).

% adiciona NewSeeds às pedras capturadas pelo jogador PlayerIndex

updatePlayerSeeds(Game, NewSeeds, PlayerIndex, NewGame) :-
  getPlayerSeeds(Game, Seeds, PlayerIndex),
  FinalSeeds is (NewSeeds + Seeds),
  updateSeeds(PlayerIndex, Game, FinalSeeds, NewGame).

% atualiza as pedras capturas pelo jogador 1 para FinalSeeds

updateSeeds(1, Game, FinalSeeds, NewGame) :- updateInList(Game, 3, FinalSeeds, NewGame).

% atualiza as pedras capturas pelo jogador 2 para FinalSeeds

updateSeeds(2, Game, FinalSeeds, NewGame) :- updateInList(Game, 4, FinalSeeds, NewGame).

% atualiza o elemento com indíce Index em [H|T] para Value

updateInList([_H|T], 1, Value, [Value|T]).
updateInList([H|T], Index, Value, [H|NewT]) :-
  Index > 1,
  NewIndex is Index - 1,
  updateInList(T, NewIndex, Value, NewT).

% troca o jogador atual para o próximo jogador

switchPlayer(Game, NewGame) :-
  getCurrentPlayer(Game, Player),
  getNewPlayer(Player, NewPlayer),
  updateInList(Game, 2, NewPlayer, NewGame).

% seleciona uma elemento aleatório em List, guardando-o em Element

selectRandomElement(List, Element) :-
  length(List, Length),
  Upper is Length + 1,
  random(1, Upper, Index),
  nth1(Index, List, Element).

% mensagens de consola

message(askRow, 1):- write('> What row - 1 or 2? ').
message(askRow, 2):- write('> What row - 3 or 4? ').
message(askColumn):- write('> What column - a to g? ').
message(askDifficulty):- write('> Please choose the difficulty - Easy (1) or Hard (2): ').
message(askPlayerMode):- write('> Who should play first - human or computer? ').
message(askPlayAgain):- write('> Do you want to play again - yes or no? ').
message(askMenuOption):-write('> Select option: ').
message(invalidPit):- write('> Invalid pit.\n').
message(invalidRow):- write('> Invalid row\n').
message(invalidColumn):- write('> Invalid column\n').
message(invalidDifficulty):- write('> Invalid difficulty\n').
message(invalidPlayerMode):- write('> Invalid player mode\n').
message(invalidMenuOption):- write('> Invalid menu option\n').
message(invalidOption):- write('> Invalid option\n').
message(player1):- char_code(Char,127881), write('> Player 1 wins the game '), write(Char), nl.
message(player2):- char_code(Char,127881), write('> Player 2 wins the game '), write(Char), nl.
message(computerTurn):- write('Computer is thinking'), sleep(0.25), write('.'), sleep(0.25), write('.'), sleep(0.25), write('.'), sleep(0.25), nl.
