import { Request, Response, Application } from "express";
import express from 'express';
import path from 'path';
import { LobbyController } from "./api/lobby-controller";


export class Routes {
  public lobbyController = new LobbyController();

  public routes(app: Application): void {

    console.log('routes')
    app.route("/api/createLobby").post(this.lobbyController.createLobby.bind(this.lobbyController));
    app.route("/api/joinLobby").post(this.lobbyController.joinLobby.bind(this.lobbyController));
    app.route("/api/lobbyStatus").post(this.lobbyController.lobbyStatus.bind(this.lobbyController));
    app.route("/api/changeName").post(this.lobbyController.changeName.bind(this.lobbyController));
    app.route("/api/playCard").post(this.lobbyController.playCard.bind(this.lobbyController));


    //app.route("/api/getblueprintsSecure").get(auth, this.uploadBlueprintController.getBlueprints);
    //app.route("/api/uploadblueprint").post(auth, this.uploadBlueprintController.uploadBlueprint);
    //app.route("/api/likeblueprint").post(auth, this.uploadBlueprintController.likeBlueprint);

    app.use(express.static(path.join(__dirname, "public")));
    app.get('*', function(req, res){
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    
  }
}