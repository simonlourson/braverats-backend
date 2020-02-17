import { v4 as uuid } from 'uuid';

export class Player {
  public uuid: string;
  public name: string;
  public index: number;
  public nbGamesWon: number;
  public nbSetsWon: number;
  public waiting: boolean;

  public remainingCards: number[];


  constructor(playerName: string, playerIndex: number) {
    this.uuid = uuid();
    this.name = playerName;
    this.index = playerIndex;
    this.nbGamesWon = 0;
    this.nbSetsWon = 0;
    this.waiting = true;

    this.remainingCards = [];

    this.resetRemainingCards();
  }

  resetRemainingCards() {
    this.remainingCards = [0, 1, 2, 3, 4, 5, 6, 7];
  }
}