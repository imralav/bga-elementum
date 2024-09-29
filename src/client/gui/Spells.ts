import { Spell } from "../spells/Spell";
import { Handle } from "dojo";
import { Templates } from "../common/Templates";
import { ElementumGameInterface } from "./ElementumGameInterface";

export type OnSpellClicked = (spell: Spell) => void;

//TODO: in the future might be replaced by BGA's Stock
/**
 * Represents a collection of spells for various purposes.
 * Contains both domain representation of the spell in the form of {@link Spell} and the GUI representation in the form of HTML elements.
 */
export class Spells {
  private spellClickHandlers: Handle[] = [];
  private pickedSpellElement?: HTMLElement;
  private spellClickedListeners: OnSpellClicked[] = [];

  constructor(
    public readonly containerId: string,
    private spells: Spell[],
    private gui: ElementumGameInterface
  ) {
    this.addSpellsToDOMAndMakeThenClickable(spells);
  }

  clearSpells() {
    this.makeAllSpellsUnClickable();
    dojo.empty(this.containerId);
    this.spells = [];
    this.spellClickHandlers.forEach((handler) => dojo.disconnect(handler));
    this.spellClickHandlers = [];
  }

  private makeSpellUnClickable(spell: HTMLElement) {
    dojo.removeClass(spell, "clickable");
  }

  private makeAllSpellsUnClickable() {
    this.forEachSpellInDom((spell) => this.makeSpellUnClickable(spell));
  }

  private addSpellsToDOMAndMakeThenClickable(spells: Spell[]) {
    for (const spell of spells) {
      const spellBlock = Templates.spell(spell);
      dojo.place(spellBlock, this.containerId); //current-player-hand
    }
    this.makeSpellsClickable();
  }

  whenSpellClicked(onSpellClicked: OnSpellClicked) {
    this.spellClickedListeners.push(onSpellClicked);
  }

  private makeSpellsClickable() {
    this.forEachSpellInDom((spell) => {
      this.makeSpellNodeClickable(spell);
    });
  }

  private makeSpellNodeClickable(spell: Node) {
    dojo.addClass(spell, "clickable");
    const handler = dojo.connect(spell, "onclick", (evt: Event) => {
      this.pickSpellFromEvent(evt).then((spell) => {
        this.spellClickedListeners.forEach((listener) => listener(spell));
      });
    });
    this.spellClickHandlers.push(handler);
  }

  public forEachSpellInDom(callback: (spell: HTMLElement) => void) {
    dojo
      .query(`#${this.containerId} div.spell`)
      .forEach((spell) => callback(spell as HTMLElement));
  }

  private pickSpellFromEvent(evt: Event) {
    this.pickedSpellElement = evt.target as HTMLElement;
    const spellNumber = this.spellNumberFromElementId(
      this.pickedSpellElement.id
    );
    //TODO: how to make sure that evt.target is always the main spell element and not some text child inside?
    if (spellNumber) {
      dojo.stopEvent(evt);
      console.log("Picking spell from event", spellNumber);
      const spell = this.getSpellByNumber(+spellNumber);
      if (spell) {
        return Promise.resolve(spell);
      } else {
        return Promise.reject("Couldn't find spell with number " + spellNumber);
      }
    } else {
      return Promise.reject("Couldn't find spell");
    }
  }

  private spellNumberFromElementId(elementId: string) {
    return +elementId.split("_")[1]!;
  }

  private getSpellByNumber(spellNumber: Spell["number"]) {
    return this.spells.find((spell) => spell.number === spellNumber);
  }

  public pickSpell(spellNumber: Spell["number"]) {
    this.pickedSpellElement = $(`spell_${spellNumber}`) as HTMLElement;
    if (this.pickedSpellElement) {
      this.gui.selectSpell(spellNumber);
    }
  }

  public unpickSpell() {
    if (this.pickedSpellElement) {
      this.gui.deselectSpell(
        this.spellNumberFromElementId(this.pickedSpellElement.id)
      );
      this.pickedSpellElement = undefined;
    }
  }

  removeSpell(spell: Spell) {
    const spellElement = $(`spell_${spell.number}`) as HTMLElement;
    if (spellElement) {
      dojo.destroy(spellElement);
    } else {
      console.error("Couldn't find spell with number", spell.number);
    }
    this.spells = this.spells.filter((s) => s.number !== spell.number);
  }

  replaceSpells(spells: Spell[]) {
    dojo.empty(this.containerId);
    this.spells = spells;
    this.addSpellsToDOMAndMakeThenClickable(spells);
  }

  addSpell(spell: Spell) {
    this.spells.push(spell);
    const spellNode = $(Templates.idOfSpell(spell));
    if (!spellNode) {
      return;
    }
    this.makeSpellNodeClickable(spellNode);
  }
}
