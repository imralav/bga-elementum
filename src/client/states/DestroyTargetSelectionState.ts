import { ActionsAPI } from "../ActionsAPI";
import { ElementumGameInterface } from "../gui/ElementumGameInterface";
import { Element } from "../spells/elementum.types";
import { Spell } from "../spells/Spell";
import { NoopState } from "./NoopState";

export class DestroyTargetSelectionState extends NoopState {
  constructor(private gui: ElementumGameInterface) {
    super();
  }

  onEnter(): void {
    this.gui.makeSpellsClickableOnAllBoardsBesidesCurrentPlayer();
  }

  spellOnBoardClicked(playerId: string, spell: Spell, element: Element): void {
    ActionsAPI.destroyTarget(spell.number, playerId)
      .then(() => {
        console.log("Destroying target", spell.number, playerId, element);
      })
      .catch((error: unknown) => {
        console.error("Error destroying target", error);
      });
  }

  onLeave(): void {
    this.gui.makeSpellsUnclickableOnAllBoards();
  }
}
