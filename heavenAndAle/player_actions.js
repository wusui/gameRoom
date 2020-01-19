/* Copyright (c) 2020 Warren Usui, MIT License */
/*global gameDialog, start_spots */
/*jslint browser:true */

/*****************************************************************************
 *
 * Handle actions once a square is moved to.
 *
 *****************************************************************************
 */
var player_actions_counter = 0;
var player_actions = (function () {
    var ns_res_or_mnk;
    var ns_plant_tile_here;
    var ns_tiles;
    var ns_plyr;
    var ns_rondel;
    function clearStart(item) {
        if (ns_rondel.layout[0][item] == ns_plyr) {
            ns_rondel.layout[0][item] = "";
        }
    }
    function exit_player_actions() {
        var sq_tokens = sessionStorage.getItem("left_over_tokens");
        var purchases = sessionStorage.getItem("purchases_made");
        var msg1;
        var plist;
        var oplist;
        var sqval;
        var counter;
        var board_chk;
        var loop_chk;
        var tmpi;
        var indx;
        sq_tokens = JSON.parse(sq_tokens);
        purchases = JSON.parse(purchases);
        sessionStorage.setItem("state", REGULAR_TURN);
        if (purchases.length === 0) {
            msg1 = "<p>No tiles were purchased.  The previous move was not";
            msg1 += " performed</p>";
            gameDialog.message(msg1, "Error", rondel.switchTo);
        } else {
            plist = JSON.parse(sessionStorage.getItem("players"));
            ns_plyr = plist[0];
            counter = 0;
            board_chk = JSON.parse(sessionStorage.getItem("boards"));
            loop_chk = true;
            sqval = JSON.parse(sessionStorage.getItem("square_loc"));
            ns_rondel = JSON.parse(sessionStorage.getItem("rondel"));
            ns_rondel.layout[sqval]["content"] = sq_tokens;
            board_chk[ns_plyr]["prev_sq"] = board_chk[ns_plyr]["cur_sq"];
            board_chk[ns_plyr]["cur_sq"] = sqval;
            tmpi = board_chk[ns_plyr].prev_sq;
            if (tmpi != 0) {
                indx = ns_rondel.layout[tmpi]["player"].indexOf(ns_plyr);
                if (indx > -1) {
                    ns_rondel.layout[tmpi]["player"].splice(indx, 1);
                }
            } else {
                start_spots.forEach(clearStart);
            }
            while(loop_chk) {
                ns_plyr = plist.shift();
                plist.push(ns_plyr);
                oplist = JSON.stringify(plist);
                if (board_chk[plist[0]].cur_sq > 0) {
                    break;
                }
                if (board_chk[plist[0]].prev_sq == -1) {
                    break;
                }
                if (counter > plist.length) {
                    /* TO DO -- round advancement  quite possibly may not 
                     * happen here, in which case, remove counter check */
                    break;
                }
                counter += 1;
            }
            sessionStorage.setItem("players", oplist);
            sessionStorage.setItem("boards", JSON.stringify(board_chk));
            ns_rondel.layout[sqval]["player"].push(ns_plyr);
            sessionStorage.setItem("rondel", JSON.stringify(ns_rondel));
        }
    }
    
    function get_purchased_pic(ttile, ttype) {
        var lmsg;
        var tempname;
        var dvalue;
        var cindx = Math.floor(ttile / 5);
        var value = JSON.stringify(ttile % 5 + 1);
        player_actions_counter += 1;
        lmsg = "<canvas id=\"";
        tempname += "xcanvas" + String(player_actions_counter);
        lmsg += tempname;
        lmsg += "\" class=\"msgcanvas\" width=\"100px\" height=\"100px\" ";
        lmsg += "display=\"block\" tabindex=\"0\" ";
        lmsg += "style=\"background: #ffffff\">";
        lmsg += "</canvas><script>";
        lmsg += "mcanvas = document.getElementById(\"";
        lmsg += tempname;
        lmsg += "\");";
        lmsg += "var mctx = mcanvas.getContext(\"2d\");";
        lmsg += "mctx.font = \"40px Arial\";";
        lmsg += "mctx.textAlign = \"center\";";
        lmsg += "mctx.lineWidth = 1;";
        lmsg += "mctx.strokeStyle = BLACK;";
        if (ttype === "Resource") {
            lmsg += "mctx.beginPath();";
            lmsg += "mctx.moveTo(50, 12);";
            lmsg += "mctx.lineTo(88, 34);";
            lmsg += "mctx.lineTo(88, 78);";
            lmsg += "mctx.lineTo(50, 100);";
            lmsg += "mctx.lineTo(12, 78);";
            lmsg += "mctx.lineTo(12, 34);";
            lmsg += "mctx.closePath();";
            lmsg += "mctx.stroke();";
            lmsg += "mctx.fillStyle = ";
            lmsg += "\""+RCOLOR[cindx]+"\";";
            lmsg += "mctx.fill();";
            lmsg += "mctx.fillStyle = BLACK;";
            lmsg += "mctx.fillText(";
            lmsg += "\"" + value + "\", 50, 70);";  
        } else {
            dvalue = monklabels[value - 1];
            lmsg += "mctx.arc(50, 52, 46, 0, 2 * Math.PI);";
            lmsg += "mctx.stroke();";
            lmsg += "mctx.fillStyle = \"#ffffb0\";";
            lmsg += "mctx.fill();";
            lmsg += "mctx.fillStyle = BLACK;";
            lmsg += "mctx.fillText(";
            lmsg += "\"" + dvalue + "\", 50, 70);";
        }
        lmsg += "</script>";
        return lmsg;
    }
    function cont_res_and_monks(choice) {
        var props = sessionStorage.getItem("properties_picked");
        var first_t;
        var no_tokes;
        var msg1;
        props = JSON.parse(props);
        first_t = props.shift();
        sessionStorage.setItem("tile_picked", first_t);
        sessionStorage.setItem("properties_picked", JSON.stringify(props));
        if (choice === "NO") {
            no_tokes = sessionStorage.getItem("left_over_tokens");
            no_tokes = JSON.parse(no_tokes);
            no_tokes.push(first_t);
            no_tokes= JSON.stringify(no_tokes);
            sessionStorage.setItem("left_over_tokens", no_tokes);
            if (props.length == 0) {
                exit_player_actions();
            } else {
                resources_and_monks();
            }
        } else {
            msg1 = get_purchased_pic(first_t, ns_res_or_mnk);
            /* TO DO add code here to set flags for handler  */
            msg1 += "<p>Click on the space in the map where ";
            msg1 += "you would like to place this tile.</p>";
            if (ns_res_or_mnk === "Monk") {
                first_t += 30;
            }
            first_t = JSON.stringify(first_t);
            sessionStorage.setItem("placing_item_now", first_t);
            gameDialog.message(msg1, "Place tile");
        }
    }

    function resources_and_monks() {
        var msg;
        var cost;
        var lPlayers;
        var pcheck;
        var board_info;
        var spot;
        var pic_of_tile;
        ns_res_or_mnk = sessionStorage.getItem("resource_or_monk");
        ns_tiles = sessionStorage.getItem("properties_picked");
        ns_tiles = JSON.parse(ns_tiles);
        pic_of_tile = get_purchased_pic(ns_tiles[0], ns_res_or_mnk);
        msg = String(pic_of_tile);
        if (ns_res_or_mnk === "Resource") {
            cost = ns_tiles[0] % 5 + 1;
        } else {
            spot = JSON.parse(sessionStorage.getItem("square_loc"));
            spot = Math.floor(spot / 7);
            cost = 4 - spot;
        }
        lPlayers = JSON.parse(sessionStorage.getItem("players"));
        pcheck = lPlayers[0];
        board_info = JSON.parse(sessionStorage.getItem("boards"));
        if (board_info[pcheck].money < 2 * cost) {
            msg += "<p>Do you want to place this token on the shady side?";
            msg += "  (You can't afford the sunny side)</p>";
        } else {
            msg += "<p>Do you want to place this token?</p>";
        }
        gameDialog.msg_yorn(msg, "Select Tile", cont_res_and_monks);
        return;
    }
    function within_range(item, index) {
        var xvalue = JSON.parse(sessionStorage.getItem("X_value"));
        var yvalue = JSON.parse(sessionStorage.getItem("Y_value"));
        var xnumb;
        var ynumb;
        ns_plant_tile_here = index;
        xnumb = xvalue - item[0];
        xnumb = xnumb * xnumb;
        ynumb = yvalue - item[1];
        ynumb = ynumb * ynumb;
        return xnumb + ynumb < 900;
    }
    function add_tile_to_map() {
        var xvalue = JSON.parse(sessionStorage.getItem("X_value"));
        var map_points;
        var sunny = false;
        var plist;
        var xboards;
        var pboard;
        var newtokes;
        var locprops;
        var cost;
        var sidefactor;
        var spot;
        if (xvalue < 760) {
            map_points = SUNNY_MAP_POINTS;
            sunny = true;
        } else {
            map_points = SHADY_MAP_POINTS;
        }
        if (map_points.some(within_range)) {
            plist = JSON.parse(sessionStorage.getItem("players"));
            xboards = JSON.parse(sessionStorage.getItem("boards"));
            pboard = xboards[plist[0]];
            if (ns_res_or_mnk === "Resource") {
                cost = ns_tiles[0] % 5 + 1;
            } else {
                ns_tiles[0] += 30;
                spot = JSON.parse(sessionStorage.getItem("square_loc"));
                spot = Math.floor(spot / 7);
                cost = 4 - spot;
            }
            if (sunny) {
                if (pboard.sunny[ns_plant_tile_here] != -1) {
                    return;
                }
                xboards[plist[0]].sunny[ns_plant_tile_here] = ns_tiles[0];
                sidefactor = 2;
            } else {
                if (pboard.shady[ns_plant_tile_here] != -1) {
                    return;
                }
                xboards[plist[0]].shady[ns_plant_tile_here] = ns_tiles[0];
                sidefactor = 1;
            }
            cost *= sidefactor;
            if (cost > xboards[plist[0]].money) {
                return;
            }
            xboards[plist[0]].money -= cost;            
            sessionStorage.setItem("boards", JSON.stringify(xboards));
            newtokes = sessionStorage.getItem("purchases_made");
            newtokes = JSON.parse(newtokes);
            newtokes.push(ns_tiles[0]);
            newtokes= JSON.stringify(newtokes);
            sessionStorage.setItem("purchases_made", newtokes);
            boards.switchTo(plist[0]);
            locprops = sessionStorage.getItem("properties_picked");
            locprops = JSON.parse(locprops);
            if (locprops.length == 0) {
                exit_player_actions();
            } else {
                resources_and_monks();
            }
        }
    }
    return {
        resources_and_monks,
        add_tile_to_map
    };
}());