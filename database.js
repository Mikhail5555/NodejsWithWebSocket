const fs = require('fs');
const Player = require('./models/player');
const config = require('./config/config');
let users = {};

function loadDatabase() {
    try {
        let databaseFile = JSON.parse(fs.readFileSync(config.database.fileLocation, 'utf8'));
        databaseFile.users.forEach((user) => {
            if(user.playerId) {
                let player = new Player(user.playerId);
                player.wins = user.wins;
                player.plays = user.plays;
                users[user.playerId] = player;
            }
        });
    } catch (e) {
        console.error("Unable to load database file");
    }

}

function saveDatabase() {
    let json = {};
    json.users = [];

    console.log("Saving %s player(s)", getPlayerCount());

    for(let key in users) {
        let user = users[key];
        json.users.push({playerId: user.playerId, wins: user.wins, plays: user.plays});
    }
    console.log(json);
    fs.writeFileSync(config.database.fileLocation, JSON.stringify(json), 'utf8');
}

loadDatabase();

function addUser(playerId, socket) {
    if(!users[playerId]) {
        addNewUser(playerId, socket);
        saveDatabase();
    } else {
        users[playerId].socket = socket;
    }
}

function addNewUser(playerId, socket) {
    console.log("Added player %s to database", playerId);
    users[playerId] = new Player(playerId, socket);
}

function getPlayer(playerId) {
    return users[playerId];
}

function removePlayer(playerId) {
    delete users[playerId];
}

function getPlayerCount() {
    let size = 0;
    for (let key in users) {
        if(users.hasOwnProperty(key)) size++;
    }
    return size;
}

module.exports = {addUser, getPlayer, removePlayer, getPlayerCount};
