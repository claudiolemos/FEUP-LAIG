/* pede ao utilizador a sua jogada,
verificando se a mesma é válida */

selectPit([FinalRowIndex, FinalColumnIndex], PlayerIndex, Game) :-
  valid_moves(Game, PlayerIndex, ValidMoves),
  askRow(Row, PlayerIndex),
  getRowIndex(Row, RowIndex, PlayerIndex),
  askColumn(Column),
  getColummnIndex(Column, ColumnIndex),
  checkValidMove(RowIndex, ColumnIndex, FinalRowIndex, FinalColumnIndex, PlayerIndex, Game, ValidMoves).

% pergunta a linha ao jogador, verificando se o input é válido

askRow(FinalRow, PlayerIndex) :-
  message(askRow, PlayerIndex),
  read(Row), skip_line,
  checkInput(row, Row, FinalRow, PlayerIndex).

% pergunta a coluna ao jogador, verificando se o input é válido

askColumn(FinalColumn) :-
  message(askColumn),
  read(Column), skip_line,
  checkInput(column, Column, FinalColumn).

% verifica se a jogada escolhida pelo jogador é válida...

checkValidMove(RowIndex, ColumnIndex, FinalRowIndex, FinalColumnIndex, _PlayerIndex, _Game, ValidMoves) :-
  member([RowIndex, ColumnIndex], ValidMoves),
  !,
  FinalRowIndex = RowIndex,
  FinalColumnIndex = ColumnIndex.

% ...sendo que quando não é, volta a chamar o predicado de seleção

checkValidMove(_RowIndex, _ColumnIndex, FinalRowIndex, FinalColumnIndex, PlayerIndex, Game, _ValidMoves) :-
  message(invalidPit),
  selectPit([FinalRowIndex, FinalColumnIndex], PlayerIndex, Game).

% verifica se a jogada escolhida pelo jogador é válida...

isValidMove(RowIndex,ColumnIndex,ValidMoves,true):-
  member([RowIndex, ColumnIndex], ValidMoves),!.

% ...sendo que quando não é, volta a chamar o predicado de seleção

isValidMove(_,_,_,false).

% pergunta a dificuldade ao jogador, verificando se o input é válido

askDifficulty(FinalDificulty) :-
  message(askDifficulty),
  read(Difficulty), skip_line,
  checkInput(difficulty, Difficulty, FinalDificulty).

% pergunta quem começa o jogo primeiro, verificando se o input é válido

askPlayerMode(FinalPlayerMode) :-
  message(askPlayerMode),
  read(PlayerMode), skip_line,
  checkInput(playerMode, PlayerMode, FinalPlayerMode).

% pergunta a opção do menu, verificando se o input é válido

askMenuOption(FinalMenuOption) :-
  message(askMenuOption),
  read(MenuOption), skip_line,
  checkInput(menuOption, MenuOption, FinalMenuOption).

% pergunta se quer jogar de novo, verificando se o input é válido

askPlayAgain(FinalOption) :-
  message(askPlayAgain),
  read(Option), skip_line,
  checkInput(playAgain, Option, FinalOption).

% verifica se o input da linha é válido...

checkInput(row, Row, Row, PlayerIndex):-
  ((Row == 1, PlayerIndex == 1); (Row == 2, PlayerIndex == 1); (Row == 3, PlayerIndex == 2); (Row == 4, PlayerIndex == 2)).

% ...sendo que quando não é, volta a chamar o predicado de seleção

checkInput(row, _Row, FinalRow, PlayerIndex):-
  message(invalidRow),
  askRow(FinalRow, PlayerIndex).

% verifica se o input da coluna é válido...
checkInput(column, Column, Column):-
  (Column == a; Column == b; Column == c; Column == d; Column == e; Column == f; Column == g).

% ...sendo que quando não é, volta a chamar o predicado de seleção

checkInput(column, _Column, FinalColumn):-
  message(invalidColumn),
  askColumn(FinalColumn).

% verifica se o input da opção do menu é válido...

checkInput(menuOption, MenuOption, MenuOption):-
  (MenuOption == 1; MenuOption == 2; MenuOption == 3; MenuOption == 4).

% ...sendo que quando não é, volta a chamar o predicado de seleção

checkInput(menuOption, _MenuOption, FinalMenuOption):-
  message(invalidMenuOption),
  askMenuOption(FinalMenuOption).

% verifica se o input da dificuldade é válido...

checkInput(difficulty, Difficulty, Difficulty):-
  (Difficulty == 1; Difficulty == 2).

% ...sendo que quando não é, volta a chamar o predicado de seleção

checkInput(difficulty, _Difficulty, FinalDificulty):-
  message(invalidDifficulty),
  askDifficulty(FinalDificulty).

% verifica se o input do primeiro jogador é válido...

checkInput(playerMode, PlayerMode, PlayerMode):-
  (PlayerMode == human; PlayerMode == computer).

% ...sendo que quando não é, volta a chamar o predicado de seleção

checkInput(playerMode, _PlayerMode, FinalPlayerMode):-
  message(invalidPlayerMode),
  askPlayerMode(FinalPlayerMode).

% verifica se o input da opção de voltar a jogar é válido...

checkInput(playAgain, Option, Option):-
  (Option == yes; Option == no).

% ...sendo que quando não é, volta a chamar o predicado de seleção

checkInput(playAgain, _Option, FinalOption):-
  message(invalidOption),
  askPlayAgain(FinalOption).
