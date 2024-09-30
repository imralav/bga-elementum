import { getIconForElement } from "../common/utils";
import { Element } from "../spells/elementum.types";
import Gamegui = require("bga-ts-template/typescript/types/ebg/core/gamegui");
import { Spell } from "../spells/Spell";
import { Templates } from "../common/Templates";
import { Handle } from "dojo";
import { Elementum } from "../elementum";

export type OnElementSourceClicked = (
  playerId: PlayerId,
  element: Element
) => void;

export type OnSpellOnBoardClicked = (
  playerId: PlayerId,
  spell: Spell,
  element: Element
) => void;

export class PlayerBoard {
  private elementSourceClickHandlers: Handle[] = [];
  private elementSourceClickListeners: OnElementSourceClicked[] = [];
  private spellClickHandlers: Handle[] = [];
  private spellClickListeners: OnSpellOnBoardClicked[] = [];

  constructor(
    private playerId: PlayerId,
    private playerBoard: PlayerBoardAndElementSources,
    private core: Elementum
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
  private putSpellsInColumn(spellNumber: Spell["number"][], element: Element) {
    for (const spell of spellNumber) {
      this.putSpellOnBoard(spell, element);
    }
  }

  putSpellOnBoard(spellNumber: Spell["number"], element: Element) {
    const spellTemplate = Templates.spell(
      this.core.getSpellByNumber(spellNumber)!
    );
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

  makeSpellsClickable() {
    for (const element of this.playerBoard.elementSources) {
      const columnId = this.getIdOfElementColumnForCurrentPlayer(element);
      document.querySelectorAll(`#${columnId} .spell`).forEach((spellNode) => {
        this.makeSpellClickable(spellNode);
      });
    }
  }

  private makeSpellClickable(spellNode: Node) {
    dojo.addClass(spellNode, "clickable");
    this.registerSpellClickHandlerOn(spellNode);
  }

  private registerSpellClickHandlerOn(spellNode: Node) {
    const handler = dojo.connect(spellNode, "onclick", (evt: Event) => {
      this.spellClickListeners.forEach((listener) => {
        const spell = this.pickSpellFromEvent(evt)!;
        listener(this.playerId, spell, spell.element);
      });
    });
    this.spellClickHandlers.push(handler);
  }

  private pickSpellFromEvent(evt: Event) {
    const htmlElement = evt.target as HTMLElement;
    const id = htmlElement.id;
    const spellNumber = id.split("_")[1];
    return this.core.getSpellByNumber(+spellNumber!);
  }

  whenSpellClicked(onSpellOnBoardClicked: OnSpellOnBoardClicked) {
    this.spellClickListeners.push(onSpellOnBoardClicked);
  }

  makeSpellsNotClickable() {
    this.spellClickHandlers.forEach((handler) => {
      dojo.disconnect(handler);
    });
    this.spellClickHandlers = [];
    for (const element of this.playerBoard.elementSources) {
      const columnId = this.getIdOfElementColumnForCurrentPlayer(element);
      document.querySelectorAll(`#${columnId} .spell`).forEach((spellNode) => {
        dojo.removeClass(spellNode, "clickable");
      });
    }
  }

  removeSpell(spell: Spell) {
    for (const element of this.playerBoard.elementSources) {
      const columnSpells = this.playerBoard.board[element];
      const spellIndex = columnSpells.indexOf(spell.number);
      if (spellIndex !== -1) {
        columnSpells.splice(spellIndex, 1);
        dojo.destroy(Templates.idOfSpell(spell));
      }
    }
  }
}
