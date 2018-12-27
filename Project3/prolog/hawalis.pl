:- consult('bot.pl').
:- consult('display.pl').
:- consult('input.pl').
:- consult('logic.pl').
:- consult('menu.pl').
:- consult('utilities.pl').
:- use_module(library(lists)).
:- use_module(library(system)).
:- use_module(library(between)).
:- use_module(library(random)).

% predicado de chamada do programa e que chama a função do menu

play :-
  menu.

% inicia o jogo no modo Player vs Player

play(1) :-
  initialize(Game),
  play(Game, 1, human, _Difficulty).

% inicia o jogo no modo Player vs Computer, perguntando a dificuldade e quem começa

play(2) :-
  initialize(Game),
  askDifficulty(Difficulty),
  askPlayerMode(PlayerMode),
  play(Game, 2, PlayerMode, Difficulty).

% inicia o jogo no modo Player vs Computer, perguntando a dificuldade

play(3) :-
  initialize(Game),
  askDifficulty(Difficulty),
  play(Game, 3, computer, Difficulty).

/* predicado do loop do jogo que verifica que o
mesmo ainda não acabou, realizando uma
jogada quer do humano ou do computador */

play(Game, GameMode, PlayerMode, Difficulty) :-
  \+ game_over(Game, _Winner),
  display_game(Game),
  playerTurn(PlayerMode, Game, _PlayerIndex, NewGame, Difficulty),
  value(NewGame, GameMode, PlayerMode, Difficulty).

% predicado do loop do jogo para quando o jogo termina

play(Game, _GameMode, _PlayerMode, _Difficulty) :-
  game_over(Game, Winner),
  display_game(Game),
  message(Winner),
  askPlayAgain(Option),
  playAgain(Option).

% volta para o menu ou sai do programa

playAgain(yes) :- menu.
playAgain(no) :- exit.

% confirma se o jogo terminou e qual o vencedor

game_over([_Board, _CurrentPlayer, 28, _Player2Seeds], player1).
game_over([_Board, _CurrentPlayer, _Player1Seeds, 28], player2).

checkGameStatus([_Board, _CurrentPlayer, 28, _Player2Seeds], player1).
checkGameStatus([_Board, _CurrentPlayer, _Player1Seeds, 28], player2).
checkGameStatus([_Board, _CurrentPlayer, _Player1Seeds, _Player2Seeds], continue).

/* dependendo do modo de jogo e do jogador atual
chama o predicado de loop de jogo correto */

value(Game, 1, human, Difficulty) :- play(Game, 1, human, Difficulty).
value(Game, 2, human, Difficulty) :- play(Game, 2, computer, Difficulty).
value(Game, 2, computer, Difficulty) :- play(Game, 2, human, Difficulty).
value(Game, 3, computer, Difficulty) :- play(Game, 3, computer, Difficulty).

/* inicializa o jogo com um tabuleiro, o primeiro
jogador e as pedras recolhidas por cada um */

initialize([[[[2,2,2,2,2,2,2],[2,2,2,2,2,2,2]],[[2,2,2,2,2,2,2],[2,2,2,2,2,2,2]]], player1, 0, 0]).
