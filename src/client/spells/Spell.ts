import { Element } from "./elementum.types";

export interface Spell {
  number: number;
  name: string;
  element: Element;
  immediate: boolean;
}
