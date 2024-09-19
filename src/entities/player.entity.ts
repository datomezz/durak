import { CardEntity } from "./card.entity";
import { EventEntity, EVENTS_ENUM } from "./events.entity";
import { UIEntity } from "./ui.entity";

export class PlayerEntity {
  static PLAYER_COUNT = 1;

  constructor() { 
    this.id = PlayerEntity.PLAYER_COUNT++;
  }

  public id = 0;
  public myCards: CardEntity[] = [];
  public hasTaken: boolean = false;
  public hasFinished: boolean = false;

  public setCards = (cards: CardEntity[]) => {
    this.myCards = cards;
  }

  public setCard = (card: CardEntity) => {
    this.myCards = [...this.myCards, card];
  }

  private _isMyTurnToMove: boolean = false;
  private _isMyTurnToCounterMove: boolean = false;
  private _isHuman: boolean = false;

  get isHuman() { return this._isHuman; } 
  get isMyTurnToMove() { return this._isMyTurnToMove; } 
  get isMyTurnToCounterMove() { return this._isMyTurnToCounterMove; } 

  set isMyTurnToMove(bool: boolean) { 
    this._isMyTurnToMove = bool; 
  }
  set isMyTurnToCounterMove(bool: boolean) { this._isMyTurnToCounterMove = bool; }
  set isHuman(bool: boolean) { this._isHuman = bool}
  
  public modifyCardsForMoving = (tableCards: CardEntity[][]) => {
    const table = tableCards.flatMap(i => i);
    this.myCards.forEach(card => card.isAllowToMove = false);

    if(!tableCards.length) {

      if(this.isMyTurnToMove) {
        this.myCards.forEach(card => card.isAllowToMove = true);
        UIEntity.updatePlayer(this);
      }

      return;
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
        if(
          (lastCard.suit === card.suit && lastCard.power < card.power) ||
          (card.isTrump && !lastCard.isTrump) || 
          ((card.isTrump && lastCard.isTrump) && card.power > lastCard.power)
        ) {
          card.isAllowToMove = true;
        }
      })
    }

    UIEntity.updatePlayer(this);
  }

  public check = () => { };

  public move = (target: HTMLDivElement) => {
    const targetId = target.dataset.id as any;
    const removeIdx = this.myCards.findIndex(card => card.id === +targetId);
    const removedCard = this.myCards.splice(removeIdx, 1);
    UIEntity.removeCard(targetId);
    EventEntity.dispatch(EVENTS_ENUM.REMOVE_CARD_FROM_PLAYER, removedCard);
  };

  public take = (table: CardEntity[][]) => {
    const cards = table.flatMap(i => i);
    this.setCards([...this.myCards, ...cards]);
    this.hasTaken = true;
    UIEntity.updatePlayer(this);
  };
}