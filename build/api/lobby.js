"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var Lobby = /** @class */ (function () {
    function Lobby() {
        this.uuid = uuid_1.v4();
        this.players = [];
        this.cardRows = [
            [-2, -2, -2, -2, -2, -2, -2, -2],
            [-2, -2, -2, -2, -2, -2, -2, -2]
        ];
        this.currentRound = 0;
    }
    Object.defineProperty(Lobby.prototype, "obfuscatedCardRows", {
        get: function () {
            var returnValue = [];
            for (var cardRowIndex = 0; cardRowIndex < this.cardRows.length; cardRowIndex++) {
                returnValue[cardRowIndex] = [];
                for (var cardIndex = 0; cardIndex < this.cardRows[cardRowIndex].length; cardIndex++) {
                    returnValue[cardRowIndex][cardIndex] = this.cardRows[cardRowIndex][cardIndex];
                    if (returnValue[cardRowIndex][cardIndex] != -2 && cardIndex == this.currentRound)
                        returnValue[cardRowIndex][cardIndex] = -1;
                }
                // Special case espion
                if (this.currentRound > 0 && this.cardRows[1 - cardRowIndex][this.currentRound - 1] == 2 && this.cardRows[cardRowIndex][this.currentRound - 1] != 5 && this.cardRows[cardRowIndex][this.currentRound - 1] != 2)
                    returnValue[cardRowIndex][this.currentRound] = this.cardRows[cardRowIndex][this.currentRound];
            }
            return returnValue;
        },
        enumerable: true,
        configurable: true
    });
    Lobby.prototype.addPlayer = function (player) {
        if (this.players.length >= Lobby.maxPlayers)
            throw new Error('Maximum number of players reached');
        this.players.push(player);
    };
    Lobby.prototype.playCard = function (player, value) {
        if (!player.waiting)
            throw new Error('Not waiting for this player to play a card');
        else {
            var indexToRemove = -1;
            for (var currentIndex = 0; currentIndex < player.remainingCards.length; currentIndex++)
                if (player.remainingCards[currentIndex] == value)
                    indexToRemove = currentIndex;
            player.remainingCards.splice(indexToRemove, 1);
            this.cardRows[player.index][this.currentRound] = value;
            player.waiting = false;
            this.checkNextRound();
        }
    };
    Lobby.prototype.checkNextRound = function () {
        var nextRound = true;
        for (var cardRowIndex = 0; cardRowIndex < this.cardRows.length; cardRowIndex++)
            if (this.cardRows[cardRowIndex][this.currentRound] == -2)
                nextRound = false;
        if (nextRound) {
            this.currentRound = this.currentRound + 1;
            for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
                var player = _a[_i];
                player.waiting = true;
            }
        }
    };
    Lobby.maxPlayers = 2;
    return Lobby;
}());
exports.Lobby = Lobby;
