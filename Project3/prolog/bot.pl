/* escolhe a próxima jogada do computador dentro
das jogadas válidas de modo aletório */
choose_move([FinalRowIndex, FinalColumnIndex], PlayerIndex, 1, Game) :-
  valid_moves(Game, PlayerIndex, ValidMoves),
  selectRandomElement(ValidMoves, [FinalRowIndex, FinalColumnIndex]).

/* escolhe a melhor jogada possível para o
computador dentro das jogadas válidas */
choose_move([FinalRowIndex, FinalColumnIndex], PlayerIndex, 2, Game) :-
  valid_moves(Game, PlayerIndex, ValidMoves),
  getSeedsPerMove(Game, PlayerIndex, ValidMoves, SeedsPerMove),
  max_member(Max, SeedsPerMove),
  getListIndexes(Max, SeedsPerMove, Indexes),
  selectRandomElement(Indexes, RandomMoveIndex),
  nth1(RandomMoveIndex, ValidMoves, [FinalRowIndex, FinalColumnIndex]).
