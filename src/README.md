# Common modules

This directory contains modules that are used by all the games implemented.

## Button object

A button object represents an area of the canvas on which a button appears.
Attributes of a button are:
* font
* text
* text_loc -- [x, y] coordinates of text within the button
* corner -- [x, y] coordinates of the upper left corner
* dims -- [x, y] values of the size of the button

## sessionStorage data

* event_type -- Last canvas event (either "Key" or "Mouse")
* X_value -- X coordinate of the last mouse click
* Y_value -- Y coordinate of the last mouse click
* Last_keypress -- Last keyboard character entered.
* players -- Array of players that were picked.

Copyright 2020, Warren Usui