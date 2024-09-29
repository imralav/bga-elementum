import { getIconForElement } from "../common/utils";
import { Element } from "../spells/elementum.types";
import Gamegui = require("bga-ts-template/typescript/types/ebg/core/gamegui");
import { Spell } from "../spells/Spell";
import { Templates } from "../common/Templates";
import { Handle } from "dojo";

export type OnElementSourceClicked = (
  playerId: PlayerId,
  element: Element
) => void;

export class PlayerBoard {
  private elementSourceClickHandlers: Handle[] = [];
  private elementSourceClickListeners: OnElementSourceClicked[] = [];

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
    const playerBoardContainer = Templates.playerBoard(
      this.playerId,
      playerName
    );
    dojo.place(playerBoardContainer, "board");
  }

  private createPlayerBoardColumns() {
    for (const element of this.playerBoard.elementSources) {
      this.createPlayerBoardColumn(element);
      this.putElementSourceAsFirstElementInColumn(element);
      this.putSpellsInColumn(this.playerBoard.board[element], element);
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
      playerId: this.playerId,
      icon: getIconForElement(element),
    });
    dojo.place(
      elementSource,
      this.getIdOfElementColumnForCurrentPlayer(element)
    );
  }

  makeElementSourcesClickable() {
    for (const element of this.playerBoard.elementSources) {
      const elementSourceNode = document.getElementById(
        Templates.idOfElementSource(this.playerId, element)
      );
      this.makeElementSourceClickable(elementSourceNode!);
    }
  }
  makeElementSourcesNotClickable() {
    this.disconnectAndClearClickHandlers();
    for (const element of this.playerBoard.elementSources) {
      const elementSourceNode = document.getElementById(
        Templates.idOfElementSource(this.playerId, element)
      );
      dojo.removeClass(elementSourceNode!, "clickable");
    }
  }

  private disconnectAndClearClickHandlers() {
    this.elementSourceClickHandlers.forEach((handler) => {
      dojo.disconnect(handler);
    });
    this.elementSourceClickHandlers = [];
  }

  private makeElementSourceClickable(elementSourceNode: Node) {
    dojo.addClass(elementSourceNode, "clickable");
    this.registerClickHandlerOn(elementSourceNode);
  }

  private registerClickHandlerOn(elementSourceNode: Node) {
    const handler = dojo.connect(elementSourceNode, "onclick", (evt: Event) => {
      this.elementSourceClickListeners.forEach((listener) => {
        const element = this.pickElementSourceFromEvent(evt);
        listener(this.playerId, element);
      });
    });
    this.elementSourceClickHandlers.push(handler);
  }

  private pickElementSourceFromEvent(evt: Event) {
    const htmlElement = evt.target as HTMLElement;
    const id = htmlElement.id;
    const element = id.split("-")[3] as Element;
    return element;
  }

  public getIdOfElementColumnForCurrentPlayer(element: Element) {
    return `spells-column-${this.playerId}-${element}`;
  }

  /**
   *
   * @param element is necessary due to the fact that some Spells are Universal, and we can't rely on their inherent element, it needs to come from the context
   */
  private putSpellsInColumn(spells: Spell[], element: Element) {
    for (const spell of spells) {
      this.putSpellOnBoard(spell, element);
    }
  }

  putSpellOnBoard(spell: Spell, element: Element) {
    const spellTemplate = Templates.spell(spell);
    dojo.place(
      spellTemplate,
      this.getIdOfElementColumnForCurrentPlayer(element)
    );
  }

  whenElementSourceClicked(listener: OnElementSourceClicked) {
    this.elementSourceClickListeners.push(listener);
  }

  markAsCurrentPlayer() {
    dojo.addClass(Templates.idOfPlayerBoard(this.playerId), "current");
  }
}
