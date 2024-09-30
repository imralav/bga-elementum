import { ActionsAPI } from "../ActionsAPI";
import { ElementumGameInterface } from "../gui/ElementumGameInterface";
import { Spell } from "../spells/Spell";
import { NoopState } from "./NoopState";

export class PickSpellState extends NoopState {
  constructor(private gui: ElementumGameInterface) {
    super();
  }

  spellOnHandClicked(spell: Spell): void {
    console.log("Spell clicked", spell);
    ActionsAPI.pickSpell(spell.number)
      .then(() => {
        console.log("Picking spell", spell.number);
        this.gui.pickSpellOnHand(spell.number);
      })
      .catch((error) => {
        console.error("Error picking spell", error);
      });
  }
}
