/* Copyright (c) 2020 Warren Usui, MIT License */
/*global sessionStorage, handlePage, BLACK, WHITE, GRAY, HEADER_ADJ_FACTOR,
  MEEPLE_FACTOR, MEEPLE_TORSO_ADJ, MEEPLE_HEAD_ADJ, MEEPLE_ARM_ADJ,
  MEEPLE_QUEUE_CONST, BIG_MEEPLES, SMALL_MEEPLES, MEEPLE_CLEAR1, MEEPLE_CLEAR2,
  LOT_OF_COLORS, MEEPLE_FUDGE */
/*jslint browser:true */

/*****************************************************************************
 *
 * Utilities used by the game canvas.
 *
 *****************************************************************************
 */
var canvasObjects = (function () {

    var ctx;
    var dims;
    var meeplesize;
    var gapsize;
    var meepleMap;
    var helpButton = {
        "font": "12px Arial",
        "text": "Help",
        "text_loc": [7, 18],
        "corner": [3, 567],
        "dims": [40, 30]
    };

    /**
     * Write large text at the top center of the canvas
     *
     * @param {string} inText -- text to display
     */
    function addHeader(inText) {
        ctx = handlePage.getContext();
        dims = handlePage.getSize();
        var middle = dims[0] / 2;
        var hvertical;
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = BLACK;
        hvertical = Math.floor(dims[1] / HEADER_ADJ_FACTOR);
        ctx.fillText(inText, middle, hvertical);
    }

    /**
     * Add a button to the canvas
     *
     * @param {object} button
     * @param {boolean} ready -- darken button if false (not usable)
     */
    function addButton(button, ready) {
        var p1 = button.corner[0];
        var p2 = button.corner[1];
        var p3 = button.dims[0];
        var p4 = button.dims[1];
        var txt_loc_x;
        var txt_loc_y;
        ctx = handlePage.getContext();
        ctx.strokeStyle = BLACK;
        ctx.strokeRect(p1, p2, p3, p4);
        if (ready) {
            ctx.fillStyle = WHITE;
        } else {
            ctx.fillStyle = GRAY;
        }
        if (button.text.startsWith("#")) {
            ctx.fillStyle = button.text;
            ctx.fillRect(p1, p2, p3, p4);
            return;
        }
        ctx.fillRect(p1, p2, p3, p4);
        ctx.fillStyle = BLACK;
        ctx.textAlign = "start";
        ctx.font = button.font;
        txt_loc_x = p1 + button.text_loc[0];
        txt_loc_y = p2 + button.text_loc[1];
        ctx.fillText(button.text, txt_loc_x, txt_loc_y);
    }

    /**
     * Draw a stick figure on the canvas
     *
     * @param {integer} xvalue --  left-most X coordinate
     * @param {integer} yvalue -- upper-most Y coordinate
     * @param {integer} size -- x-width of meeple in pixels
     * @param {string} color -- rgb color of stick figure
     */
    function drawMeeple(xvalue, yvalue, size, color) {
        var sizefactor = size / MEEPLE_FACTOR;
        var yoff = yvalue + MEEPLE_TORSO_ADJ * sizefactor;
        var ytoloc = yoff + size;
        var xloc = xvalue + size / 2;
        var headradius = MEEPLE_HEAD_ADJ * sizefactor;
        var maxy = ytoloc + size / 2;
        var armadjust = Math.floor(size / MEEPLE_ARM_ADJ);
        ctx = handlePage.getContext();
        ctx.lineWidth = 5;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(xloc, yoff);
        ctx.lineTo(xloc, ytoloc);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(xloc, yoff - headradius, headradius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(xloc, ytoloc);
        ctx.lineTo(xloc - size / 2, maxy);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(xloc, ytoloc);
        ctx.lineTo(xloc + size / 2, maxy);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(xvalue, yoff + size / 2 - armadjust);
        ctx.lineTo(xloc, yoff + size / 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(xloc, yoff + size / 2);
        ctx.lineTo(xvalue + size, yoff + size / 2 - armadjust);
        ctx.stroke();
        ctx.lineWidth = 1;
    }

    /**
     * Wrapper between addMeepleLine and drawMeeple.  Called from
     * foreach in addMeepleLine that steps through array of meeples.
     *
     * @param {string} item
     * @param {number} index
     */
    function drawMeepleWrapper(item, index) {
        var offset = index * meeplesize + (index + 1) * gapsize;
        var topLeftCorner = [offset, offset + meeplesize];
        var adj = Math.floor(MEEPLE_FUDGE * meeplesize);
        var ymax = MEEPLE_QUEUE_CONST + adj;
        var botRightCorner = [MEEPLE_QUEUE_CONST, ymax];
        drawMeeple(offset, MEEPLE_QUEUE_CONST, meeplesize, item);
        meepleMap[item] = [topLeftCorner, botRightCorner];
    }

    /**
     * Draw a line of meeples on the canvas
     *
     * @param {Array} colors -- colors of meeples to add.
     */
    function addMeepleLine(colors) {
        var numbofblanks;
        var nonspace;
        meepleMap = {};
        ctx = handlePage.getContext();
        dims = handlePage.getSize();
        meeplesize = BIG_MEEPLES;
        if (colors.length > LOT_OF_COLORS) {
            meeplesize = SMALL_MEEPLES;
        }
        numbofblanks = colors.length + 1;
        nonspace = dims[0] - meeplesize * colors.length;
        gapsize = nonspace / numbofblanks;
        ctx.clearRect(0, MEEPLE_CLEAR1, dims[0], MEEPLE_CLEAR2);
        colors.forEach(drawMeepleWrapper);
    }

    /**
     * Return meepleMap.  Each attribute in meepleMap is a color
     * of a meeple.  The value of that attribute is an Array with
     * two entries. The first entry in that Array is the location
     * of the upper-left corner of that meeple.  The second entry
     * is the location of the lower-right corner of that meeple.
     * Locations are expressed as [x, y] values.
     */
    function getMeepleMap() {
        return meepleMap;
    }

    /**
     * Check if a button is hit.  Returns true if it was, false if not.
     *
     * @param {object} button_info
     */
    function buttonHit(button_info) {
        var xval = sessionStorage.getItem("X_value");
        var yval = sessionStorage.getItem("Y_value");
        var rhtmost = button_info.corner[0] + button_info.dims[0];
        var botmost = button_info.corner[1] + button_info.dims[1];
        if (button_info.corner[0] > xval) {
            return false;
        }
        if (button_info.corner[1] > yval) {
            return false;
        }
        if (rhtmost < xval) {
            return false;
        }
        if (botmost < yval) {
            return false;
        }
        return true;
    }

    return {
        helpButton,
        addHeader,
        addButton,
        addMeepleLine,
        drawMeeple,
        getMeepleMap,
        buttonHit
    };
}());