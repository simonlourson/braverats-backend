export interface LobbyJoined {
  lobbyUuid: string;
  playerUuid: string;
  playerIndex: number;
}

export interface LobbyCreateRequest {
  playerName: string;
}

export interface LobbyJoinRequest {
  lobbyUuid: string;
  playerName: string;
}

export interface NameChangeRequest {
  lobbyUuid: string;
  playerUuid: string;
  playerName: string;
}

export interface LobbyStatusRequest {
  lobbyUuid: string;
  playerUuid: string;
}

export interface PlayCardRequest {
  lobbyUuid: string;
  playerUuid: string;
  value: number;
}

export interface LobbyStatus {
  lobbyUuid: string;
  players: LobbyStatusPlayer[];
  cardRows: number[][];
}

export enum LobbyStatusCode {
  watingForConnection,
  waitingForPlay,
  waiting
}

export interface LobbyStatusPlayer {
  playerName: string;
  nbGamesWon: number;
  nbSetsWon: number;
  remainingCards?: number[];
  waiting: boolean;
}