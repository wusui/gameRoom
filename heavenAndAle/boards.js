/* Copyright (c) 2020 Warren Usui, MIT License */
/*global sessionStorage, RCOLOR, RNAME, NUM_OF_BARRELS, handlePage,
  BLACK, WHITE, PALE_Y, BROWN, LIGHT_GREEN, OLIVE_GREEN, BRIGHT_RED,
  heavenAndAle, canvasObjects, gameDialog, shapeDrawer */
/*jslint browser:true */

/*****************************************************************************
 *
 * Player boards
 *
 *****************************************************************************
 */
const RONDELBUTTON = {
    "font": "12px Arial",
    "text": "Back to Main Page",
    "text_loc": [5, 20],
    "corner": [220 + 110, 567],
    "dims": [110, 30]
};

const PRIV_INFO = {
    "font": "12px Arial",
    "text": "Privilege Info",
    "text_loc": [5, 20],
    "corner": [130, 567],
    "dims": [80, 30]
};

const BREWMASTER_INFO = {
    "font": "12px Arial",
    "text": "Brewmaster Info",
    "text_loc": [5, 20],
    "corner": [220, 567],
    "dims": [100, 30]
};

const BM_CHART = [
    {"low": -10, "high": 0, "ratio": "5:1", "bval": "x2"},
    {"low": 1, "high": 4, "ratio": "4:1", "bval": "x3"},
    {"low": 5, "high": 8, "ratio": "3:1", "bval": "x3"},
    {"low": 9, "high": 11, "ratio": "3:1", "bval": "x4"},
    {"low": 12, "high": 14, "ratio": "2:1", "bval": "x4"},
    {"low": 15, "high": 17, "ratio": "2:1", "bval": "x5"},
    {"low": 18, "high": 19, "ratio": "2:1", "bval": "x6"},
    {"low": 20, "high": 20, "ratio": "1:1", "bval": "x6"}
];

const PG_BUTTON_START = 450;

const SUNNY_MAP_POINTS = [
    [730, 195],
    [700, 247],
    [610, 299],
    [670, 299],
    [730, 299],
    [580, 351],
    [700, 351],
    [610, 403],
    [670, 403],
    [730, 403],
    [580, 455],
    [700, 455],
    [610, 507],
    [670, 507],
    [730, 507]
];

const SHADY_MAP_POINTS = [
    [790, 195],
    [820, 247],
    [910, 299],
    [850, 299],
    [790, 299],
    [940, 351],
    [820, 351],
    [910, 403],
    [850, 403],
    [790, 403],
    [940, 455],
    [820, 455],
    [910, 507],
    [850, 507],
    [790, 507]
];

const MAP_HEX_TOUCHES = {
    "0": [0, 1, -1],
    "1": [0, 3, 4, -1],
    "2": [3, 5, -4],
    "3": [1, 4, 6, 3, -4],
    "4": [4, 1, 3, 6, -1, -2],
    "5": [2, 7, -4],
    "6": [3, 4, 8, 9, -2, -4],
    "7": [5, 8, 10, -4, -5],
    "8": [6, 9, 11, 7, -4, -5],
    "9": [9, 6, 8, 11, -2, -3],
    "10": [8, 12, -5],
    "11": [8, 9, 13, 14, -3, -5],
    "12": [10, 13, -5],
    "13": [11, 12, 14, -5],
    "14": [14, 11, 13, -3]
};

const MAP_SHED_TOUCHES = {
    "1": [0, 1, 4],
    "2": [4, 6, 9],
    "3": [9, 11, 14],
    "4": [2, 3, 5, 6, 7, 8],
    "5": [7, 8, 10, 11, 12, 13]
};

const MAP_HEX_LAYOUT = [
    [730, 2],
    [700, 3],
    [610, 6],
    [580, 7],
    [610, 6],
    [580, 7],
    [610, 6]
];

const MAP_SHED_LABELS = [
    [738, 252],
    [738, 252 + 104],
    [738, 252 + 208],
    [738 + 120, 252 + 208],
    [738 - 120, 252 + 208],
    [738 + 120, 252 + 104],
    [738 - 120, 252 + 104]
];

const monklabels = "ABCD";

