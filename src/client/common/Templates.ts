import { Elementum } from "../elementum";
import { Element } from "../spells/elementum.types";
import { Spell } from "../spells/Spell";
import { getIconForElement } from "./utils";

export interface SpellTemplateParams {}

export class Templates {
  static spell(spell: Spell) {
    return Elementum.getInstance().format_block("jstpl_spell", {
      spellNumber: spell.number,
      spellSummaryData: `${spell.number}: ${spell.name} (${
        spell.immediate ? "immediate" : "non_immediate"
      })\n(${getIconForElement(spell.element)})`,
      effect: JSON.stringify(spell.effect, null, 2),
      empoweredEffect: spell.empoweredEffect
        ? JSON.stringify(spell.empoweredEffect, null, 2)
        : "none",
      element: spell.element,
    });
  }

  static playerBoard(playerId: PlayerId, playerName: string) {
    return Elementum.getInstance().format_block(
      "jstpl_player_board_container",
      { playerId, playerName }
    );
  }

  static idOfPlayerBoard(playerId: PlayerId) {
    return `player-board-${playerId}`;
  }

  static idOfSpell(spell: Spell) {
    return `spell_${spell.number}`;
  }

  static idOfSpellColumn(playerId: PlayerId, element: Element) {
    return `spells-column-${playerId}-${element}`;
  }

  static idOfElementSource(playerId: PlayerId, element: Element) {
    return `element-source-${playerId}-${element}`;
  }

  static textBeforeCancelButton(text: string) {
    return `<span id="text-before-cancel-button">${text}</span>`;
  }

  static gameInfoPanel() {
    return `<div id="game-info-panel" class="player-board">
              <span>Current round: <span id="current-round">0</span>/<span id="total-rounds">3</span></span>
            </div>`;
  }
}
