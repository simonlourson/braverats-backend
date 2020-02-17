import { v4 as uuid } from 'uuid';
import { Player } from './player';

export class Lobby {

  public static maxPlayers: number = 2;

  public uuid: string;
  public players: Player[];
  public cardRows: number[][];
  public currentRound: number;

  public get obfuscatedCardRows(): number[][] {
    let returnValue: number[][] = [];

    for (let cardRowIndex = 0; cardRowIndex < this.cardRows.length; cardRowIndex++) {
      returnValue[cardRowIndex] = [];

      for (let cardIndex = 0; cardIndex < this.cardRows[cardRowIndex].length; cardIndex++) {
        returnValue[cardRowIndex][cardIndex] = this.cardRows[cardRowIndex][cardIndex];

        if (returnValue[cardRowIndex][cardIndex] != -2 && cardIndex == this.currentRound) returnValue[cardRowIndex][cardIndex] = -1;
      }

      // Special case espion
      if (this.currentRound > 0 && this.cardRows[1 - cardRowIndex][this.currentRound - 1] == 2 && this.cardRows[cardRowIndex][this.currentRound - 1] != 5 && this.cardRows[cardRowIndex][this.currentRound - 1] != 2) 
        returnValue[cardRowIndex][this.currentRound] = this.cardRows[cardRowIndex][this.currentRound];
    }

    return returnValue;
  }

  constructor() {
    this.uuid = uuid();
    this.players = [];
    this.cardRows = [
      [-2, -2, -2, -2, -2, -2, -2, -2],
      [-2, -2, -2, -2, -2, -2, -2, -2]
    ];
    this.currentRound = 0;
  }

  public addPlayer(player: Player) {
    if (this.players.length >= Lobby.maxPlayers) throw new Error('Maximum number of players reached');

    this.players.push(player);
  }

  playCard(player: Player, value: number) {
    if (!player.waiting) throw new Error('Not waiting for this player to play a card');
    else {
      let indexToRemove = -1;
      for (let currentIndex = 0; currentIndex < player.remainingCards.length; currentIndex++)
        if (player.remainingCards[currentIndex] == value)
          indexToRemove = currentIndex;

      player.remainingCards.splice(indexToRemove, 1);
      this.cardRows[player.index][this.currentRound] = value;
      player.waiting = false;
      this.checkNextRound();
    }
  }

  checkNextRound() {
    let nextRound = true;
    for (let cardRowIndex = 0; cardRowIndex < this.cardRows.length; cardRowIndex++)
      if (this.cardRows[cardRowIndex][this.currentRound] == -2) nextRound = false;

    if (nextRound) {
      this.currentRound = this.currentRound + 1;

      for (let player of this.players) player.waiting = true;
    }
  }
}