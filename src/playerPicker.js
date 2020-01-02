/* Copyright (c) 2020 Warren Usui, MIT License */
/*global sessionStorage, canvasObjects */
/*jslint browser:true */

/*****************************************************************************
 *
 * Pick player tokens at the start of a game.
 *
 *****************************************************************************
 */
var playerPicker = (function () {

    var saved_colors;
    var out_colors;
    var meeps;
    var selectedMeep;
    var least_players;
    var most_players;
    var doneButton = {
        "font": "12px Arial",
        "text": "Done",
        "text_loc": [6, 18],
        "corner": [580, 542],
        "dims": [40, 30]
    };

    /**
     * Initialization of player picker.
     *
     * @param {Array} colors -- rgb values used for meeples
     * @param {integer} minp -- minimum number of players
     * @param {integer} maxp -- maximum number of players
     */
    function init(colors, minp, maxp) {
        canvasObjects.addHeader("Select Players");
        canvasObjects.addButton(doneButton, false);
        saved_colors = colors;
        canvasObjects.addMeepleLine(saved_colors);
        out_colors = [];
        least_players = minp;
        most_players = maxp;
    }

    /**
     * If mouse click was on a meeple in playerPicked display, then
     * set selectedMeep to the rgb value of that meeple.
     *
     * @param {string} item -- rbg color of a meeple
     */
    function checkMeeple(item) {
        var xval = sessionStorage.getItem("X_value");
        var yval = sessionStorage.getItem("Y_value");
        meeps = canvasObjects.getMeepleMap();
        if ((xval < meeps[item][0][0]) || (xval > meeps[item][0][1])) {
            return;
        }
        if ((yval < meeps[item][1][0]) || (yval > meeps[item][1][1])) {
            return;
        }
        selectedMeep = item;
    }

    /**
     * If click was on a meeple, remove that meeple from the unpicked
     * display.  Exit if maximum number of picks allowed have been made.
     *
     * Done button is activated once the minimum number of picks
     * needed has been reached.  Exit if Done button is clicked.
     */
    function handleMouse() {
        selectedMeep = "";
        saved_colors.forEach(checkMeeple);
        if (selectedMeep) {
            saved_colors.splice(saved_colors.indexOf(selectedMeep), 1);
            out_colors.push(selectedMeep);
            if (out_colors.length === most_players) {
                return out_colors;
            }
            canvasObjects.addMeepleLine(saved_colors);
        }
        if (out_colors.length >= least_players) {
            canvasObjects.addButton(doneButton, true);
            if (canvasObjects.buttonHit(doneButton)) {
                return out_colors;
            }
        }
        return [];
    }

    return {
        init,
        handleMouse
    };
}());