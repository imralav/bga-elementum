import { Spell } from "../spells/Spell";

export interface State {
  spellClicked(spell: Spell): void;
  spellOnSpellPoolClicked(spell: Spell): void;
  onLeave(): void;
}
