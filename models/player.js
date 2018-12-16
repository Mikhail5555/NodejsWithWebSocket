let Player = function (playerId, socket) {
    this.socket = socket;
    this.playerId = playerId;
    this.opponent = null;
    this.wins = 0;
    this.plays = 0;

    this.addOpponent = (player) => {
        if(this.playerId === player.playerId) {
            console.error("Trying to add same player as opponent");
        }
        this.opponent = player;
        this.plays++;
    }

};

module.exports = Player;