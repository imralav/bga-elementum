import { ActionsAPI } from "../api/ActionsAPI";
import { ElementumGameInterface } from "../gui/ElementumGameInterface";
import { Spell } from "../spells/Spell";
import { NoopState } from "./NoopState";

export class PickSpellState extends NoopState {
  constructor(private gui: ElementumGameInterface) {
    super();
  }

  spellClicked(spell: Spell): void {
    console.log("Spell clicked", spell);
    ActionsAPI.pickSpell(spell.number)
      .then(() => {
        console.log("Picking spell", spell.number);
        this.gui.pickSpell(spell.number);
      })
      .catch((error) => {
        console.error("Error picking spell", error);
      });
  }
}
