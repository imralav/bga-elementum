import { ActionsAPI } from "../ActionsAPI";
import { ElementumGameInterface } from "../gui/ElementumGameInterface";
import { Element } from "../spells/elementum.types";
import { Spell } from "../spells/Spell";
import { NoopState } from "./NoopState";

export class ExchangeWithSpellPoolSpellOnBoardSelectionState extends NoopState {
  constructor(private gui: ElementumGameInterface) {
    super();
  }

  onEnter(): void {
    this.gui.makeSpellsClickableOnCurrentPlayersBoard();
  }

  spellOnBoardClicked(
    playerId: PlayerId,
    spell: Spell,
    element: Element
  ): void {
    ActionsAPI.actExchangeWithSpellPool_SelectSpellOnBoard(spell.number)
      .then(() => {
        console.log("Selected spell", spell);
        this.gui.selectSpell(spell.number);
      })
      .catch((error) => {
        console.error("Error selecting spell", error);
      });
  }

  onLeave(): void {
    this.gui.makeSpellsNotClickableOnCurrentPlayersBoard();
  }
}
