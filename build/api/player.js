"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var Player = /** @class */ (function () {
    function Player(playerName, playerIndex) {
        this.uuid = uuid_1.v4();
        this.name = playerName;
        this.index = playerIndex;
        this.nbGamesWon = 0;
        this.nbSetsWon = 0;
        this.waiting = true;
        this.remainingCards = [];
        this.resetRemainingCards();
    }
    Player.prototype.resetRemainingCards = function () {
        this.remainingCards = [0, 1, 2, 3, 4, 5, 6, 7];
    };
    return Player;
}());
exports.Player = Player;
