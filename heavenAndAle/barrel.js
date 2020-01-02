/* Copyright (c) 2020 Warren Usui, MIT License */
/*global gameDialog, handlePage, constants BARREL_RATIO, BARREL_ADJ,
  BROWN, BLACK */
/*jslint browser:true */

/**
 * Barrel related functions
 */
var barrel = (function () {
    var barrelButton = {
        "font": "12 px Arial",
        "text": "Barrel Info",
        "text_loc": [7, 18],
        "corner": [50, 567],
        "dims": [70, 30]
    };

    /**
     * Display when Barrel Info button is hit
     */
    function barrelInfoMsg() {
        var retv = "<div style=\"font-size:12px\">";
        retv += "<table border=\"1\">";
        retv += "<tr><th>Barrel</th><th>Description</th></tr>";
        retv += "<tr><td>A</td><td>Brewmaster value 1 or greater</td></tr>";
        retv += "<tr><td>B</td><td>All resource production value";
        retv += " are 1 or greater</td></tr>";
        retv += "<tr><td>C</td><td>At least 6 resources placed";
        retv += " with fertility number 1</td></tr>";
        retv += "<tr><td>D</td><td>At least 6 resources placed";
        retv += " with fertility number 5</td></tr>";
        retv += "<tr><td>E</td><td>Four monk scoring disks placed</td></tr>";
        retv += "<tr><td>F</td><td>Five resource scoring";
        retv += " disks placed</td></tr>";
        retv += "<tr><td>G</td><td>Three shed tiles of same";
        retv += " type placed</td></tr>";
        retv += "<tr><td>H</td><td>Four shed tiles of different";
        retv += " types placed</td></tr>";
        retv += "<tr><td>I</td><td>At least one resource production";
        retv += " value of 20 reached</td></tr>";
        retv += "<tr><td>J</td><td>At least 3 privilege cards played</td></tr>";
        retv += "<tr><td>K</td><td>All sunny spots filled</td></tr>";
        retv += "<tr><td>L</td><td>All shady spots filled</td></tr>";
        retv += "</table>";
        retv += "</div>";
        return retv;
    }

    /**
     * Draw a barrel
     *
     * @param {integer} bwid --width of top of barrel
     * @param {integer} bhgt -- height of barrel
     * @param {integer} xloc -- x-coordinate of center of barrel
     * @param {integer} yloc -- y-coordinate of center of barrel
     * @param {integer} item -- value (2 or 4)
     * @param {integer} index -- index (used to derive A-L name)
     */
    function barrel_draw(bwid, bhgt, xloc, yloc, item, index) {
        var rside;
        var lside;
        var bar_ind;
        var hwidth;
        var fonth;
        var ang1;
        var ang2;
        var barrel_labels = "ABCDEFGHIJKL";
        var ctx = handlePage.getContext();
        var circ_radius = Math.round(BARREL_RATIO * bhgt);
        var hhgt = bhgt / 2;
        var hyp2 = circ_radius * circ_radius + hhgt * hhgt;
        var hyp = Math.sqrt(hyp2);
        var angle = Math.asin(hhgt / hyp);
        var spoint = 2 * Math.PI - angle;
        if (item === 0) {
            return;
        }
        ctx.strokeStyle = BLACK;
        ctx.fillStyle = BROWN;
        ctx.beginPath();
        rside = xloc + bwid / 2;
        lside = xloc - bwid / 2;
        ctx.arc(rside - circ_radius, yloc, hyp, spoint, angle, false);
        ang1 = Math.PI - angle;
        ang2 = Math.PI + angle;
        ctx.arc(lside + circ_radius, yloc, hyp, ang1, ang2, false);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        bar_ind = barrel_labels.charAt(index);
        ctx.fillStyle = BLACK;
        fonth = hhgt - BARREL_ADJ;
        ctx.font = fonth.toString() + "px Arial";
        ctx.textAlign = "start";
        hwidth = Math.round(ctx.measureText(bar_ind).width / 2);
        ctx.fillText(bar_ind, xloc - hwidth, yloc - BARREL_ADJ);
        hwidth = Math.round(ctx.measureText(item).width / 2);
        ctx.fillText(item, xloc - hwidth, yloc - BARREL_ADJ + hhgt);
    }

    return {
        barrelButton,
        barrelInfoMsg,
        barrel_draw
    };
}());
