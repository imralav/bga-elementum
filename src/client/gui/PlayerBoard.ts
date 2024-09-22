import { getIconForElement } from "../common/utils";
import { Element } from "../spells/elementum.types";
import Gamegui = require("bga-ts-template/typescript/types/ebg/core/gamegui");
import { Spell } from "../spells/Spell";
import { Templates } from "../common/Templates";

export class PlayerBoard {
  constructor(
    private playerId: PlayerId,
    private playerBoard: PlayerBoardAndElementSources,
    private core: Gamegui
  ) {
    this.createPlayerBoard();
  }

  private createPlayerBoard() {
    this.createPlayerBoardContainer();
    this.createPlayerBoardColumns();
  }

  private createPlayerBoardContainer() {
    const playerName = this.core.gamedatas.players[+this.playerId]!.name;
    const playerBoardContainer = this.core.format_block(
      "jstpl_player_board_container",
      { playerId: this.playerId, playerName: playerName }
    );
    dojo.place(playerBoardContainer, "board");
  }

  private createPlayerBoardColumns() {
    for (const element of this.playerBoard.elementSources) {
      this.createPlayerBoardColumn(element);
      this.putElementSourceAsFirstElementInColumn(element);
      this.putSpellsInColumn(this.playerBoard.board[element]);
    }
  }

  private createPlayerBoardColumn(element: Element) {
    const elementColumn = this.core.format_block("jstpl_spells_column", {
      playerId: this.playerId,
      element,
    });
    dojo.place(elementColumn, `player-board-container-${this.playerId}`!);
  }

  private putElementSourceAsFirstElementInColumn(element: Element) {
    const elementSource = this.core.format_block("jstpl_element_source", {
      element,
      icon: getIconForElement(element),
    });
    dojo.place(
      elementSource,
      this.getIdOfElementColumnForCurrentPlayer(element)
    );
  }

  public getIdOfElementColumnForCurrentPlayer(element: Element) {
    return `spells-column-${this.playerId}-${element}`;
  }

  private putSpellsInColumn(spells: Spell[]) {
    for (const spell of spells) {
      this.putSpellOnBoard(spell);
    }
  }

  putSpellOnBoard(spell: Spell) {
    const spellTemplate = Templates.spell(spell);
    dojo.place(
      spellTemplate,
      this.getIdOfElementColumnForCurrentPlayer(spell.element)
    );
  }
}
