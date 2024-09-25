import { Spell } from "../spells/Spell";
import { State } from "./State";

export class NoopState implements State {
  onEnter(): void {}
  onUpdateActionButtons(args: AnyGameStateArgs | null): void {}
  spellClicked(spell: Spell): void {}
  spellOnSpellPoolClicked(spell: Spell): void {}
  onLeave(): void {}
}
