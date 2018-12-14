/* var startGame = function() {
    alert("You are starting the game!");

    //TODO
    //iff all ships have been placed then:
    window.open("game.html", "_self");

} */

//global variables to store essential data about the board
var rows = 10;
var cols = 10;
var tileSize = 50;
var gameBoardContainer;


// get the container for the board
var gameBoardContainer1 = document.getElementById("board1");

//var gameBoardContainer2 = document.getElementById("board2");


function createBoardArray() {

    //create 2D array for internal representation of the board
    var boardArray = Array(rows);

    for (var i = 0; i < rows; i++) {
        boardArray[i] = Array(cols);

    }

    for (let i = 0; i < boardArray.length; i++) {
        for (let e = 0; e < boardArray[i].length; e++) {
            boardArray[i][e] = 0;
        }
    }

    return boardArray;
};

var boardArray = createBoardArray();

//create the two grids in the html
makeGrid(gameBoardContainer1, "a");
//makeGrid(gameBoardContainer2, "b");


//render the tiles based on the internal representation
//0: free/empty tile
//0<: ship is there, each ship will have a different number - a ship that spans through
//multiple tiles will have its number on multiple tiles
//<0: surronding of a ship: ship number with a minus, identifies the each ships' surronding 
//separately
//modifies the class of the tile based on the internal state of the board
function renderTilesFromArray(boardArray, idString) {
    for (var c = 0; c < boardArray.length; c++) {
        for (var r = 0; r < boardArray[c].length; r++) {

            var curTileId = idString + c + r;
            var curTile = document.getElementById(curTileId);


            if (boardArray[c][r] == 0 || boardArray[c][r] == undefined) {
                curTile.setAttribute("class", "yourBoardCell");


            } else if (boardArray[c][r] > 0) {
                curTile.setAttribute("class", "placedShip");

            } else if (boardArray[c][r] < 0) {
                curTile.setAttribute("class", "placedShipSurronding");

            }


        }
    }

};

function makeGrid(gameBoardContainer, idString) {
    //make the grid
    for (var i = 0; i < boardArray.length; i++) {
        for (var e = 0; e < boardArray[i].length; e++) {

            //create new html element (div) and add it to the gameboard
            var tile = document.createElement("div");
            gameBoardContainer.appendChild(tile);

            //add unique ids for each element based on row and column numbers
            tile.id = idString + i + e;

            tile.setAttribute("class", "yourBoardCell");

            //set each grid tile's coordinates: multiples of the current row or column number
            var topPosition = e * tileSize;
            var leftPosition = i * tileSize;


            tile.onclick = function () {
                placeAShip(this.id)
            };

            // use CSS absolute positioning to place each grid tile on the page
            tile.style.top = topPosition + 'px';
            tile.style.left = leftPosition + 'px';

        }

    }

};


// ship objects
// Initializing a class 
class ShipObject {
    constructor(shipID, shipSize, shipTiles, surroundingTiles, hitTiles, verticalOrientation) {
        this.shipID = shipID;
        this.shipSize = shipSize;
        this.shipTiles = shipTiles;
        this.surroundingTiles = surroundingTiles;
        this.hitTiles = hitTiles;
        this.verticalOrientation = verticalOrientation;
    }
}

//ititialise all the user's ships (total 8)

var shipsPlaced = 0;
//var allShipIDs = [2,3,4,5,6,7,8,9]
//declare the (shipID, length_of_ship) array
var allShipProperties = [[2, 5], [3, 4], [4, 3], [5, 3], [6, 2], [7, 2], [8, 1], [9, 1]]


//how to place a ship
/*

1. we get the id of the cell which was clicked on the board

2. we have a global variable which determines if the ship is to be placed horizontally or vertically

3. we have the 2D array of the board: with positive numbers where there is a ship, 
negative where it's the surrounding of a ship, zero where it is empty

4a. we need to calculate the list of the tiles where the ship would be placed
4b: need to calculate the tiles which are the surrondings of the to be placed ship

5. rules to check:
5a: a ship can be placed only on zeros
5b: surroundings of ships can overlap
5c: surroundings of ships cannot cover other ships (follows from the previous two)
5d: ships can be placed only on the board

if click is on valid spot:
6: place the ship
6a: modify the 2d array
6b: render the html file

if not:
7: alert user


Notes: all checks/calculations should be done on the 2D array, once we find the spot to be correct we render the tiles to change their color
If we find the click to be invalid, then alert the user with this without rerendering anything


*/
//returns the start coordinat pair from tileid(String) format t31
//where 3 is the column and 1 is the row
function calculateStartCoordinate(tileId) {
    column = parseInt(tileId.charAt(1));
    row = parseInt(tileId.charAt(2));

    return [column, row];

};


