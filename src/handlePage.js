/* Copyright (c) 2019 Warren Usui, MIT License */
/*jslint browser:true */
/*****************************************************************************
 *
 * Handle user interactions with the game canvas.
 *
 *****************************************************************************
 */
var handlePage = (function () {
    var pcanvas;
    var ctx;
    var func_event;

    /**
     * Clear the canvas (used between board switches)
     */
    function clear() {
        ctx.clearRect(0, 0, pcanvas.width, pcanvas.height);
    }

    /**
     * On a mouse click, save location in sessionStorage and call func_event.
     *
     * @param {event} mouse click event
     */
    function mouseSwitch(event) {
        sessionStorage.setItem("X_value", event.pageX);
        sessionStorage.setItem("Y_value", event.pageY);
        sessionStorage.setItem("event_type", "Mouse");
        func_event();
    }

    /**
     * On a key press, save value in sessionStorage and call func_event.
     *
     * @param {event} key press event
     */
    function keyPress(event) {
        var char = event.which || event.keyCode;
        sessionStorage.setItem("Last_keypress", char);
        sessionStorage.setItem("event_type", "Key");
        func_event();
    }

    /**
     * If this is the first call, set the canvas value and save the context.
     *
     * @param {function} init_func -- intialization function for board
     * @param {function} event_func -- handler function for board
     */
    function init(init_func, event_func) {
        var uninit = typeof(pcanvas);
        if (uninit === "undefined") {
            pcanvas = document.getElementById("gameboard");
            ctx = pcanvas.getContext("2d");
            pcanvas.addEventListener("click", mouseSwitch, false);
            pcanvas.addEventListener("keypress", keyPress, false);
        }
        init_func();
        func_event = event_func;
    }

    /**
     * Return the canvas context
     */
    function getContext() {
        return ctx;
    }

    /**
     * Return the size of the canvas as [x, y]
     */
    function getSize() {
        return [pcanvas.width, pcanvas.height];
    }

    return {
        clear,
        init,
        getContext,
        getSize
    };
}());