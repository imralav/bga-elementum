import { Spell } from "../spells/Spell";
import { Handle } from "dojo";
import { Templates } from "../common/Templates";

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

  constructor(private containerId: string, private spells: Spell[]) {
    this.addSpellsToDOMAndMakeThenClickable(containerId, spells);
  }

  private addSpellsToDOMAndMakeThenClickable(
    containerId: string,
    spells: Spell[]
  ) {
    for (const spell of spells) {
      const spellBlock = Templates.spell(spell);
      dojo.place(spellBlock, containerId); //current-player-hand
    }
    this.makeSpellsClickable();
  }

  whenSpellClicked(onSpellClicked: OnSpellClicked) {
    this.spellClickedListeners.push(onSpellClicked);
  }

  private makeSpellsClickable() {
    this.forEachSpellInDom((spell) => {
      dojo.addClass(spell, "clickable");
      const handler = dojo.connect(spell, "onclick", (evt: Event) => {
        this.pickSpellFromEvent(evt).then((spell) => {
          this.spellClickedListeners.forEach((listener) => listener(spell));
        });
      });
      this.spellClickHandlers.push(handler);
    });
  }

  private forEachSpellInDom(callback: (spell: Node) => void) {
    dojo
      .query(`#${this.containerId} div.spell`)
      .forEach((spell) => callback(spell));
  }

  private makeSpellsUnclickable() {
    this.spellClickHandlers.forEach((handler) => dojo.disconnect(handler));
    this.spellClickHandlers = [];
    this.forEachSpellInDom((spell) => {
      dojo.removeClass(spell, "clickable");
    });
  }

  private pickSpellFromEvent(evt: Event) {
    this.pickedSpellElement = evt.target as HTMLElement;
    const spellNumber = this.pickedSpellElement.id.split("_")[1];
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

  private getSpellByNumber(spellNumber: Spell["number"]) {
    return this.spells.find((spell) => spell.number === spellNumber);
  }

  public pickSpell(spellNumber: Spell["number"]) {
    this.pickedSpellElement = $(`spell_${spellNumber}`) as HTMLElement;
    if (this.pickedSpellElement) {
      dojo.addClass(this.pickedSpellElement, "picked");
    } else {
      console.error("Couldn't find spell with number", spellNumber);
    }
  }

  public unpickSpell() {
    if (this.pickedSpellElement) {
      dojo.removeClass(this.pickedSpellElement, "picked");
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

  getIdOfSpellElement(spell: Spell) {
    return `spell_${spell.number}`;
  }

  replaceSpells(spells: Spell[]) {
    //TODO: animacja: istniejące karty wyjeżdżają w górę poza ekran, potem wjeżdżają nowe
    dojo.empty(this.containerId);
    this.spells = spells;
    this.addSpellsToDOMAndMakeThenClickable(this.containerId, spells);
  }

  addSpell(spell: Spell) {
    this.spells.push(spell);
    const spellBlock = Templates.spell(spell);
    dojo.place(spellBlock, this.containerId);
    this.makeSpellsUnclickable();
    this.makeSpellsClickable();
  }
}
