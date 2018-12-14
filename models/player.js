let Player = function (socket, playerID) {
    this.socket = socket;
    this.playerID = playerID;
};

module.exports = Player;