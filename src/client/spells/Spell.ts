import { Element } from "./elementum.types";

export interface SpellEffect {
  type: string;
}

export interface Spell {
  number: number;
  name: string;
  element: Element;
  spellActivation: "passive" | "immediate";
  effect: SpellEffect;
  empoweredEffect?: SpellEffect;
  crystalSlots: number;
}
