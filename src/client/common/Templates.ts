import { Elementum } from "../elementum";
import { Element } from "../spells/elementum.types";
import { Spell } from "../spells/Spell";
import { getIconForElement } from "./utils";

export interface SpellTemplateParams {}

export class Templates {
  static spell(spell: Spell) {
    return Elementum.getInstance().format_block("jstpl_spell", {
      spellNumber: spell.number,
      spellSummaryData: `${spell.number}: ${spell.name}\n(${getIconForElement(
        spell.element
      )})`,
      element: spell.element,
    });
  }

  static idOfSpell(spell: Spell) {
    return `spell_${spell.number}`;
  }

  static idOfSpellColumn(playerId: PlayerId, element: Element) {
    return `spells-column-${playerId}-${element}`;
  }

  static textBeforeCancelButton(text: string) {
    return `<span id="text-before-cancel-button">${text}</span>`;
  }
}
