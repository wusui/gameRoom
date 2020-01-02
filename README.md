# General html board game development directory.

The html page for each application defines a gameboard canvas which is used
for each application.  Each application runs by just going to each corresponding
HTML page via a browser.

src/handlePage.js sets up the mouse and keyboard adapters for each game.

Almost all game data is passed between modules by adding attributes to the
sessionStorage object.

Each js file should contain one var function that encloses all the code in
the file.  That function name should be the same as the name of the js
module.  This acts as a namespace and limits new globals to just be
objects with the same name as the js file.

The src directory contains js code that is common to all directories.

Every other directory should be for a specific application.  The code in here
should include the html pages, css files, and js files used by that
application.

The README file in each directory should document the information that will
be stored in the sessionStore object by js files in that directory.

## Author

Warren Usui (warrenusui@gmail.com)

## License

This project is licensed under the MIT License

Copyright 2020, Warren Usui
