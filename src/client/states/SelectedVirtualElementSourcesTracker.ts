import { Element } from "../spells/elementum.types";
import { Spell } from "../spells/Spell";

/**
 * Tracks which virtual element sources were selected by the player.
 */
export class SelectedVirtualElementSourcesTracker {
  private virtualElements: VirtualElementsCandidates = {};

  private static MAX_ELEMENTS = 2;

  private constructor() {}

  public static startTracking() {
    return new SelectedVirtualElementSourcesTracker();
  }

  public canSelectMoreElements() {
    return (
      this.getAmountOfSelectedElements() <
      SelectedVirtualElementSourcesTracker.MAX_ELEMENTS
    );
  }

  public getAmountOfSelectedElements() {
    return Object.values(this.virtualElements).reduce(
      (acc, elements) => acc + elements.length,
      0
    );
  }

  public select(spellNumber: Spell["number"], element: Element) {
    if (!this.virtualElements[spellNumber]) {
      this.virtualElements[spellNumber] = [];
    }
    this.virtualElements[spellNumber].push(element);
  }

  public deselect(spellNumber: Spell["number"], element: Element) {
    if (!this.virtualElements[spellNumber]) {
      return;
    }
    const index = this.virtualElements[spellNumber].indexOf(element);
    if (index !== -1) {
      this.virtualElements[spellNumber].splice(index, 1);
    }
  }

  public isSelected(spellNumber: Spell["number"], element: Element) {
    return (
      this.virtualElements[spellNumber] &&
      this.virtualElements[spellNumber].includes(element)
    );
  }

  public clear() {
    this.virtualElements = {};
  }

  public getSelectedElements() {
    return this.virtualElements;
  }
}
