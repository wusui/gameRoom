/* Copyright (c) 2020 Warren Usui, MIT License */
/*jslint browser:true */

/*****************************************************************************
 *
 * General math-ish routines.
 *
 *****************************************************************************
 */
var mathutils = (function () {

    /**
     * Shuffle a deck in-line.
     *
     * @param {Array} deck
     */
    function shuffle(deck) {
        var i = deck.length - 1;
        var j;
        while (i > 0) {
            j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
            i -= 1;
        }
    }

    /**
     * Add consecutively numbered values from 0 to n to a new Array
     *
     * @param {integer} dsize -- size of deck
     */
    function getDeck(dsize) {
        var newdeck = [];
        var counter = 0;
        while (counter < dsize) {
            newdeck.push(counter);
            counter += 1;
        }
        return newdeck;
    }

    /**
     * Return an array of several entries of the same value
     *
     * @param {integer} hsize -- size of the array
     * @param {integer} value -- starting value in all elements
     */
    function getHistogram(hsize, value) {
        var newhist = [];
        var counter = 0;
        while (counter < hsize) {
            newhist.push(value);
            counter += 1;
        }
        return newhist;
    }

    return {
        shuffle,
        getDeck,
        getHistogram
    };
}());