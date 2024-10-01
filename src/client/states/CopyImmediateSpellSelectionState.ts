import { ActionsAPI } from "../ActionsAPI";
import { ElementumGameInterface } from "../gui/ElementumGameInterface";
import { Element } from "../spells/elementum.types";
import { Spell } from "../spells/Spell";
import { NoopState } from "./NoopState";

export class CopyImmediateSpellSelectionState extends NoopState {
  constructor(private gui: ElementumGameInterface) {
    super();
  }

  onEnter(): void {
    this.gui.makeSpellsClickableOnAllBoards();
  }

  spellOnBoardClicked(
    playerId: PlayerId,
    spell: Spell,
    element: Element
  ): void {
    ActionsAPI.actCopyImmediateSpell_selectSpell(spell.number)
      .then(() => {
        console.log("Selected spell", spell);
      })
      .catch((error) => {
        console.error("Error selecting spell", error);
      });
  }

  spellOnSpellPoolClicked(spell: Spell): void {
    ActionsAPI.actCopyImmediateSpell_selectSpell(spell.number)
      .then(() => {
        console.log("Selected spell", spell);
      })
      .catch((error) => {
        console.error("Error selecting spell", error);
      });
  }

  onLeave(): void {
    this.gui.makeSpellsNotClickableOnAllBoards();
  }
}
