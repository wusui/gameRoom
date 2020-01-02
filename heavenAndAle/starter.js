/* Copyright (c) 2020 Warren Usui, MIT License */
/*global rondel, sessionStorage, playerPicker, mathutils, boards, handlePage
  heavenAndAle, PLACE_STARTING_POS, RED, YELLOW, BLUE, BLACK */
/*jslint browser:true */

/*****************************************************************************
 *
 * Starter code.  Called on initial entry. Interfaces to general picker
 * routines.
 *
 *****************************************************************************
 */
var starter = (function () {
    /**
     * Starter code run on initial entry (not on restart).
     *
     * 2 to 4 players are allowed.  This is a wrapper for
     * a playerPicker call.
     *
     */
    function init() {
        playerPicker.init([RED, YELLOW, BLUE, BLACK], 2, 4);
    }

    /**
     * On mouse click events, pass control to playerPicker.
     *
     * If the playerPicker return value is valid (two or more entries),
     * then players have been selected.  In that case, reorder them
     * and continue initializing the rondel and the player cards.
     * Transfer control to the rondel board in the pick_starting_pos
     * state.
     */
    function handler() {
        var result;
        var players_to_act;
        var tmp;
        if (sessionStorage.getItem("event_type") === "Mouse") {
            players_to_act = playerPicker.handleMouse();
            if (players_to_act.length >= 2) {
                mathutils.shuffle(players_to_act);
                tmp = JSON.stringify(players_to_act)
                sessionStorage.setItem("players", tmp);
                handlePage.clear();
                sessionStorage.setItem("state", PLACE_STARTING_POS);
                tmp = JSON.stringify(players_to_act[0]);
                sessionStorage.setItem("start_player", tmp);
                players_to_act.reverse();
                players_to_act.pop(); 
                tmp = JSON.stringify(players_to_act);
                sessionStorage.setItem("start_queue", tmp);
                rondel.init();
                rondel.drawForNextRound();
                handlePage.init(rondel.switchTo, heavenAndAle.handler);
                boards.init();
            }
        }
    }

    return {
        init,
        handler
    };
}());