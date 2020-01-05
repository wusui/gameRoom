/* Copyright (c) 2020 Warren Usui, MIT License */
/*global handlePage, starter, rondel, universe, sessionStorage,  gameDialog,
  boards, barrel, BROWN, WHITE, GREEN, BLUE, YELLOW, PG_BUTTON_START,
  canvasObjects, PRIV_INFO, RONDELBUTTON, RONDEL_BUTTON_START,
  BREWMASTER_INFO, alert */
/*jslint browser:true */

/*****************************************************************************
 *
 * Starting entry point and general HeavenAndAle routines
 *
 *****************************************************************************
 */
const PLACE_STARTING_POS = "place_starting_pos";
const GAME_OVER_STATE = "game_over";
const PLAYER_GETS_2RES = "player_gets_2_resources";
const REGULAR_TURN = "regular_turn";
const BARREL_RATIO = 1.25;
const BARREL_ADJ = 10;
const NUM_OF_BARRELS = 12;
const RCOLOR = [BROWN, WHITE, GREEN, BLUE, YELLOW];
const RNAME = ["Wood", "Yeast", "Hops", "Water", "Barley"];

var heavenAndAle = (function () {
    var helpText;
    var player_page_buttons;
    var xoffset;
    var switch2resMsg;

    /**
     * Convert rgb value to text name (used for player tokens)
     *
     * @param {string} rgbCode - hexidecimal value of color
     * @returns {string} Color name (RED, YELLOW, BLUE, BLACK)
     *
     */
    function rgbToName(rgbCode) {
        var colorTable = {
            "#ff5050": "RED",
            "#ffff00": "YELLOW",
            "#1090ff": "BLUE",
            "#000000": "BLACK"
        };
        return colorTable[rgbCode];
    }

    /**
     * Get the text of a color value and display it in that
     * color.  Used for the help message pop-up.
     *
     * @param {string} rgb value
     */
    function addPlyrColor(item) {
        helpText += "<span style=\"color:" + item;
        helpText += "\">" + rgbToName(item);
        helpText += "</span> ";
    }

    /**
     * Return help message on a normal turn.
     */
    function regular_msg() {
        var sess_inf = sessionStorage.getItem("players");
        var fPlayers = JSON.parse(sess_inf);
        helpText = "<p class=helpmsg>It is <b>";
        addPlyrColor(fPlayers[0]);
        helpText = helpText.trim();
        helpText += "'s</b> move.</p>";
        helpText += "<p>Move <b>";
        addPlyrColor(fPlayers[0]);
        helpText = helpText.trim();
        helpText += "'s</b> token ahead on the track.</p>";
        return helpText;
    }
    /**
     * Generate message indicating who still needs to be placed.
     */
    function placementHelpMsg() {
        var sess_inf = sessionStorage.getItem("players");
        var playersInOrder = JSON.parse(sess_inf);
        var sess_q = sessionStorage.getItem("start_queue");
        var nextQueue = JSON.parse(sess_q);
        helpText = "<p class=helpmsg>Turn order will be: <b>";
        playersInOrder.forEach(addPlyrColor);
        helpText += "</b></p><p class=helpmsg><b>";
        addPlyrColor(nextQueue[0]);
        helpText += "</b> needs to place their marker on ";
        helpText += "an open spot in the start square.</p>";
        return helpText;
    }

    /**
     * Return game over message.
     */
    function game_over_msg() {
        return "Game Over.  Scoring may not be done yet";
    }

    /**
     * Handle the increase in the resource tracker if that starting position
     * is picked.
     */
    function player_gets_2r_msg() {
        var plyr = sessionStorage.getItem("add2rec2");
        var tp;
        var np;
        helpText = "<p class=helpmsg><b>";
        addPlyrColor(plyr);
        helpText += "</b> still needs to claim 2 resource track moves.</p>";
        tp = sessionStorage.getItem("page");
        np = sessionStorage.getItem("add2rec2");
        if (tp !== np) {
            helpText += "<p>Go to ";
            addPlyrColor(plyr);
            helpText += "'s page and c";
        } else {
            helpText += "<p>C";
        }
        helpText += "lick on the resource that you wish";
        helpText += " to advance</p>";
        return helpText;
    }

    /**
     * Given state, display appropriate help message.
     */
    function help_message() {
        var help_table = {
            "place_starting_pos": placementHelpMsg,
            "game_over": game_over_msg,
            "player_gets_2_resources": player_gets_2r_msg,
            "regular_turn": regular_msg
        };
        var state = sessionStorage.getItem("state");
        gameDialog.message(help_table[state](), "Help");
    }

    /**
     * Set a player button, save button in player_page_buttons array.
     */
    function set_player_buttons(item, index) {
        var nextButton = {
            "font": "12px Arial",
            "text": item,
            "text_loc": [0, 0],
            "corner": [xoffset + index * 50, 567],
            "dims": [40, 30]
        };
        canvasObjects.addButton(nextButton, true);
        player_page_buttons.push(nextButton);
    }

    /**
     * Add a button common to all pages.
     *
     * @param {integer} x-coordinate of where player page buttons start.
     */
    function common_button_add(x_offset) {
        var players = JSON.parse(sessionStorage.getItem("players"));
        canvasObjects.addButton(canvasObjects.helpButton, true);
        canvasObjects.addButton(barrel.barrelButton, true);
        player_page_buttons = [];
        xoffset = x_offset;
        players.forEach(set_player_buttons);
    }

    /**
     * Scan for player button being hit.
     */
    function hit_player_buttons(item, index) {
        if (canvasObjects.buttonHit(player_page_buttons[index])) {
            boards.switchTo(item);
        }
    }

    /**
     * Check if button common to all pages is hit
     */
    function common_button_hit(x_offset) {
        var players = JSON.parse(sessionStorage.getItem("players"));
        if (canvasObjects.buttonHit(canvasObjects.helpButton)) {
            help_message();
        }
        if (canvasObjects.buttonHit(barrel.barrelButton)) {
            gameDialog.message(barrel.barrelInfoMsg(), "Barrel Information");
        }
        players.forEach(hit_player_buttons);
        if (x_offset === PG_BUTTON_START) {
            if (canvasObjects.buttonHit(RONDELBUTTON)) {
                rondel.switchTo();
            }
            if (canvasObjects.buttonHit(PRIV_INFO)) {
                boards.priv_info();
            }
            if (canvasObjects.buttonHit(BREWMASTER_INFO)) {
                boards.brewmaster_info();
            }
        }
    }

    /**
     * Check if the resource square is clicked on.  If we are increasing
     * resource (the player is chosing this option from the starting
     * square) then increase that resource too.
     */
    function chk_resource_hit() {
        var xval = sessionStorage.getItem("X_value");
        var yval = sessionStorage.getItem("Y_value");
        var curp = sessionStorage.getItem("page");
        var p2bon = sessionStorage.getItem("add2rec2");
        var resLoc;
        var bdata;
        if (yval < 70 || yval > 130 || xval < 530 || xval > 1010) {
            return;
        }
        if ((xval - 530) % 100 > 80) {
            return;
        }
        if (curp === p2bon) {
            resLoc = Math.floor((xval - 530) / 100);
            bdata = JSON.parse(sessionStorage.getItem("boards"));
            bdata[curp].resources[RCOLOR[resLoc]] += 2;
            sessionStorage.setItem("boards", JSON.stringify(bdata));
            boards.switchTo(curp);
            sessionStorage.setItem("state", REGULAR_TURN);
        }
    }

    /**
     * Handle user input on the canvas.
     */
    function handler() {
        var rec2plyr;
        var page_disp;
        if (sessionStorage.getItem("page") === "rondel") {
            common_button_hit(RONDEL_BUTTON_START);
        } else {
            common_button_hit(PG_BUTTON_START);
        }
        if (sessionStorage.getItem("state") === PLACE_STARTING_POS) {
            rondel.pick_start_pos();
            switch2resMsg = true;
        }
        if (sessionStorage.getItem("state") === PLAYER_GETS_2RES) {
            if (switch2resMsg) {
                switch2resMsg = false;
                rec2plyr = sessionStorage.getItem("add2rec2");
                boards.switchTo(rec2plyr);
                help_message();
            }
            chk_resource_hit();
        }
        if (sessionStorage.getItem("state") === REGULAR_TURN) {
            page_disp = sessionStorage.getItem("page");
            if (page_disp === "rondel") {
                alert("rondel page is visible");
            }
        }
    }

    /**
     * Entry point for the javascript loaded by HeavenAndAle.html.
     *
     * Call the starter code if this is a new session.
     * Otherwise, go to the rondel page.
     *
     */
    function onloadFunc() {
        var stateType = sessionStorage.getItem("state");
        if (stateType === null) {
            handlePage.init(starter.init, starter.handler);
        } else {
            handlePage.init(rondel.switchTo, handler);
        }
    }

    return {
        rgbToName,
        common_button_add,
        common_button_hit,
        handler,
        onloadFunc
    };
}());