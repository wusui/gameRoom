/* Copyright (c) 2020 Warren Usui, MIT License */
/*global gameDialog, player_actions, boards, PURCHASE_PLOT, alert */
/*jslint browser:true */

/*****************************************************************************
 *
 * Handle moves
 *
 *****************************************************************************
 */
var move = (function () {
    var llayout;
    var pcheck;
    var loc_found;
    var glob_index;
    var g_hist;
    var sq_numb;
    var min_cost;
    var monk_hist;
    var info_picks;
    var ns_count;
    var ns_sq0_indx;
    var ns_start_next_round;
    var lPlayers;
    var ns_rinfo;
    /**
     * Called from forEach in scan_boxes.  Sets loc_found if player
     * is on this numbered square.
     */
    function scan_plist(item) {
        if (pcheck === item) {
            loc_found = glob_index;
            return false;
        }
        return true;
    }

    /**
     * Called from forEach in find_current_plyr.  Used to iterate through
     * squares.  Halts when the player is found.
     */
    function scan_boxes(item, index) {
        if (item.type === "Start") {
            return true;
        }
        glob_index = index;
        item.player.every(scan_plist);
        if (loc_found === index) {
            return false;
        }
        return true;
    }

    /**
     * If this value is a monk, set monk histogram.   Otherwise set a
     * resource tile histogram.  Based on the way this function is called,
     * there will be a sunny side histogram and a shady side histogram.
     */
    function put_in_hist(item) {
        if (item >= 30) {
            monk_hist[item - 30] += 1;
            return;
        }
        if (item < 0) {
            g_hist[5] += 1;
        } else {
            g_hist[Math.floor(item / 5)] += 1;
        }
    }

    /**
     * For each side (shady or sunny), set a histogram of resource tiles.
     * The last value in the historgram counts -1 entries (empty spots).
     */
    function gen_hist(map_values) {
        g_hist = [0, 0, 0, 0, 0, 0];
        map_values.forEach(put_in_hist);
        return JSON.parse(JSON.stringify(g_hist));
    }

    /**
     * Return the number of the rondel square that was clicked on.
     */
    function get_sq_numb(xval, yval) {
        var rel_bx = xval % 100;
        var rel_by = yval % 100;
        var xbound = Math.floor(xval / 100);
        var ybound = Math.floor(yval / 100);
        if (xval > 1100 || yval > 500) {
            return -1;
        }
        if (rel_bx < 5 || rel_bx > 95 || rel_by < 5 || rel_by > 95) {
            return -1;
        }
        if (yval < 100 && xval < 1100) {
            return xbound;
        }
        if (yval > 400 && yval < 500) {
            return 24 - xbound;
        }
        if (xval > 1000) {
            return 10 + ybound;
        }
        if (xval < 100) {
            return 28 - ybound;
        }
        return -1;
    }

    /**
     * Find current player and other things.
     *
     * When completed, the following variables within the move namespace
     * will be set:
     *
     * pcheck -- The player whose turn this is (in #xxxxxx color form).
     * llayout -- The layout of the rondel.
     * loc_found -- The square player pcheck is currently on.
     */
    function find_current_plyr() {
        var sess_inf = sessionStorage.getItem("players");
        ns_rinfo = JSON.parse(sessionStorage.getItem("rondel"));
        lPlayers = JSON.parse(sess_inf);
        loc_found = 0;
        llayout = ns_rinfo.layout;
        pcheck = lPlayers[0];
        llayout.every(scan_boxes);
        return;
    }

    /**
     * If a resource or monk tile is picked, calculate the minimum cost
     * for this item.
     */
    function get_min_cost(item, index) {
        var value;
        var ltemp;
        if (item >= 30) {
            ltemp = Math.floor(index / 7);
            min_cost = 4 - ltemp;
            return;
        }
        value = (item % 5) + 1;
        if (value < min_cost) {
            min_cost = value;
        }
        return;
    }

    function count_start(item) {
        if (llayout[0][item] !== "") {
            ns_count += 1;   
        }
    }
    function cont_sq0_plac() {
        var temp_sq;
        var tepm_sqi;
        var indx;
        var locpl;
        var bdata = JSON.parse(sessionStorage.getItem("boards"));
        llayout[0][start_spots[ns_sq0_indx]] = pcheck;
        temp_sqi = bdata[pcheck].cur_sq;
        temp_sq = llayout[temp_sqi];
        indx = temp_sq["player"].indexOf(pcheck);
        if (indx > -1) {
            temp_sq["player"].splice(indx, 1);
        }
        bdata[pcheck].prev_sq = temp_sqi;
        bdata[pcheck].cur_sq = 0;
        if (ns_sq0_indx === 3) {
            bdata[pcheck].money += 2;
        }
        if (ns_sq0_indx === 2) {
            bdata[pcheck].brewmaster += 1;
        }
        sessionStorage.setItem("boards", JSON.stringify(bdata));
        locpl = lPlayers.shift();
        lPlayers.push(locpl);
        sessionStorage.setItem("players", JSON.stringify(lPlayers));
        sessionStorage.setItem("rondel", JSON.stringify(ns_rinfo));
        alert(JSON.stringify(ns_rinfo));
        rondel.switchTo();
        ns_count = 0;
        start_spots.forEach(count_start);
        if (ns_count === lPlayers.length) {
            alert("start next round");
        }
    }
    /**
     * Handle moves.  We know that it's someone's turn, we are displaying
     * the rondel board, and we clicked somewhere on the page.
     */
    function action() {
        var xval = sessionStorage.getItem("X_value") - 8;
        var yval = sessionStorage.getItem("Y_value") - 8;
        var err_msg;
        var shady_hist;
        var sunny_hist;
        var board_info;
        var mfactor;
        var sq_type;
        var msg1 = "<p>The last player in must take the first move ";
        msg1 += "if it is still available</p>";
        sq_numb = get_sq_numb(xval, yval);
        if (sq_numb === -1) {
            return;
        }
        find_current_plyr();
        ns_start_next_round = false;
        if (sq_numb === 0 && loc_found > 0) {
            ns_count = 0;
            start_spots.forEach(count_start);
            ns_sq0_indx = 2 * Math.floor(yval / 50) + Math.floor(xval / 50);
            if (lPlayers.length === ns_count + 1) {
                ns_start_next_round = true;
                if (ns_sq0_indx !== 0) {
                    if (llayout[0]["first"].length == 0) {
                        ns_sq0_indx = 0;
                        gameDialog.message(msg1, "Note", cont_sq0_plac);
                    }
                }
            }
            cont_sq0_plac();
            return;
        }
        if (loc_found > 0) {
            if (sq_numb <= loc_found) {
                err_msg = "<p>You must move forward along the track</p>";
                gameDialog.message(err_msg, "Error");
                return;
            }
        }
        if (sq_numb !==  0) {
            if (!llayout[sq_numb].content) {
                if (llayout[sq_numb].type.startsWith("Score")) {
                    err_msg = "<p>Square needs a scoring disk</p>";
                } else {
                    err_msg = "<p>";
                    err_msg += llayout[sq_numb].type;
                    err_msg += " square needs a tile to purchase</p>";
                }
                gameDialog.message(err_msg, "Error");
                return;
            }
        }
        board_info = JSON.parse(sessionStorage.getItem("boards"));
        monk_hist = [0, 0, 0, 0];
        shady_hist = gen_hist(board_info[pcheck].shady);
        sunny_hist = gen_hist(board_info[pcheck].sunny);
        sq_type = llayout[sq_numb].type;
        if (sq_type === "Resource" || sq_type === "Monk") {
            if (llayout[sq_numb].content.length === 0) {
                err_msg = "<p>You cannot move there. ";
                err_msg += "There are no tiles to purchase.</p>";
                gameDialog.message(err_msg, "Error");
                return;
            }
            if (shady_hist[5] > 0) {
                mfactor = 1;
            } else {
                if (sunny_hist[5] > 0) {
                    mfactor = 2;
                } else {
                    err_msg = "<p>Board filled.  ";
                    err_msg = "Cannot buy anymore tiles.</p>";
                    gameDialog.message(err_msg, "Error");
                    return;
                }
            }
            min_cost = 5;
            llayout[sq_numb].content.forEach(get_min_cost);
            min_cost *= mfactor;
            if (min_cost > board_info[pcheck].money) {
                err_msg = "<p>You cannot afford any tiles there.</p>";
                gameDialog.message(err_msg, "Error");
                return;
            }
            info_picks = JSON.stringify(llayout[sq_numb].content);
            sessionStorage.setItem("properties_picked", info_picks);
            sessionStorage.setItem("state", PURCHASE_PLOT);
            sessionStorage.setItem("resource_or_monk", sq_type);
            sessionStorage.setItem("purchases_made", "[]");
            sessionStorage.setItem("left_over_tokens", "[]");
            sessionStorage.setItem("square_loc", JSON.stringify(sq_numb));
            sessionStorage.setItem("tile_picked", JSON.stringify(-1));
            sessionStorage.setItem("placing_item_now", "NO");
            boards.switchTo(pcheck);
            player_actions.resources_and_monks();
        }
    }

    return {
        action
    };
}());