//returns an array of the ship's tile coordinates, where it would be placed based on the
//provided coordinate
//startCoordinate: [col, row]
//length: integer value: num of tiles the ship should take
function calculateVerticalShipTileCoordinates(startCoordinate, length) {

    var col = startCoordinate[0];
    var row = startCoordinate[1];
    var shipCoordinates = [];

    for (var i = 0; i < length; i++) {

        var newRow = row;
        newRow += i;

        var currentXY = [col, newRow];
        shipCoordinates.push(currentXY);

    }
    ;

    return shipCoordinates;

};

function calculateHorizontalShipTileCoordinates(startCoordinate, length) {
    var col = startCoordinate[0];
    var row = startCoordinate[1];
    var shipCoordinates = [];

    for (var i = 0; i < length; i++) {
        var newCol = col;
        newCol += i;

        var currentXY = [newCol, row];
        shipCoordinates.push(currentXY);
    }
    ;

    return shipCoordinates;


};


//shipCoordinates: array of coordinates of proposed ship coordinates
//returns an array of the coordinates of the surrounding tiles
//first coordinate should be the leftmost, last coordinate the rightmost
function calculateHorizontalShipSurroundingTileCoordinates(shipCoordinates) {

    var shipRow = shipCoordinates[0][1];
    var surrondingCoordinates = [];

    var belowRow = shipRow - 1;
    var aboveRow = shipRow + 1;

    var leftCol = shipCoordinates[0][0] - 1;
    var rightCol = shipCoordinates[shipCoordinates.length - 1][0] + 1;

    //tiles right above and below the ship
    for (var i = 0; i < shipCoordinates.length; i++) {

        var curCol = shipCoordinates[i][0];
        var aboveXY = [curCol, aboveRow];
        var belowXY = [curCol, belowRow];

        surrondingCoordinates.push(aboveXY);
        surrondingCoordinates.push(belowXY);
    }


    //tiles on the left
    surrondingCoordinates.push([leftCol, aboveRow]);
    surrondingCoordinates.push([leftCol, shipRow]);
    surrondingCoordinates.push([leftCol, belowRow]);

    //tiles on the right
    surrondingCoordinates.push([rightCol, aboveRow]);
    surrondingCoordinates.push([rightCol, shipRow]);
    surrondingCoordinates.push([rightCol, belowRow]);

    return surrondingCoordinates;

};


function calculateVerticalShipSurroundingTileCoordinates(shipCoordinates) {

    var shipCol = shipCoordinates[0][0];
    var surrondingCoordinates = [];

    var prevCol = shipCol - 1;
    var nextCol = shipCol + 1;

    var rowAbove = shipCoordinates[0][1] - 1;
    var rowBelow = shipCoordinates[shipCoordinates.length - 1][1] + 1;

    //tiles right next to the ship on the right and on the left
    for (var i = 0; i < shipCoordinates.length; i++) {

        var curRow = shipCoordinates[i][1];
        var leftXY = [prevCol, curRow];
        var rightXY = [nextCol, curRow];

        surrondingCoordinates.push(leftXY);
        surrondingCoordinates.push(rightXY);
    }


    //tiles on top
    surrondingCoordinates.push([prevCol, rowAbove]);
    surrondingCoordinates.push([shipCol, rowAbove]);
    surrondingCoordinates.push([nextCol, rowAbove]);

    //tiles in the bottom
    surrondingCoordinates.push([prevCol, rowBelow]);
    surrondingCoordinates.push([shipCol, rowBelow]);
    surrondingCoordinates.push([nextCol, rowBelow]);

    return surrondingCoordinates;

};


//returns true if the ship's coordinates are on the board
//false if any of the coordinates are outside of the board
//board: 2d array of board, at least 2x2
function checkIfShipIsOnBoard(shipCoordinates, board) {


    //indexing starts at 5 if the length is 10
    for (var i = 0; i < shipCoordinates.length; i++) {
        for (var j = 0; j < shipCoordinates[i].length; j++) {

            //column is negative
            if (shipCoordinates[i] < 0) {
                return false;
            }

            //row is negative
            if (shipCoordinates[i][j] < 0) {
                return false;
            }

            //column is outside of the board's max column number
            if (shipCoordinates[i] >= board.length) {
                return false;
            }

            //column is outside of the board's max row number
            if (shipCoordinates[i][j] >= board[0].length) {
                return false;
            }

        }
    }

    return true;


};