var boards = (function () {
    const START_MONEY = 25;
    const MAX_SCORING_DISKS = 10;
    const HALF_MAP_SIZE = 15;
    const NUM_OF_SHEDS = 7;
    const BMASTER_START = -9;
    const L_PANEL_WIDTH = 500;
    const PANEL_HEIGHT = 100;
    var ns_glob_board;
    var ns_newboard;
    var ctx;
    var ns_bm_number;
    var brewmaster_msg;
    var bm_data;
    var priv_list;
    var resource_info;
    var score_dsks;
    var map_hex_hgt;
    var hex_point;
    var xpos;

    /**
     * ForEach called function to set initial resource track token
     * positions
     */
    function set_resources(item, index) {
        const init_pos = [1, -2, -4, -6, -8];
        ns_newboard.resources[item] = init_pos[index];
    }

    /**
     * Create a new array filled with one value
     *
     * @param {integer} value -- value in array
     * @param {integer} number -- size of array
     */
    function set_vector(value, number) {
        var barray = [];
        var count = 0;
        while (count < number) {
            barray.push(value);
            count += 1;
        }
        return barray;
    }

    /**
     * ForEach function that adds a new player board
     */
    function addData(item) {
        ns_newboard = {};
        ns_newboard.money = START_MONEY;
        ns_newboard.privileges = [1, 2, 3, 4, 5];
        ns_newboard.barrels = set_vector(0, NUM_OF_BARRELS);
        ns_newboard.brewmaster = BMASTER_START;
        ns_newboard.scoring_disks = set_vector(0, MAX_SCORING_DISKS);
        ns_newboard.scored_privs = set_vector(0, ns_newboard.privileges.length);
        ns_newboard.sunny = set_vector(-1, HALF_MAP_SIZE);
        ns_newboard.shady = set_vector(-1, HALF_MAP_SIZE);
        ns_newboard.sheds = set_vector(-1, NUM_OF_SHEDS);
        ns_newboard.prev_sq = -1;
        ns_newboard.cur_sq = 0;
        ns_newboard.resources = {};
        RCOLOR.forEach(set_resources);
        ns_newboard.canIncRes = false;
        ns_glob_board[item] = ns_newboard;
    }

    /**
     * Initialize player boards
     */
    function init() {
        var players = JSON.parse(sessionStorage.getItem("players"));
        ns_glob_board = {};
        players.forEach(addData);
        sessionStorage.setItem("boards", JSON.stringify(ns_glob_board));
    }

    /**
     * Draw triangles (little ones in shed hex)
     *
     * @param {context} ctx -- context
     * @param {integer) xoffset -- horizontal offset
     * @param {array} xvec -- x-coordinates
     * @param {array} yvec -- y-coordinates
     */
    function drawTriangle(ctx, xoffset, xvec, yvec) {
        ctx.beginPath();
        ctx.moveTo(xoffset + xvec[0], yvec[0]);
        ctx.lineTo(xoffset + xvec[1], yvec[1]);
        ctx.lineTo(xoffset + xvec[2], yvec[2]);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    /**
     * Use player background color
     */
    function use_plyr_bg_color() {
        ctx.strokeStyle = BLACK;
        ctx.fillStyle = BLACK;
        if (sessionStorage.getItem("page") === BLACK) {
            ctx.strokeStyle = WHITE;
            ctx.fillStyle = WHITE;
        }
    }

    /**
     * Draw shed info -- called from forEach statement
     */
    function drawShedInfo(item, index) {
        var xoffset;
        var pattern014 = [0, 1, 4];
        var pattern0124 = [0, 1, 2, 4];
        var pattern0134 = [0, 1, 3, 4];
        use_plyr_bg_color();
        xoffset = index * 100;
        ctx.moveTo(xoffset, 0);
        ctx.lineTo(xoffset, 100);
        ctx.stroke();
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText(item[0], xoffset + 48, 30);
        ctx.font = "40px Arial";
        ctx.textAlign = "left";
        ctx.fillText(item[1], xoffset + 10, 90);
        ctx.fillStyle = OLIVE_GREEN;
        ctx.strokeStyle = OLIVE_GREEN;
        ctx.beginPath();
        ctx.moveTo(xoffset + 48, 62);
        ctx.lineTo(xoffset + 72, 50);
        ctx.lineTo(xoffset + 96, 62);
        ctx.lineTo(xoffset + 96, 86);
        ctx.lineTo(xoffset + 72, 98);
        ctx.lineTo(xoffset + 48, 86);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        ctx.fillStyle = WHITE;
        ctx.strokeStyle = WHITE;
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText(item[2], xoffset + 72, 80);
        drawTriangle(ctx, xoffset, [48, 53, 53], [74, 71, 77]);
        if (pattern0124.indexOf(index) !== -1) {
            drawTriangle(ctx, xoffset, [96, 91, 91], [74, 71, 77]);
        }
        if (pattern014.indexOf(index) !== -1) {
            drawTriangle(ctx, xoffset, [60, 60, 65], [56, 62, 59]);
        }
        if (pattern0134.indexOf(index) !== -1) {
            drawTriangle(ctx, xoffset, [84, 84, 79], [56, 62, 59]);
        }
        if (pattern014.indexOf(index) !== -1) {
            drawTriangle(ctx, xoffset, [60, 60, 65], [90, 84, 87]);
        }
        if (pattern0134.indexOf(index) !== -1) {
            drawTriangle(ctx, xoffset, [84, 84, 79], [90, 84, 87]);
        }
        ctx.beginPath();
    }

    /**
     * From forEach loop.  Set bm_data if in this range.  Used to display
     * ratio and brewmaster factor on player page.
     */
    function get_bm(item) {
        if (item.low <= ns_bm_number) {
            if (item.high >= ns_bm_number) {
                bm_data = item.ratio + "  " + item.bval;
            }
        }
    }

    /**
     * Draw a privilege card on the player page
     *
     * @param {integer} item -- privilege card number
     * @param {integer} xval -- x-coord of card
     * @param {integer} yval -- y-coord of card
     */
    function draw_priv_card(item, xval, yval) {
        var one_line = ["+ $12", "+5 B"];
        var line_two = ["barrel", "resource", "scoring disk"];
        var cloc;
        var temp;
        ctx.strokeRect(xval, yval, 60, 40);
        ctx.textAlign = "center";
        cloc = xval + 30;
        if (item < 3) {
            ctx.font = "20px Arial";
            ctx.fillText(one_line[item - 1], cloc, 280);
        } else {
            temp = item - 3;
            ctx.font = "10px Arial";
            ctx.fillText("+1 per", cloc, 270);
            ctx.fillText(line_two[temp], cloc, 285);
        }
    }

    /**
     * From forEach call.  Draw privilege cards that have not been
     * played or sold.
     */
    function get_priv_cards(item, index) {
        var xval;
        if (item !== 0) {
            xval = 130 + 70 * index;
            draw_priv_card(item, xval, 255);
        }
    }

    /**
     * From forEach.  Draw a resource tracking square
     */
    function resource_tracker(item, index) {
        ctx.strokeStyle = BLACK;
        ctx.strokeRect(520 + index * 100, 60, 80, 60);
        ctx.fillStyle = item;
        ctx.fillRect(520 + index * 100, 60, 80, 60);
        ctx.textAlign = "center";
        ctx.fillStyle = BLACK;
        if (resource_info[item] < 0) {
            ctx.fillStyle = BRIGHT_RED;
        }
        ctx.font = "40px Arial";
        ctx.fillText(resource_info[item], 560 + index * 100, 104);
    }

    /**
     * Add spot to place a resource scoring disk
     */
    function add_resource_score_dsk(item) {
        score_dsks.push(["", item]);
    }

    /**
     * Add spot to place a monk scoring disk
     */
    function add_monk_score_dsk(item) {
        score_dsks.push([item, PALE_Y]);
    }

    /**
     * From forEach -- draw scoring disks placement locations
     */
    function draw_score_disks(item, index) {
        var spacing = Math.floor(index / 2) * 20;
        var prev_disks = index * 40;
        var yloc = 10 + spacing + prev_disks + 20;
        ctx.beginPath();
        ctx.arc(1040, yloc, 16, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = item[1];
        ctx.fill();
        ctx.font = "20px Arial";
        ctx.fillStyle = BLACK;
        ctx.textAlign = "center";
        ctx.fillText(item[0], 1040, yloc + 7);
    }

    /**
     * Called from forEach loop.  Given the midpoint of a hex, find
     * the hexes top most point.  Set hex_point value.
     */
    function find_pt(item, index) {
        if (xpos === item[0]) {
            if (map_hex_hgt === item[1] - 35) {
                hex_point = index;
            }
        }
    }

    /**
     * Called from forEach loop.  Add hexes to the farm map.
     */
    function drawHexes(item) {
        var next;
        var lt_cnt;
        var colorg;
        var cnt = 0;
        var side_ptr;
        var hcolor;
        var nm;
        var chk_side;
        var number;
        var aintshed;
        var board_info = JSON.parse(sessionStorage.getItem("boards"));
        var sess_page = sessionStorage.getItem("page");
        xpos = item[0];
        number = item[1];
        lt_cnt = Math.floor(number / 2);
        while (number > 0) {
            if (lt_cnt > 0) {
                colorg = LIGHT_GREEN;
                side_ptr = board_info[sess_page].sunny;
                chk_side = SUNNY_MAP_POINTS;
            } else {
                colorg = OLIVE_GREEN;
                side_ptr = board_info[sess_page].shady;
                chk_side = SHADY_MAP_POINTS;
            }
            aintshed = true;
            if (item[1] % 2 === 1 && cnt % 2 === 1) {
                colorg = OLIVE_GREEN;
                aintshed = false;
            }
            chk_side.forEach(find_pt);
            if (aintshed && side_ptr[hex_point] !== -1) {
                if (side_ptr[hex_point] < 30) {
                    hcolor = RCOLOR[Math.floor(side_ptr[hex_point] / 5)];
                    nm = side_ptr[hex_point] % 5 + 1;
                } else {
                    hcolor = PALE_Y;
                    nm = monklabels[side_ptr[hex_point] - 30];
                }
                next = shapeDrawer.drawHex(xpos, map_hex_hgt, 60, hcolor, nm);
            } else {
                next = shapeDrawer.drawHex(xpos, map_hex_hgt, 60, colorg, "");
            }
            xpos += 60;
            number -= 1;
            lt_cnt -= 1;
            cnt += 1;
        }
        map_hex_hgt = next[1];
    }

    /**
     * Mark sheds on the map.  Called from forEach.
     */
    function add_shed_label(item) {
        ctx.fillText("SHED", item[0], item[1]);
    }

    /**
     * Switch to a player board
     *
     * @param {color} player -- switch canvas to this player
     */
    function switchTo(player) {
        var shedInfo = [
            ["0-7", "6", "0"],
            ["8-11", "3", "1"],
            ["12-17", "1", "2"],
            ["18-23", "1", "3"],
            ["24+", "", "4"]
        ];
        var bdata;
        var board_info;
        var money;
        var sess_page;
        handlePage.clear();
        ctx = handlePage.getContext();
        ctx.beginPath();
        sessionStorage.setItem("page", player);
        bdata = JSON.parse(sessionStorage.getItem("boards"));
        ns_bm_number = bdata[sessionStorage.getItem("page")].brewmaster;
        heavenAndAle.common_button_add(PG_BUTTON_START);
        canvasObjects.addButton(PRIV_INFO, true);
        canvasObjects.addButton(BREWMASTER_INFO, true);
        canvasObjects.addButton(RONDELBUTTON, true);
        ctx.strokeStyle = BLACK;
        ctx.fillStyle = player;
        ctx.strokeRect(0, 0, L_PANEL_WIDTH, PANEL_HEIGHT);
        ctx.fillRect(0, 0, L_PANEL_WIDTH, PANEL_HEIGHT);
        shedInfo.forEach(drawShedInfo);
        ctx.fillStyle = BLACK;
        ctx.strokeStyle = BLACK;
        ctx.textAlign = "left";
        ctx.fillText("MONEY", 115, 140);
        ctx.fillText("BREWMASTER", 280, 140);
        ctx.fillText("BARRELS", 200, 360);
        ctx.fillText("RESOURCE TRACKER", 650, 40);
        ctx.fillStyle = LIGHT_GREEN;
        ctx.strokeRect(100, 150, 100, 50);
        ctx.fillRect(100, 150, 100, 50);
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = BLACK;
        board_info = JSON.parse(sessionStorage.getItem("boards"));
        sess_page = sessionStorage.getItem("page");
        money = board_info[sess_page].money;
        ctx.fillText(money, 150, 185);
        ctx.strokeRect(300, 150, 100, 90);
        ctx.fillStyle = player;
        ctx.fillRect(300, 150, 100, 90);
        use_plyr_bg_color();
        ctx.font = "30px Arial";
        ctx.fillText(ns_bm_number, 350, 180);
        BM_CHART.forEach(get_bm);
        ctx.fillText(bm_data, 350, 230);
        ctx.strokeStyle = BLACK;
        ctx.strokeRect(10, 250, 470, 50);
        ctx.strokeRect(10, 380, 470, 160);
        ctx.fillStyle = WHITE;
        ctx.fillRect(10, 250, 470, 50);
        ctx.fillStyle = BROWN;
        ctx.fillRect(10, 380, 470, 160);
        ctx.font = "15px Arial";
        ctx.textAlign = "left";
        ctx.fillStyle = BLACK;
        ctx.fillText("Privilege Cards:", 13, 277);
        priv_list = board_info[sess_page].privileges;
        priv_list.forEach(get_priv_cards);
        resource_info = bdata[sess_page].resources;
        RCOLOR.forEach(resource_tracker);
        ctx.strokeStyle = BLACK;
        ctx.beginPath();
        ctx.moveTo(1020, 0);
        ctx.lineTo(1020, 500);
        ctx.lineTo(1060, 500);
        ctx.lineTo(1060, 0);
        ctx.closePath();
        ctx.stroke();
        score_dsks = [];
        score_dsks.push(["X", WHITE]);
        RCOLOR.forEach(add_resource_score_dsk);
        ["A", "B", "C", "D"].forEach(add_monk_score_dsk);
        score_dsks.forEach(draw_score_disks);
        map_hex_hgt = 160;
        MAP_HEX_LAYOUT.forEach(drawHexes);
        ctx.font = "16px Arial";
        ctx.fillStyle = WHITE;
        ctx.textAlign = "left";
        MAP_SHED_LABELS.forEach(add_shed_label);
    }

    /**
     * Print privilege card help information
     */
    function priv_info() {
        var retv = "<div style=\"font-size:12px\">";
        retv += "<table border=\"1\">";
        retv += "<tr><th>Privilege</th><th>Description</th></tr>";
        retv += "<tr><td>+ $12</td><td>Immediately add 12 ducats to your";
        retv += " bank account.</td></tr>";
        retv += "<tr><td>+5 B</td><td>Increase the Brewmaster point value";
        retv += " by five.</td></tr>";
        retv += "<tr><td>+1 per barrel</td><td>At the end of the game, each";
        retv += " barrel is worth one more point.</td></tr>";
        retv += "<tr><td>+1 per resource</td><td>Select a resource";
        retv += " Count the number of hexes on your board of that color.";
        retv += " Increase your resource points for that color by that";
        retv += " number.</td></tr>";
        retv += "<tr><td>+1 per scoring disk</td><td>Select one resource and";
        retv += " increase that resource's points by the number of scoring";
        retv += " disks on your board.</td></tr>";
        retv += "</table>";
        retv += "</div>";
        gameDialog.message(retv, "Privilege Information");
    }

    /**
     * From forEach -- display a ratio and a factor line for a specific
     * range of brewmaster values
     */
    function bm_info_line(item) {
        var field1;
        var field2 = item.ratio;
        var field3 = item.bval;
        var trtd;
        if (item.high === 0) {
            field1 = "0 or less";
        } else {
            field1 = item.low + "-" + item.high;
        }
        if (item.high === item.low) {
            field1 = item.high;
        }
        trtd = "<tr><td>";
        if (item.low <= ns_bm_number) {
            if (item.high >= ns_bm_number) {
                trtd = "<tr style=\"background-color:";
                trtd += LIGHT_GREEN;
                trtd += "\"><td>";
            }
        }
        brewmaster_msg += trtd + field1 + "</td><td>" + field2 + "</td><td>";
        brewmaster_msg += field3 + "</td><tr>";
    }

    /**
     * Display message box to show brewmaster ratios and multipliers
     */
    function brewmaster_info() {
        brewmaster_msg = "<div style=\"font-size:16px\">";
        brewmaster_msg += "<table border=\"1\">";
        brewmaster_msg += "<tr><th>Value</th><th>Ratio</th><th>";
        brewmaster_msg += "Factor</th></tr>";
        BM_CHART.forEach(bm_info_line);
        brewmaster_msg += "</table></div>";
        gameDialog.message(brewmaster_msg, "Brewmaster Chart");
    }

    return {
        init,
        switchTo,
        priv_info,
        brewmaster_info
    };
}());
