import { CardEntity } from "./card.entity";
import { UIEntity } from "./ui.entity";

export class PlayerEntity {
  static PLAYER_COUNT = 1;

  constructor() { 
    this.id = PlayerEntity.PLAYER_COUNT++;
  }

  public id = 0;
  public myCards: CardEntity[] = [];

  public setCards = (cards: CardEntity[]) => {
    this.myCards = cards;
  }

  private _isMyTurnToMove: boolean = false;
  private _isMyTurnToCounterMove: boolean = false;
  private _isHuman: boolean = false;

  get isHuman() { return this._isHuman; } 
  get isMyTurnToMove() { return this._isMyTurnToMove; } 
  get isMyTurnToCounterMove() { return this._isMyTurnToCounterMove; } 

  set isMyTurnToMove(bool: boolean) { this._isMyTurnToMove = bool; }
  set isMyTurnToCounterMove(bool: boolean) { this._isMyTurnToCounterMove = bool; }
  set isHuman(bool: boolean) { this._isHuman = bool}
  
  public modifyCardsForMoving = (tableCards: CardEntity[][]) => {
    const table = tableCards.flatMap(i => i);
    this.myCards.forEach(card => card.isAllowToMove = false);
    if(!tableCards.length) {
      this.myCards.forEach(card => card.isAllowToMove = true);
    }

    const powers = table.map(card => card.power);
    const powerUniqueArr = Array.from(new Set(powers));

    if(this.isMyTurnToMove) {
      this.myCards.forEach(card => {
        if(powerUniqueArr.includes(card.power)) {
          card.isAllowToMove = true;
        }
      });
    }

    if(this.isMyTurnToCounterMove) {
      const lastCard = table[table.length - 1];
      this.myCards.forEach(card => {
        if(lastCard.suit === card.suit && lastCard.power < card.power) {
          card.isAllowToMove = true;
        }
      })
    }

    UIEntity.updatePlayer(this);
  }

  public check = () => {};
  public move = (card: CardEntity) => {};
  public take = (cards: CardEntity[]) => {};
}