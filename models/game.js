let game = function (gameID, playerA, playerB) {
    this.playerA = playerA;
    this.playerB = playerB;
    this.id = gameID;
    this.gameState = "0 JOINT"; //"A" means A won, "B" means B won, "ABORTED" means the game was aborted
    this.addPlayer = function (p) {
        console.assert(p instanceof Object, "%s: Expecting an object (WebSocket), got a %s", arguments.callee.name, typeof p);

        if (this.gameState != "0 JOINT" && this.gameState != "1 JOINT") {
            return new Error("Invalid call to addPlayer, current state is %s", this.gameState);
        }
    }
};

module.exports = game;
