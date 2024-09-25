import { Spell } from "../spells/Spell";

export interface State {
  onEnter(): void;
  spellClicked(spell: Spell): void;
  spellOnSpellPoolClicked(spell: Spell): void;
  onUpdateActionButtons(args: AnyGameStateArgs | null): void;
  onLeave(): void;
}
