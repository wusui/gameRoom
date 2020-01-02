/* Copyright (c) 2020 Warren Usui, MIT License */
/*global canvasObjects, heavenAndAle, universe, gameDialog,
  mathutils, shapeDrawer, handlePage, barrel, constants, GAME_OVER_STATE,
  WHITE, BROWN, PURPLE, BLACK, PALE_Y, RNAME, RCOLOR, NUM_OF_BARRELS,
  PLAYER_GETS_2RES, REGULAR_TURN */
/*jslint browser:true */

/*****************************************************************************
 *
 * Rondel: Handle the general game board that player tokens move around.
 *
 *****************************************************************************
 */
const RONDEL_BUTTON_START = 130;
var rondel = (function () {
    const ALL_SQ_SZ = 100;
    const COM_SQ_SZ = 90;
    const SCORE_DISK_RADIUS = 40;
    const SCORE_DISK_LEFT = 25;
    const SCORE_DISK_Y_1_1 = 25;
    const SCORE_DISK_Y_1_2 = 5;
    const SCORE_DISK_Y_2_2 = 45;
    const LINE_HEIGHT = 14;
    const MONK_INDENT = 23;
    const RESOURCE_INDENT = 20;
    const BARRELS_PER_ROW = 4;
    const RONDEL_BARREL_OFFSET = 6;
    const NUM_MONK_TYPES = 4;
    const NUM_RESOURCE_TYPES = 5;
    const RESOURCE_RANKS = 5;
    const UNIQ_RESC_NUMB = NUM_RESOURCE_TYPES * RESOURCE_RANKS;
    const LIST_FONT = "12px Arial";
    const RESC_TOT = 50;
    const MONK_TOT = 12;
    const HI_BAR_CNT = 4;
    const DIM_BARREL_TOP = 60;
    const BARREL_HT = 80;
    const X_ROUND_ORIGIN = 105;
    const Y_ROUND_ORIGIN = 205;
    const EDGE_WIDTH = 5;
    const RONDEL_RIGHT_IND = 10;
    const RONDEL_BOT_IND = 4;
    const TOTAL_NUM_OF_SQUARES = 28;
    const HEX_NORM_OFFSET = 45;
    const HEX_TOP_LINE = 4;
    const BIG_HEX_SZ = 70;
    const HEX_SZ = 40;
    const HEX_START = 25;
    var drondel;
    var thisRoundIndex;
    var xgval;
    var ygval;
    var found2Res;
    var layout = [
        {type: "Start", "first": "", "xtraMny": "", "mvBrew": "", "mvRes": ""},
        {type: "Resource", player: "", content: []},
        {type: "Resource", player: "", content: []},
        {type: "Monk", player: "", content: []},
        {type: "Score A", player: "", content: []},
        {type: "Resource", player: "", content: []},
        {type: "Resource", player: "", content: []},
        {type: "Score B", player: "", content: []},
        {type: "Resource", player: "", content: []},
        {type: "Resource", player: "", content: []},
        {type: "Monk", player: "", content: []},
        {type: "Resource", player: "", content: []},
        {type: "Score C", player: "", content: []},
        {type: "Resource", player: "", content: []},
        {type: "Barrel", player: "", content: []},
        {type: "Resource", player: "", content: []},
        {type: "Score ABC", player: "", content: []},
        {type: "Resource", player: "", content: []},
        {type: "Monk", player: "", content: []},
        {type: "Resource", player: "", content: []},
        {type: "Score ABC", player: "", content: []},
        {type: "Resource", player: "", content: []},
        {type: "Resource", player: "", content: []},
        {type: "Resource", player: "", content: []},
        {type: "Score ABC", player: "", content: []},
        {type: "Monk", player: "", content: []},
        {type: "Barrel", player: "", content: []},
        {type: "Resource", player: "", content: []}
    ];

    /**
     * Draw the starting square
     */
    function draw_Start() {
        shapeDrawer.drawSquare(0, 0, ALL_SQ_SZ, false);
    }

    /**
     * Draw a barrel room
     *
     * @param {integer} xval -- left-most x-coord
     * @param {integer} yval -- top-most y-coord
     */
    function barrel_room(xval, yval) {
        shapeDrawer.drawSquare(xval, yval, COM_SQ_SZ, BROWN);
    }

    /**
     * Add a scoring disk square
     */
    function scoring_disk_sq(xval, yval, sdisks) {
        var r = SCORE_DISK_RADIUS;
        var circ_left = xval + SCORE_DISK_LEFT;
        var circ_y_1_of_1 = yval + SCORE_DISK_Y_1_1;
        var circ_y_1_of_2 = yval + SCORE_DISK_Y_1_2;
        var circ_y_2_of_2 = yval + SCORE_DISK_Y_2_2;
        shapeDrawer.drawSquare(xval, yval, COM_SQ_SZ, false);
        if (sdisks.length === 0) {
            return;
        }
        if (sdisks.length === 1) {
            shapeDrawer.drawCircle(circ_left, circ_y_1_of_1, r, PURPLE, "");
        } else {
            shapeDrawer.drawCircle(circ_left, circ_y_1_of_2, r, PURPLE, "");
            shapeDrawer.drawCircle(circ_left, circ_y_2_of_2, r, PURPLE, "");
        }
    }

    /**
     * Foreach handler used to list monks.
     *
     * @param {integer} item -- monk index
     * @param {integer} index -- line number to output (starting with 0)
     */
    function listMonk(item, index) {
        var monk_list = ["A", "B", "C", "D"];
        var lineind = (index + 1) * LINE_HEIGHT;
        var mline = "Monk " + monk_list[item];
        var ctx = handlePage.getContext();
        ctx.fillStyle = BLACK;
        ctx.textAlign = "start";
        ctx.font = LIST_FONT;
        ctx.fillText(mline, xgval + MONK_INDENT, ygval + lineind);
    }

    /**
     * Draw monk square in rondel
     *
     * @param {integer} xval -- x-coordinate
     * @param {integer} yval -- y-coordinate
     * @param {Array} contents -- numbers representing monks
     */
    function drawMonkSq(xval, yval, contents) {
        var nmonk = ["A", "B", "C", "D"];
        var func = shapeDrawer.drawCircle;
        var offset = COM_SQ_SZ / 2;
        var t_xval = xval + offset;
        var h_xval = xval + Math.round(offset / 2);
        shapeDrawer.drawSquare(xval, yval, COM_SQ_SZ, false);
        switch (contents.length) {
        case 0:
            break;
        case 1:
            func(xval, yval, COM_SQ_SZ, PALE_Y, nmonk[contents[0]]);
            break;
        case 2:
            func(xval, yval, offset, PALE_Y, nmonk[contents[0]]);
            func(t_xval, yval + offset, offset, PALE_Y, nmonk[contents[1]]);
            break;
        case 3:
            func(xval, yval, offset, PALE_Y, nmonk[contents[0]]);
            func(t_xval, yval, offset, PALE_Y, nmonk[contents[1]]);
            func(h_xval, yval + offset, offset, PALE_Y, nmonk[contents[2]]);
            break;
        default:
            xgval = xval;
            ygval = yval;
            contents.forEach(listMonk);
        }
    }

    /**
     * Given a number (in range 0-24), return object that contains
     * numeric value, text of resource type, and color
     *
     * @param {integer} resource tile number
     */
    function getRescTile(item) {
        var lrank = (item % NUM_RESOURCE_TYPES) + 1;
        var indx = Math.floor(item / NUM_RESOURCE_TYPES);
        return {rank: lrank, name: RNAME[indx], color: RCOLOR[indx]};
    }

    /**
     * Display resource when there are over 3 in a square.
     *
     * @param {integer} item -- Resource value
     * @param {integer} index -- tile number in deck
     */
    function listResc(item, index) {
        var lineind = (index + 1) * LINE_HEIGHT;
        var rInfo = getRescTile(item);
        var mline = rInfo.rank + " " + rInfo.name;
        var ctx = handlePage.getContext();
        ctx.fillStyle = BLACK;
        ctx.textAlign = "start";
        ctx.font = LIST_FONT;
        ctx.fillText(mline, xgval + RESOURCE_INDENT, ygval + lineind);
    }

    /**
     * Draw a resource square
     *
     * @param {integer} xval -- left x-coordinate
     * @param {integer} yval -- top y-coordinate
     * @param {Array} contents -- tile numbers on square
     */
    function drawResrcSq(xval, yval, contents) {
        var c0;
        var c1;
        var c2;
        var x1;
        var x2;
        var hexoff;
        var func = shapeDrawer.drawHex;
        var hex_norm_off = xval + HEX_NORM_OFFSET;
        var top_line = yval + HEX_TOP_LINE;
        shapeDrawer.drawSquare(xval, yval, COM_SQ_SZ, false);
        switch (contents.length) {
        case 0:
            break;
        case 1:
            c0 = getRescTile(contents[0]);
            func(hex_norm_off, top_line, BIG_HEX_SZ, c0.color, c0.rank);
            break;
        case 2:
            c0 = getRescTile(contents[0]);
            c1 = getRescTile(contents[1]);
            hexoff = func(hex_norm_off, top_line, HEX_SZ, c0.color, c0.rank);
            func(hexoff[0], hexoff[1], HEX_SZ, c1.color, c1.rank);
            break;
        case 3:
            c0 = getRescTile(contents[0]);
            c1 = getRescTile(contents[1]);
            c2 = getRescTile(contents[2]);
            x1 = xval + HEX_START;
            x2 = x1 + HEX_SZ;
            hexoff = func(x1, top_line, HEX_SZ, c0.color, c0.rank);
            func(x2, top_line, HEX_SZ, c1.color, c1.rank);
            func(hexoff[0], hexoff[1], HEX_SZ, c2.color, c2.rank);
            break;
        default:
            xgval = xval;
            ygval = yval;
            contents.forEach(listResc);
        }
    }

    /**
     * Add a square to the rondel
     *
     * @param {object} item -- extracted from layout
     * @param {integer} index -- index into layout
     */
    function addRondelSq(item, index) {
        var xcoord = index;
        var switcher;
        var ycoord = 0;
        if (xcoord > RONDEL_RIGHT_IND) {
            xcoord = RONDEL_RIGHT_IND;
            ycoord = index - RONDEL_RIGHT_IND;
            if (ycoord > RONDEL_BOT_IND) {
                ycoord = RONDEL_BOT_IND;
                xcoord = 2 * RONDEL_RIGHT_IND + RONDEL_BOT_IND - index;
                if (xcoord < 0) {
                    xcoord = 0;
                    ycoord = TOTAL_NUM_OF_SQUARES - index;
                }
            }
        }
        xcoord = xcoord * ALL_SQ_SZ + EDGE_WIDTH;
        ycoord = ycoord * ALL_SQ_SZ + EDGE_WIDTH;
        switcher = item.type;
        if (switcher.startsWith("Score")) {
            switcher = "Score";
        }
        switch (switcher) {
        case "Start":
            draw_Start();
            break;
        case "Resource":
            drawResrcSq(xcoord, ycoord, item.content);
            break;
        case "Monk":
            drawMonkSq(xcoord, ycoord, item.content);
            break;
        case "Score":
            scoring_disk_sq(xcoord, ycoord, item.content);
            break;
        case "Barrel":
            barrel_room(xcoord, ycoord);
            break;
        }

    }

    /**
     * Display the round counters/monk piles
     *
     * @param {String} item -- pile label (I or II)
     * @param {integer} index -- pile number (0-5)
     */
    function monkpile_draw(item, index) {
        var xval = X_ROUND_ORIGIN + (ALL_SQ_SZ * index);
        shapeDrawer.drawCircle(xval, Y_ROUND_ORIGIN, COM_SQ_SZ, PALE_Y, item);
    }

    /**
     * Given a barrel number (0-11), place it in
     * the right position on the board
     *
     * @param {String} item -- barrel value
     * @param {integer} index -- barrel number
     */
    function barrel_organize(item, index) {
        var xloc = (index % BARRELS_PER_ROW) + RONDEL_BARREL_OFFSET;
        var yloc = Math.floor(index / BARRELS_PER_ROW) + 1;
        xloc = xloc * ALL_SQ_SZ + ALL_SQ_SZ / 2;
        yloc = yloc * ALL_SQ_SZ + ALL_SQ_SZ / 2;
        barrel.barrel_draw(DIM_BARREL_TOP, BARREL_HT, xloc, yloc, item, index);
    }

    /**
     * getColor -- return color of text, and set background color in
     * start square.
     *
     * @param {string} -- sqparm -- starting square field
     * @param {context} -- ctx
     * @param {integer} -- xv -- x-coordinate
     * @param {integer} -- yv -- y-coordinate
     */
    function getColor(sqparm, ctx, xv, yv, lyout) {
        if (lyout[0][sqparm] === "") {
            return BLACK;
        }
        ctx.fillStyle = lyout[0][sqparm];
        ctx.fillRect(xv, yv, 50, 50);
        if (ctx.fillStyle === BLACK) {
            return WHITE;
        }
        return BLACK;
    }

    /**
     * Draw_starting square
     */
    function draw_start_sq(llayout) {
        var ctx = handlePage.getContext();
        ctx.fillStyle = getColor("first", ctx, 0, 0, llayout);
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.fillText("First", 25, 15);
        ctx.fillText("Player", 25, 30);
        ctx.fillStyle = getColor("mvBrew", ctx, 0, 50, llayout);
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.fillText("+1", 25, 80);
        ctx.fillText("Brewer", 25, 95);
        ctx.fillStyle = getColor("mvRes", ctx, 50, 0, llayout);
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.fillText("+2", 75, 15);
        ctx.font = "10px Arial";
        ctx.fillText("Resource", 75, 30);
        ctx.fillStyle = getColor("xtraMny", ctx, 50, 50, llayout);
        ctx.font = "18px Arial";
        ctx.textAlign = "center";
        ctx.fillText("+ $2", 75, 85);
    }

    /**
     * This screen has just been switched to.
     *
     * Draw the items in the rondel on the canvas.
     */
    function switchTo() {
        var rinfo;
        var llayout;
        var playersInOrder;
        handlePage.clear();
        rinfo = JSON.parse(sessionStorage.getItem("rondel"));
        llayout = rinfo.layout;
        llayout.forEach(addRondelSq);
        rinfo.monkpiles.forEach(monkpile_draw);
        rinfo.barrels.forEach(barrel_organize);
        draw_start_sq(llayout);
        sessionStorage.setItem("page", "rondel");
        heavenAndAle.common_button_add(RONDEL_BUTTON_START);
    }

    /**
     * Create a deck and shuffle it.
     *
     * @param {number} dsize -- size of decks to return
     */
    function shuffle_wrap(dsize) {
        var deck = mathutils.getDeck(dsize);
        mathutils.shuffle(deck);
        return deck;
    }

    /**
     * Initialize the rondel.  Mostly set up the future squares,
     * resource stacks, monk stacks, and barrel arrays.
     */
    function init() {
        var irondel = {};
        var lplayers;
        irondel.resources = [shuffle_wrap(RESC_TOT), shuffle_wrap(RESC_TOT)];
        irondel.monks = [shuffle_wrap(MONK_TOT), shuffle_wrap(MONK_TOT)];
        irondel.barrels = mathutils.getHistogram(NUM_OF_BARRELS, HI_BAR_CNT);
        irondel.round = 0;
        irondel.layout = layout;
        lplayers = JSON.parse(sessionStorage.getItem("players"));
        irondel.monkpiles = ["I", "I", "I"];
        if (lplayers.length > 2) {
            irondel.monkpiles.push("II");
        }
        if (lplayers.length === 4) {
            irondel.monkpiles.push("II");
            irondel.monkpiles.push("II");
        }
        irondel.layout[0].first = lplayers[0];
        sessionStorage.setItem("rondel", JSON.stringify(irondel));
    }

    /**
     * Set tiles on a rondel square
     *
     * @param {object} square -- square on rondel to set.
     */
    function setSquare(square) {
        var localVar;
        if (square.type === "Resource") {
            localVar = drondel.resources[thisRoundIndex][0] % UNIQ_RESC_NUMB;
            drondel.resources[thisRoundIndex].shift();
            square.content.push(localVar);
        }
        if (square.type === "Monk") {
            localVar = drondel.monks[thisRoundIndex][0] % NUM_MONK_TYPES;
            drondel.monks[thisRoundIndex].shift();
            square.content.push(localVar);
        }
        if (square.type.startsWith("Score")) {
            square.content = ["x"];
        }
    }

    /**
     * Draw tiles for the next round.
     *
     * Decrease the number of monktile markers.
     * Deal out new tiles.
     */
    function drawForNextRound() {
        var thisRound;
        drondel = JSON.parse(sessionStorage.getItem("rondel"));
        if (drondel.monkpiles.length === 0) {
            sessionStorage.setItem("state", GAME_OVER_STATE);
            return;
        }
        thisRound = drondel.monkpiles[0];
        drondel.monkpiles.shift();
        thisRoundIndex = thisRound.length - 1;
        drondel.layout.forEach(setSquare);
        sessionStorage.setItem("rondel", JSON.stringify(drondel));
    }

    function find2Res(item) {
        var bdata = JSON.parse(sessionStorage.getItem("boards"));
        if (bdata[item].canIncRes) {
            bdata[item].canIncRes = false;
            found2Res = item;
        }
    }
    function pick_start_pos() {
        var xnum;
        var ynum;
        var digit1;
        var digit2;
        var indx;
        var nextQueue;
        var new_starter;
        var tempinfo;
        var sess_tmp;
        var sess_inf;
        var fPlayers;
        var bdata;
        var ssqz = ["first", "mvRes", "mvBrew", "xtraMny"];
        if (sessionStorage.getItem("event_type") === "Mouse") {
            xnum = sessionStorage.getItem("X_value");
            ynum = sessionStorage.getItem("Y_value");
            if (xnum > 100) {
                return;
            }
            if (ynum > 100) {
                return;
            }
            digit1 = Math.floor(xnum / 50);
            digit2 = Math.floor(ynum / 50);
            indx = digit2 * 2 + digit1;
            tempinfo = JSON.parse(sessionStorage.getItem("rondel"));
            if (tempinfo.layout[0][ssqz[indx]] === "") {
                sess_tmp = sessionStorage.getItem("start_queue");
                nextQueue = JSON.parse(sess_tmp);
                new_starter = nextQueue.shift();
                if (new_starter === "undefined") {
                    return;
                }
                sess_tmp =  JSON.stringify(nextQueue);
                sessionStorage.setItem("start_queue", sess_tmp);
                tempinfo.layout[0][ssqz[indx]] = new_starter;
                sessionStorage.setItem("rondel", JSON.stringify(tempinfo));
                bdata = JSON.parse(sessionStorage.getItem("boards"));
                if (indx === 3) {
                    bdata[new_starter].money += 2;
                }
                if (indx === 2) {
                    bdata[new_starter].brewmaster += 1;
                }
                if (indx === 1) {
                    bdata[new_starter].canIncRes = true;
                }
                switchTo();
                sessionStorage.setItem("boards", JSON.stringify(bdata));
                if (nextQueue.length < 1) {
                    sess_inf = sessionStorage.getItem("players");
                    fPlayers = JSON.parse(sess_inf);
                    found2Res = "";
                    fPlayers.forEach(find2Res);
                    if (found2Res.length > 1) {
                        sessionStorage.setItem("state", PLAYER_GETS_2RES);
                        sessionStorage.setItem("add2rec2", found2Res);
                    } else {
                        sessionStorage.setItem("state", REGULAR_TURN);
                    }
                }
            }
        }
    }

    return {
        switchTo,
        init,
        drawForNextRound,
        pick_start_pos
    };
}());