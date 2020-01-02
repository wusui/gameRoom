# Heaven and Ale

This directory contains modules that are used to implement Heaven and Ale.

HeavenAndAle.html is the web page interface.

## sessionStorage data

* state -- Current state of the game
* start_player -- First player for next round.
* start_queue -- Reverse queue after start_player, used to place
  players prior to round 1.

## Valid states

* place_starting_pos -- Some players still need to place
  their player token in the start square on the rondel.
* game_over -- Set when game is over (scoring may not have been done yet).
* 
Copyright 2020, Warren Usui