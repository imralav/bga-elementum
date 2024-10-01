import { ActionsAPI } from "../ActionsAPI";
import { Spell } from "../spells/Spell";
import { NoopState } from "./NoopState";

export class AddFromSpellPoolSpellSelectionState extends NoopState {
  spellOnSpellPoolClicked(spell: Spell) {
    console.log("Spell pool clicked", spell);
    ActionsAPI.actAddFromSpellPool_SelectSpell(spell.number)
      .then(() => {
        console.log("Picking spell on pool", spell.number);
      })
      .catch((error) => {
        console.error("Error picking spell pool", error);
      });
  }
}
