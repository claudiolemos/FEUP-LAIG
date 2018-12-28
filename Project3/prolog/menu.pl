% predicado de chamada do menu que o imprime e pergunta uma opção ao jogador

menu :-
  printMenu,
  askMenuOption(FinalMenuOption),
  menuOption(FinalMenuOption).

/* seleçao do modo de jogo consoante a escolha do utilizador
menuOption(1) = modo de jogo Player vs Player
menuOption(2) = modo de jogo Player vs Computer
menuOption(3) = modo de jogo Computer vs Computer
menuOption(4) = sair do programa */

menuOption(1) :- play(1).
menuOption(2) :- play(2).
menuOption(3) :- play(3).
menuOption(4) :- exit.

% predicado de término do programa

exit.

% imprime o menu inicial

printMenu :-
  clearConsole,
  write(' 888    888        d8888 888       888 d8888        888      8888888 .d8888b.  '),nl,
  sleep(0.05),
  write(' 888    888       d88888 888   o   888 d88888       888        888  d88P  Y88b '),nl,
  sleep(0.05),
  write(' 888    888      d88P888 888  d8b  888 d88.888      888        888  Y88b.      '),nl,
  sleep(0.05),
  write(' 8888888888     d88P 888 888 d888b 888 d88  888     888        888   "Y888b.   '),nl,
  sleep(0.05),
  write(' 888    888    d88P  888 888d88888b888 d88   888    888        888      "Y88b. '),nl,
  sleep(0.05),
  write(' 888    888   d88P   888 88888P Y88888 d88    888   888        888        "888 '),nl,
  sleep(0.05),
  write(' 888    888  d8888888888 8888P   Y8888 d8888888888  888        888  Y88b  d88P '),nl,
  sleep(0.05),
  write(' 888    888 d88P     888 888P     Y888 d88P     888 88888888 8888888 "Y8888P"  '), nl, nl,
  sleep(0.05),
  write('                           1 - Player vs Player                                '),nl,
  sleep(0.05),
  write('                           2 - Player vs Computer                              '),nl,
  sleep(0.05),
  write('                           3 - Computer vs Computer                            '),nl,
  sleep(0.05),
  write('                           4 - Exit                                            '),nl,
  sleep(0.05), nl, sleep(0.05), nl, sleep(0.05), nl, sleep(0.05), nl, sleep(0.05), nl.
