import { Spell } from "../spells/Spell";

export interface State {
  onEnter(): void;
  spellClicked(spell: Spell): void;
  spellOnSpellPoolClicked(spell: Spell): void;
  elementSourceClicked(playerId: string, element: string): void;
  onUpdateActionButtons(args: AnyGameStateArgs | null): void;
  onLeave(): void;
}