//returns true if the given ship coordinates are all zero on the board
//false otherwise
//board: 2D array of the board
//assumes that the ship coordinates are on the board
function checkIfShipIsOnZeros(shipCoordinates, board) {

    //iterate through all the ship tile coordinates
    for (var i = 0; i < shipCoordinates.length; i++) {

        //get column
        var curCol = shipCoordinates[i][0];

        //get row
        var curRow = shipCoordinates[i][1];

        //alert(curCol + ", "+ curRow);
        if (board[curCol][curRow] !== 0) {
            return false;
        }

    }

    return true;


};

//removes all the coordinates from the surrounding coordinates which are outside
//of the board
//returns the cleaned shipSurrounding Coordinates which are on the board
function removeSurroundingsOutsideTheBoard(shipSurroundingCoordinates, board) {

    var shipSurroundingCoordinatesOnBoard = [];
    //iterate through the surrounding cell coorinates
    for (var i = 0; i < shipSurroundingCoordinates.length; i++) {

        //if it's on the board then add it to the new array which will be returned
        if (isCoordinateOnBoard(shipSurroundingCoordinates[i], board)) {
            shipSurroundingCoordinatesOnBoard.push(shipSurroundingCoordinates[i]);
        }
    }

    return shipSurroundingCoordinatesOnBoard;


};

//returns true if the given coordinate is contained in the board
//false otherwise
//coordinate [col, row]
//board: [[],[],[]]
function isCoordinateOnBoard(coordinate, board) {
    var col = coordinate[0];
    var row = coordinate[1];

    if (col < 0 || row < 0) {
        return false;
    }

    if (col >= board.length) {
        return false;
    }

    if (row >= board[col].length) {
        return false;
    }

    return true;

};

//modifies the board: puts the shipId as value to the board's coordinates which
//match with the shipCoordinates
function putShipOnBoard(shipId, shipCoordinates, board) {

    for (var i = 0; i < shipCoordinates.length; i++) {
        var col = shipCoordinates[i][0];
        var row = shipCoordinates[i][1];
        board[col][row] = shipId;
    }


    return board;

};

//modifies the board: puts the shipId*(-1) as value to the board's coordinates which
//match with the shipSurroundingCoordinates
function putShipSurroundingsOnBoard(shipId, shipSurroundingCoordinates, board) {

    var surId = -1 * shipId;

    for (var i = 0; i < shipSurroundingCoordinates.length; i++) {
        var col = shipSurroundingCoordinates[i][0];
        var row = shipSurroundingCoordinates[i][1];
        board[col][row] = surId;
    }


    return board;

};

//alerts user that she cannot place a ship here
function cannotPlaceShipHere() {
    alert("Sorry but you cannot place a ship here. Try elsewhere.");
};


function placeAShip(tileId) {
    //check whether there are any ships left to place
    if (shipsPlaced < allShipProperties.length) {

        //get ship ID
        currentID = allShipProperties[shipsPlaced][0];
        //get ship size
        currentSize = allShipProperties[shipsPlaced][1];

        //get coordinates of the tile which was clicked
        var startXY = calculateStartCoordinate(tileId);

        //if global variable is currently true
        if (vertical) {

            //calculate vertical ship coordinates
            var shipCoordinates = calculateVerticalShipTileCoordinates(startXY, currentSize);

            //check if ship is on the board
            if (!checkIfShipIsOnBoard(shipCoordinates, boardArray)) {
                cannotPlaceShipHere();
                return;
            }

            //check if ship can be placed here - no other ships are in place
            if (!checkIfShipIsOnZeros(shipCoordinates, boardArray)) {
                cannotPlaceShipHere();
                return;
            }

            //we get here if ship can be placed at the given location
            //take care of the surrounding tiles

            //calculate the surrounding tile coordinates
            var surroundingTiles = calculateVerticalShipSurroundingTileCoordinates(shipCoordinates);

            //remove Surroundings Outside of The Board
            var surroundingTiles = removeSurroundingsOutsideTheBoard(surroundingTiles, boardArray);

            //all set
            //place the ship on the board - modify the array
            boardArray = putShipOnBoard(currentID, shipCoordinates, boardArray);


            //place the surrounding tiles
            boardArray = putShipSurroundingsOnBoard(currentID, surroundingTiles, boardArray);


            //rerender the html file
            renderTilesFromArray(boardArray, "a");


            //if horizontal
        } else {

            //calculate horizontal ship coordinates
            var shipCoordinates = calculateHorizontalShipTileCoordinates(startXY, currentSize);


            //check if ship is on the board
            if (!checkIfShipIsOnBoard(shipCoordinates, boardArray)) {
                cannotPlaceShipHere();
                return;
            }

            //check if ship can be placed here - no other ships are in place
            if (!checkIfShipIsOnZeros(shipCoordinates, boardArray)) {
                cannotPlaceShipHere();
                return;
            }

            //we get here if ship can be placed at the given location
            //take care of the surrounding tiles

            //calculate the surrounding tile coordinates
            var surroundingTiles = calculateHorizontalShipSurroundingTileCoordinates(shipCoordinates);

            //remove Surroundings Outside of The Board
            var surroundingTiles = removeSurroundingsOutsideTheBoard(surroundingTiles, boardArray);

            //all set
            //place the ship on the board - modify the array
            boardArray = putShipOnBoard(currentID, shipCoordinates, boardArray);


            //place the surrounding tiles
            boardArray = putShipSurroundingsOnBoard(currentID, surroundingTiles, boardArray);


            //rerender the html file
            renderTilesFromArray(boardArray, "a");

        }

        //increment ships placed to go to the next ship
        shipsPlaced += 1;
        {
            nextShip()
        }
        ;


    } else {
        alert("All your ships have been placed. Press start to start the game.");
    }
}


