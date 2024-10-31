import { Element } from "../spells/elementum.types";
import { Spell } from "../spells/Spell";

export interface State {
  onEnter(args: AnyGameStateArgs | null): void;
  spellOnHandClicked(spell: Spell): void;
  spellOnBoardClicked(playerId: PlayerId, spell: Spell, element: Element): void;
  spellOnSpellPoolClicked(spell: Spell): void;
  elementSourceClicked(playerId: string, element: string): void;
  onUpdateActionButtons(args: AnyGameStateArgs | null): void;
  onLeave(): void;
}
