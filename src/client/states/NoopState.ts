import { Element } from "../spells/elementum.types";
import { Spell } from "../spells/Spell";
import { State } from "./State";

export class NoopState implements State {
  onEnter(): void {}
  onUpdateActionButtons(args: AnyGameStateArgs | null): void {}
  spellOnHandClicked(spell: Spell): void {}
  spellOnBoardClicked(
    playerId: PlayerId,
    spell: Spell,
    element: Element
  ): void {}
  spellOnSpellPoolClicked(spell: Spell): void {}
  elementSourceClicked(playerId: string, element: string): void {}
  onLeave(): void {}
}
