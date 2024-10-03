import { ActionsAPI } from "../ActionsAPI";
import { Elementum } from "../elementum";
import { Spell } from "../spells/Spell";
import { NoopState } from "./NoopState";

export class ExchangeWithSpellPoolSpellFromPoolSelectionState extends NoopState {
  constructor(private elementum: Elementum) {
    super();
  }

  onUpdateActionButtons(args: AnyGameStateArgs | null): void {
    this.elementum.addCancelButton(_("Cancel"), () => {
      ActionsAPI.actExchangeWithSpellPool_CancelSpellOnBoardChoice();
    });
  }

  spellOnSpellPoolClicked(spell: Spell): void {
    ActionsAPI.actExchangeWithSpellPool_SelectSpellFromPool(spell.number)
      .then(() => {
        console.log("Selected spell", spell);
      })
      .catch((error) => {
        console.error("Error selecting spell", error);
      });
  }
}
