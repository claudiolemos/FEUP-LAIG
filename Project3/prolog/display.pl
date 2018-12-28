% imprime o tabuleiro de jogo

display_game(Game) :-
  clearConsole,
  getPlayerSeeds(Game, Player1Seeds, 1),
  getPlayerSeeds(Game, Player2Seeds, 2),
  getPlayerRow(Game, Row1, 1, 1),
  getPlayerRow(Game, Row2, 1, 2),
  getPlayerRow(Game, Row3, 2, 1),
  getPlayerRow(Game, Row4, 2, 2),
  printPlayerInfo(Game),
  printPlayerInfo(1,Player1Seeds),
  printSeparator(edge),
  displayRow(Row1), write(' | 1'), nl,
  displayRow(Row2), write(' | 2'), nl,
  printSeparator(middle),
  displayRow(Row3), write(' | 3'), nl,
  displayRow(Row4), write(' | 4'), nl,
  printSeparator(edge),
  printPlayerInfo(2,Player2Seeds).

% imprime recursivamente uma linha do tabuleiro

displayRow([H|[]]) :-  write('| '), write(H).
displayRow([H|T]) :- write('| '), write(H ), write(' '), displayRow(T).

/* imprime a informação de um jogador, incluíndo
as pedras que recolheu do seu oponente */

printPlayerInfo(Player, Seeds) :-
  write('      PLAYER '),
  write(Player),
  write(' ('),
  write(Seeds),
  write(' seeds)'), nl.

% imprime que jogador se encontra jogar

printPlayerInfo(Game) :-
  \+ game_over(Game, _Winner),
  getCurrentPlayer(Game, Player),
  write('x---------------------------x'), nl,
  write('|    PLAYER '),
  write(Player),
  write(' is playing    |'),nl,
  write('x---------------------------x'), nl,nl,nl,nl,nl,nl.

printPlayerInfo(Game) :- game_over(Game, _Winner).

/* imprime o separador do meio da tabuleiro,
identificando as colunas do mesmo */

printSeparator(middle) :-
  write('|---------------------------|'), nl,
  write('| a | b | c | d | e | f | g |'), nl,
  write('|---------------------------|'), nl.

% imprime o separador do início e fim do tabuleiro

printSeparator(edge) :-  write('x---------------------------x'), nl.
