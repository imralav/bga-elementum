import { Element } from "../spells/elementum.types";

export function doAfter(millins: number, action: () => void) {
  setTimeout(action, millins);
}

export function getIconForElement(element: Element): string {
  switch (element) {
    case "fire":
      return "🔥";
    case "water":
      return "💦";
    case "earth":
      return "🌍";
    case "air":
      return "💨";
    case "universal":
      return "☀";
    default:
      throw new Error(`Unknown element: ${element}`);
  }
}
