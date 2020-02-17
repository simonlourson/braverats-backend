"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lobby_1 = require("./lobby");
var player_1 = require("./player");
var LobbyController = /** @class */ (function () {
    function LobbyController() {
    }
    LobbyController.removeUnusedLobbies = function () {
        // TODO
    };
    LobbyController.prototype.createLobby = function (req, res) {
        console.log('createLobby');
        console.log(req.body);
        var lobbyCreateRequest = req.body;
        var newLobby = new lobby_1.Lobby();
        var newPlayer = new player_1.Player(lobbyCreateRequest.playerName, 0);
        newLobby.addPlayer(newPlayer);
        LobbyController.lobbies.push(newLobby);
        LobbyController.removeUnusedLobbies();
        this.sendLobbyJoined(req, res, newLobby.uuid, newPlayer.uuid, 0);
    };
    LobbyController.prototype.joinLobby = function (req, res) {
        console.log('joinLobby');
        var lobbyJoinRequest = req.body;
        var lobby = this.getLobby(lobbyJoinRequest.lobbyUuid);
        var newPlayer = new player_1.Player(lobbyJoinRequest.playerName, lobby.players.length);
        lobby.addPlayer(newPlayer);
        this.sendLobbyJoined(req, res, lobby.uuid, newPlayer.uuid, 1);
    };
    LobbyController.prototype.lobbyStatus = function (req, res) {
        var lobbyStatusRequest = req.body;
        var lobby = this.getLobby(lobbyStatusRequest.lobbyUuid);
        var player = this.getPlayer(lobbyStatusRequest.lobbyUuid, lobbyStatusRequest.playerUuid);
        this.processLobbyStatus(req, res, lobby, player);
    };
    LobbyController.prototype.changeName = function (req, res) {
        console.log('changeName');
        var nameChangeRequest = req.body;
        var player = this.getPlayer(nameChangeRequest.lobbyUuid, nameChangeRequest.playerUuid);
        player.name = nameChangeRequest.playerName;
        res.status(200).json({});
    };
    LobbyController.prototype.playCard = function (req, res) {
        console.log('playCard');
        var playCardRequest = req.body;
        var lobby = this.getLobby(playCardRequest.lobbyUuid);
        var player = this.getPlayer(playCardRequest.lobbyUuid, playCardRequest.playerUuid);
        this.processPlayCard(req, res, lobby, player, playCardRequest.value);
    };
    LobbyController.prototype.getLobby = function (lobbyUuid) {
        for (var _i = 0, _a = LobbyController.lobbies; _i < _a.length; _i++) {
            var lobby = _a[_i];
            if (lobby.uuid == lobbyUuid) {
                return lobby;
            }
        }
        throw new Error('Lobby not found');
    };
    LobbyController.prototype.getPlayer = function (lobbyUuid, playerUuid) {
        var lobby = this.getLobby(lobbyUuid);
        for (var _i = 0, _a = lobby.players; _i < _a.length; _i++) {
            var player = _a[_i];
            if (player.uuid == playerUuid)
                return player;
        }
        throw new Error('Player not found');
    };
    LobbyController.prototype.sendLobbyJoined = function (req, res, lobbyUuid, playerUuid, playerIndex) {
        var lobbyJoined = {
            lobbyUuid: lobbyUuid,
            playerUuid: playerUuid,
            playerIndex: playerIndex
        };
        res.status(200).json(lobbyJoined);
    };
    LobbyController.prototype.processLobbyStatus = function (req, res, lobby, requestingPlayer) {
        var lobbyStatus = {
            lobbyUuid: lobby.uuid,
            players: [],
            cardRows: lobby.obfuscatedCardRows
        };
        for (var _i = 0, _a = lobby.players; _i < _a.length; _i++) {
            var player = _a[_i];
            var lobbyStatusPlayer = {
                playerName: player.name,
                nbGamesWon: player.nbGamesWon,
                nbSetsWon: player.nbSetsWon,
                waiting: player.waiting
            };
            lobbyStatusPlayer.remainingCards = [];
            for (var _b = 0, _c = player.remainingCards; _b < _c.length; _b++) {
                var card = _c[_b];
                if (player == requestingPlayer)
                    lobbyStatusPlayer.remainingCards.push(card);
                else
                    lobbyStatusPlayer.remainingCards.push(-1);
            }
            lobbyStatus.players.push(lobbyStatusPlayer);
        }
        res.status(200).json(lobbyStatus);
    };
    LobbyController.prototype.processPlayCard = function (req, res, lobby, requestingPlayer, cardValue) {
        lobby.playCard(requestingPlayer, cardValue);
        this.processLobbyStatus(req, res, lobby, requestingPlayer);
    };
    LobbyController.lobbies = [];
    return LobbyController;
}());
exports.LobbyController = LobbyController;
