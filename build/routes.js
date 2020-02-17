"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var lobby_controller_1 = require("./api/lobby-controller");
var Routes = /** @class */ (function () {
    function Routes() {
        this.lobbyController = new lobby_controller_1.LobbyController();
    }
    Routes.prototype.routes = function (app) {
        console.log('routes');
        app.route("/api/createLobby").post(this.lobbyController.createLobby.bind(this.lobbyController));
        app.route("/api/joinLobby").post(this.lobbyController.joinLobby.bind(this.lobbyController));
        app.route("/api/lobbyStatus").post(this.lobbyController.lobbyStatus.bind(this.lobbyController));
        app.route("/api/changeName").post(this.lobbyController.changeName.bind(this.lobbyController));
        app.route("/api/playCard").post(this.lobbyController.playCard.bind(this.lobbyController));
        //app.route("/api/getblueprintsSecure").get(auth, this.uploadBlueprintController.getBlueprints);
        //app.route("/api/uploadblueprint").post(auth, this.uploadBlueprintController.uploadBlueprint);
        //app.route("/api/likeblueprint").post(auth, this.uploadBlueprintController.likeBlueprint);
        app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
        app.get('*', function (req, res) {
            res.sendFile(path_1.default.join(__dirname, 'public', 'index.html'));
        });
    };
    return Routes;
}());
exports.Routes = Routes;
