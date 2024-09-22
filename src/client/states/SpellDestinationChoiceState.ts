import { ActionsAPI } from "../api/ActionsAPI";
import { ElementumGameInterface } from "../gui/ElementumGameInterface";
import { Spell } from "../spells/Spell";
import { NoopState } from "./NoopState";

export class SpellDestinationChoiceState extends NoopState {
  constructor(private gui: ElementumGameInterface) {
    super();
  }
  spellOnSpellPoolClicked(spell: Spell) {
    console.log("Spell pool clicked", spell);
    ActionsAPI.useSpellPool(spell.number)
      .then(() => {
        console.log("Picking spell on pool", spell.number);
        this.gui.pickSpellOnSpellPool(spell.number);
      })
      .catch((error) => {
        console.error("Error picking spell pool", error);
      });
  }
}