/* function placeCurrentShip(tileId) {
    //check whether there are any ships left to place
    if (shipsPlaced<allShipProperties.length){

        //get ship ID
        currentID = allShipProperties[shipsPlaced][0];
        //get ship size
        currentSize = allShipProperties[shipsPlaced][1]
        //get row and column of field clicked
        column = parseInt(tileId.charAt(1));
        row = parseInt(tileId.charAt(2));
        //initialise new array to hold the IDs of tiles where the ship is located
        currentShipTiles = new Array(currentSize);

        //initialize variable
        var validMove = true;

        if (vertical == true) {
            for (i = 0; i<currentSize; i++) {
                newRow = row + i;
                //alert(newTileId) if the row is out of range;
                if (newRow > 9) {
                    alert("Invalid operation, tile out of range.")
                    validMove = false;
                    break;
                } else {
                    newTileId = "t" + column.toString() + newRow.toString();
                    //append new tileID to the array of currentShipTiles
                    currentShipTiles[i] = newTileId;
                    // document.getElementById(newTileId).style.backgroundColor = 'red';
                }
            }
        //horizontal
        } else {
            for (var i = 0; i<currentSize; i++) {
                newColumn = column + i; 
                //alert(newTileId) if column is out of range;
                if (newColumn > 9) {
                    alert("Invalid operation, tile out of range.");
                    validMove = false;
                    break;
                } else {
                    newTileId = "t" + newColumn.toString() + row.toString();
                    //append new tileID to the array of currentShipTiles
                    currentShipTiles[i] = newTileId;
                    // document.getElementById(newTileId).style.backgroundColor = 'red';      
                    }
            }
        }
        

        if (validMove == true){
            currentShipSurroundingTiles = [];
            currentShipHitTiles = 0;
            
            // render tiles to red one by one
            for (i = 0; i<currentSize; i++) {
                
                var column = parseInt(currentShipTiles[i].charAt(1));
                var row =   parseInt(currentShipTiles[i].charAt(2));
                boardArray[row][column] = currentID;



                //if vertical
                if (vertical) {

                    //if first tile
                    if(i === 0) {

                        //cell above
                        var aboveRow = row-1;
                        var cellAboveTileId = "t"+column+aboveRow;
                        currentShipSurroundingTiles.push(cellAboveTileId);
                        
                        
                        //cell to the left (and above)
                        var colLeft = column-1;
                        var cellLeftTileId = "t"+colLeft+aboveRow;
                        currentShipSurroundingTiles.push(cellLeftTileId);


                        //cell to the right (and above)
                        var colRight = column+1;
                        var cellRightTileId = "t"+colRight+aboveRow;
                        currentShipSurroundingTiles.push(cellRightTileId);


                    //if last tile
                    } else if (i === currentSize-1) {

                        //cell below
                        var belowRow = row+1;
                        var cellBelowTileId = "t"+column+belowRow;
                        currentShipSurroundingTiles.push(cellBelowTileId);
                        
                        
                        //cell to the left (and below)
                        var colLeft = column-1;
                        var cellLeftTileId = "t"+colLeft+belowRow;
                        currentShipSurroundingTiles.push(cellLeftTileId);


                        //cell to the right (and below)
                        var colRight = column+1;
                        var cellRightTileId = "t"+colRight+belowRow;
                        currentShipSurroundingTiles.push(cellRightTileId);


                    
                    } 
                    //all inbetween tiles
                    //also top and bottom tiles' side tiles


                     //cell to the left 
                    var colLeft = column-1;
                    var cellLeftTileId = "t"+colLeft+row;
                    currentShipSurroundingTiles.push(cellLeftTileId);


                    //cell to the right 
                    var colRight = column+1;
                    var cellRightTileId = "t"+colRight+row;
                    currentShipSurroundingTiles.push(cellRightTileId);

                    


                //if horizontal
                } else {
        
                    //if first tile
                    if(i === 0) {
                        var colLeft = column-1;
                        var cellLeftTileId = "t"+colLeft+row;
                        currentShipSurroundingTiles.push(cellLeftTileId);

                        var aboveRow = row-1;
                        var cellLeftAboveTileId = "t"+colLeft+aboveRow;
                        currentShipSurroundingTiles.push(cellLeftAboveTileId);


                        var belowRow = row+1;
                        var cellLeftBelowTileId = "t"+colLeft+belowRow;
                        currentShipSurroundingTiles.push(cellLeftBelowTileId);


                    //if last tile
                    } else if (i === currentSize-1) {
                        var colRight = column+1;
                        var cellRightTileId = "t"+colRight+row;
                        currentShipSurroundingTiles.push(cellRightTileId);

                        var aboveRow = row-1;
                        var cellRightAboveTileId = "t"+colRight+aboveRow;
                        currentShipSurroundingTiles.push(cellRightAboveTileId);


                        var belowRow = row+1;
                        var cellRightBelowTileId = "t"+colRight+belowRow;
                        currentShipSurroundingTiles.push(cellRightBelowTileId);
    
                    
                    }  

                    //all inbetween tiles, also below and above tiles for first and last

                     //cell above
                    var aboveRow = row-1;
                    var cellAboveTileId = "t"+column+aboveRow;
                    currentShipSurroundingTiles.push(cellAboveTileId);

                    //cell below
                    var belowRow = row+1;
                    var cellBelowTileId = "t"+column+belowRow;
                    currentShipSurroundingTiles.push(cellBelowTileId);
 


                
                }


            }
            
            //filter out duplicants in currentShipSurroundingTiles
            function onlyUnique(value, index, self) { 
                return self.indexOf(value) === index;
            }
            currentShipSurroundingTiles = currentShipSurroundingTiles.filter(onlyUnique);
        
            //remove tiles from surroundingTiles which are part of the ship or 
            //which are outofBound
            for (i = 0; i<currentShipSurroundingTiles.length; i++){
                var column = currentShipSurroundingTiles[i].charAt(1);
                var row = currentShipSurroundingTiles[i].charAt(2);
                //remove elements out of Bound
                if ( currentShipSurroundingTiles[i].length > 3){
                    currentShipSurroundingTiles.splice(i,1);
                // remove elements which are part of the ship
                } else if (currentShipTiles.includes(currentShipSurroundingTiles[i])){
                    currentShipSurroundingTiles.splice(i,1);
                }

            }
            
            // update values of boardarray and disable tiles
            for (i = 0; i<currentShipSurroundingTiles.length; i++){
                var surColumn = currentShipSurroundingTiles[i].charAt(1);
                var surRow = currentShipSurroundingTiles[i].charAt(2);
                //var value = parseInt(currentID)*(-1);
                boardArray[surRow][surColumn] = -1;
                //document.getElementById(currentShipSurroundingTiles[i]).disabled = true;
            }
            newShip = new ShipObject(currentID,currentSize,currentShipTiles, currentShipSurroundingTiles, currentShipHitTiles, vertical)
            //increment ships placed to go to the next ship
            shipsPlaced += 1;
            renderTilesFromArray(boardArray, "a");
            {nextShip()};
        }
} else{
    alert("All your ships have been placed. Press start to start the game.");
}
} */

var vertical = false;

var rotate = function () {

    if (vertical == false) {
        vertical = true;
        document.getElementById("curRotation").innerHTML = "Current rotation is: Vertical";
        alert("Now you can place your ship vertically.");

    } else {
        vertical = false;
        document.getElementById("curRotation").innerHTML = "Current rotation is: Horizontal";
        alert("Now you can place your ship horizontally.");
    }
}


//display length of next ship
function nextShip() {

    //if there are no ships left
    if (shipsPlaced >= allShipProperties.length) {

        //then tell it to the user
        document.getElementById('nextShip').innerHTML = "No ships left.";

    } else {
        //otherwise update the field with the next ship's length
        var nextShipLength = "Next ship's length is " + allShipProperties[shipsPlaced][1];
        document.getElementById('nextShip').innerHTML = nextShipLength;
    }

};
