import { Spell } from "../spells/Spell";
import { State } from "./State";

export class NoopState implements State {
  spellClicked(spell: Spell): void {
    console.log("NoopState.spellClicked", spell);
  }
  spellOnSpellPoolClicked(spell: Spell): void {
    console.log("NoopState.spellOnSpellPoolClicked", spell);
  }
  onLeave(): void {
    console.log("NoopState.onLeave");
  }
}
