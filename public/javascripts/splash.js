//save user's name, which was entered to the input box
var savePlayerName = function () {
    var text_to_save = document.getElementById('playerName').value;

    //if the input field is not empty
    if (text_to_save !== "") {
        localStorage.setItem("player_name", text_to_save); // save the item
        alert("Hello " + retrievePlayerName() + "! Click OK to get started with placing your ships!");
        window.open("game.html", "_self");
    } else if (text_to_save === "") {
        alert("Please add your name to the input field to get started.");
    }
};

//returns the player's name which was saved to the localStorage
var retrievePlayerName = function () {
    return localStorage.getItem("player_name"); // retrieve
};

//using web sockets
var socket = new WebSocket("ws://localhost:3000");

socket.onmessage = function (event) {
    document.getElementById("hello").innerHTML = event.data;
};
socket.onopen = function () {
    socket.send("Hello from the client!");
    document.getElementById("hello").innerHTML = "Sending a first message to the server ...";
};