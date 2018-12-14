// (function(exports){

//     /* 
//      * 1. Client to server: game is complete, the winner is ... 
//      */

//     /*
//      * 2. Server to client: abort game (e.g. if second player exited the game) 
//      */

//     /*
//      * 3. Server to client A and client B: place your ships
//      */
    
//     /*
//      *  4. Server to client: set as player A 
//      */
//     exports.T_PLAYER_TYPE = "PLAYER-TYPE";
//     exports.O_PLAYER_A = {                            
//         type: exports.T_PLAYER_TYPE,
//         data: "A"
//     };
//     exports.S_PLAYER_A = JSON.stringify(exports.O_PLAYER_A);

//     /* 
//      * 5. Server to client: set as player B 
//      */
//     exports.O_PLAYER_B = {                            
//         type: exports.T_PLAYER_TYPE,
//         data: "B"
//     };
//     exports.S_PLAYER_B = JSON.stringify(exports.O_PLAYER_B);

//     /* 
//      * 6. Player A to server OR Player B to server: selected cell to hit
//      */


//     /* 
//      * server to Player A or Player B: guessed/sunken ship
//      */
//     exports.T_MAKE_A_GUESS = "MAKE-A-GUESS";         
//     exports.O_MAKE_A_GUESS = {
//         type: exports.T_MAKE_A_GUESS,
//         data: null
//     };
//     //exports.S_MAKE_A_GUESS does not exist, as data needs to be set

//     /* 
//      * Server to Player A AND B: game over with result won/loss 
//      */
//     exports.T_GAME_OVER = "GAME-OVER";              
//     exports.O_GAME_OVER = {
//         type: exports.T_GAME_OVER,
//         data: null
//     };


// }(typeof exports === "undefined" ? this.Messages = {} : exports));
// //if exports is undefined, we are on the client; else the server