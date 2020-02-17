import { Request, Response } from "express";
import { Lobby } from "./lobby";
import { LobbyJoined, LobbyJoinRequest, LobbyStatus, LobbyStatusRequest, LobbyCreateRequest, NameChangeRequest, LobbyStatusPlayer, PlayCardRequest } from "./shared/responses";
import { Player } from "./player";

export class LobbyController {

  private static lobbies: Lobby[] = [];
  private static removeUnusedLobbies() {
    // TODO
  }

  public createLobby(req: Request, res: Response) {
    console.log('createLobby');
    console.log(req.body);

    let lobbyCreateRequest: LobbyCreateRequest = req.body;

    let newLobby = new Lobby();
    let newPlayer = new Player(lobbyCreateRequest.playerName, 0);
    newLobby.addPlayer(newPlayer);

    

    LobbyController.lobbies.push(newLobby);
    LobbyController.removeUnusedLobbies();

    this.sendLobbyJoined(req, res, newLobby.uuid, newPlayer.uuid, 0);
  }

  public joinLobby(req: Request, res: Response) {
    console.log('joinLobby');

    let lobbyJoinRequest: LobbyJoinRequest = req.body;
    

    let lobby = this.getLobby(lobbyJoinRequest.lobbyUuid);

    let newPlayer = new Player(lobbyJoinRequest.playerName, lobby.players.length);
    lobby.addPlayer(newPlayer);

    this.sendLobbyJoined(req, res, lobby.uuid, newPlayer.uuid, 1);
  }

  public lobbyStatus(req: Request, res: Response) {
    let lobbyStatusRequest: LobbyStatusRequest = req.body;

    let lobby = this.getLobby(lobbyStatusRequest.lobbyUuid);
    let player = this.getPlayer(lobbyStatusRequest.lobbyUuid, lobbyStatusRequest.playerUuid);
    this.processLobbyStatus(req, res, lobby, player);
  }

  public changeName(req: Request, res: Response) {
    console.log('changeName')

    let nameChangeRequest: NameChangeRequest = req.body;

    let player = this.getPlayer(nameChangeRequest.lobbyUuid, nameChangeRequest.playerUuid);
    player.name = nameChangeRequest.playerName;

    res.status(200).json({});
  }

  public playCard(req: Request, res: Response) {
    console.log('playCard')

    let playCardRequest: PlayCardRequest = req.body;

    let lobby = this.getLobby(playCardRequest.lobbyUuid);
    let player = this.getPlayer(playCardRequest.lobbyUuid, playCardRequest.playerUuid);

    this.processPlayCard(req, res, lobby, player, playCardRequest.value);
  }

  private getLobby(lobbyUuid: string): Lobby {
    for (let lobby of LobbyController.lobbies) {
      if (lobby.uuid == lobbyUuid) {
        return lobby;
      }
    }

    throw new Error('Lobby not found')
  }

  private getPlayer(lobbyUuid: string, playerUuid: string) {
    let lobby = this.getLobby(lobbyUuid);

    for (let player of lobby.players)
      if (player.uuid == playerUuid)
        return player;

    throw new Error('Player not found')
  }

  private sendLobbyJoined(req: Request, res: Response, lobbyUuid: string, playerUuid: string, playerIndex: number) {
    let lobbyJoined: LobbyJoined = {
      lobbyUuid: lobbyUuid,
      playerUuid: playerUuid,
      playerIndex: playerIndex
    }

    res.status(200).json(lobbyJoined);
  }

  private processLobbyStatus(req: Request, res: Response, lobby: Lobby, requestingPlayer: Player) {
    let lobbyStatus: LobbyStatus = {
      lobbyUuid: lobby.uuid,
      players: [],
      cardRows: lobby.obfuscatedCardRows
    }

    for (let player of lobby.players) {
      let lobbyStatusPlayer: LobbyStatusPlayer = {
        playerName: player.name,
        nbGamesWon: player.nbGamesWon,
        nbSetsWon: player.nbSetsWon,
        waiting: player.waiting
      };

      lobbyStatusPlayer.remainingCards = [];
      for (let card of player.remainingCards)
        if (player == requestingPlayer) lobbyStatusPlayer.remainingCards.push(card);
        else lobbyStatusPlayer.remainingCards.push(-1);

      lobbyStatus.players.push(lobbyStatusPlayer);
    }
      
    
    res.status(200).json(lobbyStatus);
  }

  private processPlayCard(req: Request, res: Response, lobby: Lobby, requestingPlayer: Player, cardValue: number) {
    lobby.playCard(requestingPlayer, cardValue);
    this.processLobbyStatus(req, res, lobby, requestingPlayer);
    
  }
}