import { Element } from "./elementum.types";

export interface SpellEffect {
  type: string;
}

export interface Spell {
  number: number;
  name: string;
  element: Element;
  immediate: boolean;
  effect: SpellEffect;
  empoweredEffect?: SpellEffect;
}
