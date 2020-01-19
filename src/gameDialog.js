/* Copyright (c) 2020 Warren Usui, MIT License */
/*global jquery $ */
/*jslint browser:true, this */

/*****************************************************************************
 *
 * Jquery interfaces.
 *
 *****************************************************************************
 */
var gameDialog = (function () {
    /**
     * Send message to user.  Displays html.
     *
     * @param {string} message -- html input
     * @param {string} title -- text in header
     */
    function message(in_text, header, actions) {
        $("<div></div>").html(in_text).dialog({
            title: header,
            resizable: false,
            modal: true,
            buttons: {
                "OK": function () {
                    $(this).dialog("close");
                }
            },
            close: function () {
                if (actions) {
                    actions();
                }
            }
        });
    }

    /**
     * Pick a yes or no option
     *
     * @param {string} message -- html input
     * @param {string} title -- text in header
     * @param (function) cont_func -- continuation function
     */
    function msg_yorn(in_text, header, actions) {
        var choice = "NO";
        $("<div></div>").html(in_text).dialog({
            title: header,
            resizable: false,
            modal: true,
            buttons: {
                "YES": function () {
                    choice = "YES";
                    $(this).dialog("close");
                },
                "NO": function () {
                    choice = "NO";
                    $(this).dialog("close");
                }
            },
            close: function () {
                if (actions) {
                    actions(choice);
                }
            }
        });
    }

    return {
        message,
        msg_yorn
    };
}());