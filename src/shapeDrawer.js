/* Copyright (c) 2020 Warren Usui, MIT License */
/*global sessionStorage, handlePage, BLACK, HEX_FUDGE, CIRC_FUDGE */
/*jslint browser:true */

/*****************************************************************************
 *
 * Utilities to draw different shapes
 *
 *****************************************************************************
 */
var SQRT3 = Math.sqrt(3);

var shapeDrawer = (function () {
    /**
     * Draw a circle.  The circle is fully enclosed within
     * the square specified.
     *
     * @param {integer} xcoord -- left-most point in square
     * @param {integer} ycoord -- top-most point in square
     * @param {integer} sqSize -- length of side of square
     * @param {rgb} color -- fill color
     * @param {String} ltext -- text in circle
     */
    function drawCircle(xcoord, ycoord, sqSize, color, ltext) {
        var sqRad = Math.round(sqSize / 2);
        var cxcoord = xcoord + sqRad;
        var cycoord = ycoord + sqRad;
        var crad = sqRad - 3;
        var botOfLetter;
        var hwidth;
        var ctx = handlePage.getContext();
        ctx.lineWidth = 1;
        ctx.strokeStyle = BLACK;
        ctx.beginPath();
        ctx.arc(cxcoord, cycoord, crad, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.fill();
        botOfLetter = Math.round(cycoord + CIRC_FUDGE * sqSize / 4);
        ctx.font = sqRad.toString() + "px Arial";
        hwidth = Math.round(ctx.measureText(ltext).width / 2);
        ctx.fillStyle = BLACK;
        ctx.textAlign = "start";
        ctx.fillText(ltext, cxcoord - hwidth, botOfLetter);
    }

    /**
     * Draw a square
     *
     * @param {integer} xcoord -- left-most point in square
     * @param {integer} ycoord -- top-most point in square
     * @param {integer} slength -- length of side
     * @param {rgb} color -- fill color
     */
    function drawSquare(xcoord, ycoord, slength, color) {
        var ctx = handlePage.getContext();
        ctx.lineWidth = 1;
        ctx.strokeStyle = BLACK;
        ctx.beginPath();
        ctx.moveTo(xcoord, ycoord);
        ctx.lineTo(xcoord + slength, ycoord);
        ctx.lineTo(xcoord + slength, ycoord + slength);
        ctx.lineTo(xcoord, ycoord + slength);
        ctx.closePath();
        ctx.stroke();
        if (color) {
            ctx.fillStyle = color;
            ctx.fill();
        }
    }

    /**
     * Draw a hexagon
     *
     * @param {integer} xcoord -- center of hexagon
     * @param {integer} ycoord -- top most point in hexagon
     * @param {integer} width -- width of enclosing square
     * @param {rgb} color -- fill color
     * @param {String} ltext -- text in hexagon
     */
    function drawHex(xcoord, ycoord, width, color, ltext) {
        var sideleng;
        var height1;
        var ratio1;
        var ydrop;
        var xoffset;
        var bigydrop;
        var hwidth;
        var charsize;
        var vertadj;
        var ctx = handlePage.getContext();
        ratio1 = width / SQRT3;
        sideleng = Math.round(ratio1);
        height1 = Math.round(ratio1 / 2);
        ydrop = ycoord + height1;
        bigydrop = ycoord + 4 * height1;
        xoffset = Math.round(width / 2);
        ctx.lineWidth = 1;
        ctx.strokeStyle = BLACK;
        ctx.beginPath();
        ctx.moveTo(xcoord, ycoord);
        ctx.lineTo(xcoord + xoffset, ydrop);
        ctx.lineTo(xcoord + xoffset, ydrop + sideleng);
        ctx.lineTo(xcoord, bigydrop);
        ctx.lineTo(xcoord - xoffset, ydrop + sideleng);
        ctx.lineTo(xcoord - xoffset, ydrop);
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.fillStyle = BLACK;
        ctx.textAlign = "start";
        charsize = Math.round(2 * height1);
        ctx.font = charsize.toString() + "px Arial";
        hwidth = Math.round(ctx.measureText(ltext).width / 2);
        vertadj = Math.round(HEX_FUDGE * (height1 + charsize));
        ctx.fillText(ltext, xcoord - hwidth, ycoord + vertadj);
        return [xcoord + xoffset, ydrop + sideleng];
    }

    return {
        drawCircle,
        drawSquare,
        drawHex
    };
}());