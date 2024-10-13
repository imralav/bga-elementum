import { Templates } from "../common/Templates";
import { randomVariation } from "../common/variation";
import { Elementum } from "../elementum";
import { Spell } from "../spells/Spell";
import { Element } from "../spells/elementum.types";
import { Crystals } from "./Crystals";
import { GameInfoPanel } from "./GameInfoPanel";
import {
  OnElementSourceClicked,
  OnSpellOnBoardClicked,
  PlayerBoard,
} from "./PlayerBoard";
import { OnSpellClicked, Spells } from "./Spells";
import {
  despawnElement,
  despawnSpell,
  moveElementOnAnimationSurface,
  spawnSpellOnBoard,
} from "./animations";

export interface ElementumGameInterfaceInput {
  spellPool: Spell[];
  playerHand: Spell[];
  pickedSpell?: Spell["number"]; //TODO: shouldnt happen in constructor but in separate method, invoked outside
  crystalsInPile: number;
  crystalsPerPlayer: Record<PlayerId, number>;
  crystalsPerSpell: Record<Spell["number"], number>;
  playerBoards: Gamedatas["playerBoards"];
  core: Elementum;
}

/**
 * Class responsible for managing the game interface, dealing with putting out spells on the board,
 * marking the spell as picked, listening to events.
 * It bridges the world of game logic and web based interface. It has no game related logic itself,
 * only presentation logic related to manipulating the DOM
 */
export class ElementumGameInterface {
  private playerHand!: Spells;
  private spellPool!: Spells;
  private animationDurationInMs = 1000;
  private playerBoards: Record<PlayerId, PlayerBoard> = {};

  private constructor(
    spellPool: Spell[],
    playerHand: Spell[],
    public readonly crystals: Crystals,
    private readonly core: Elementum,
    playerBoards: Gamedatas["playerBoards"]
  ) {
    this.buildSpellPool(spellPool);
    this.buildPlayerHand(playerHand);
    this.crystals.putCrystalsOnBoardAndInPlayerPanels();
    this.buildPlayerBoards(playerBoards);
    this.makeCurrentPlayerBoardFirst();
    this.crystals.putCrystalsOnSpells();
    GameInfoPanel.init();
  }

  public static init(input: ElementumGameInterfaceInput) {
    const gui = new ElementumGameInterface(
      input.spellPool,
      input.playerHand,
      new Crystals(
        input.crystalsInPile,
        input.crystalsPerPlayer,
        input.crystalsPerSpell,
        input.core
      ),
      input.core,
      input.playerBoards
    );
    if (input.pickedSpell) {
      gui.playerHand.pickSpell(input.pickedSpell);
    }
    return gui;
  }

  whenSpellOnHandClicked(onSpellClicked: OnSpellClicked) {
    this.playerHand.whenSpellClicked(onSpellClicked);
  }

  whenSpellPoolClicked(onSpellClicked: OnSpellClicked) {
    this.spellPool.whenSpellClicked(onSpellClicked);
  }

  whenSpellOnBoardClicked(onSpellOnBoardClicked: OnSpellOnBoardClicked) {
    Object.values(this.playerBoards).forEach((playerBoard) => {
      playerBoard.whenSpellClicked(onSpellOnBoardClicked);
    });
  }

  whenElementSourceClickedOnCurrentPlayer(
    onElementClicked: OnElementSourceClicked
  ) {
    this.playerBoards[this.core.getCurrentPlayerId()]!.whenElementSourceClicked(
      onElementClicked
    );
  }

  private buildSpellPool(spellPool: Spell[]) {
    this.spellPool = new Spells("spell-pool", spellPool, this);
  }

  private buildPlayerHand(playerHand: Spell[]) {
    this.playerHand = new Spells("current-player-hand", playerHand, this);
  }

  buildPlayerBoards(playerBoards: Gamedatas["playerBoards"]) {
    this.playerBoards = Object.entries(playerBoards).reduce(
      (acc, [playerId, playerBoard]) => {
        acc[playerId] = new PlayerBoard(playerId, playerBoard, this.core);
        return acc;
      },
      {} as Record<PlayerId, PlayerBoard>
    );
  }

  private makeCurrentPlayerBoardFirst() {
    const currentPlayerId = this.core.getCurrentPlayerId();
    const currentPlayerBoard = this.playerBoards[currentPlayerId];
    if (currentPlayerBoard) {
      currentPlayerBoard.markAsCurrentPlayer();
    }
  }

  putSpellOnBoard(playerId: PlayerId, spell: Spell, column?: Element) {
    if (!this.spellExistsOnBoard(spell)) {
      spawnSpellOnBoard(spell);
    }
    const columnId = Templates.idOfSpellColumn(
      playerId,
      column ?? spell.element
    );
    const spellId = Templates.idOfSpell(spell);
    this.deselectSpell(spell.number);
    moveElementOnAnimationSurface(
      spellId,
      columnId,
      this.animationDurationInMs
    );
  }

  spellExistsOnBoard(spell: Spell) {
    return !!$(Templates.idOfSpell(spell));
  }

  replaceHand(hand: Spell[]) {
    this.moveEachSpellToSpawnPointAndDestroy().then(() => {
      this.playerHand.clearSpells();
      this.spawnSpellsAndAddToHand(hand);
    });
  }

  private moveEachSpellToSpawnPointAndDestroy() {
    const promises: Promise<void>[] = [];
    this.playerHand.forEachSpellInDom((spell) => {
      promises.push(
        despawnElement(
          spell.id,
          randomVariation(this.animationDurationInMs, 500)
        ).then(() => {
          dojo.destroy(spell);
        })
      );
    });
    return Promise.all(promises);
  }

  private spawnSpellsAndAddToHand(hand: Spell[]) {
    hand.forEach((spell) => {
      if (!this.spellExistsOnBoard(spell)) {
        spawnSpellOnBoard(spell);
      }
      moveElementOnAnimationSurface(
        Templates.idOfSpell(spell),
        this.playerHand.containerId,
        randomVariation(this.animationDurationInMs, 500)
      ).then(() => {
        this.playerHand.addSpell(spell);
      });
    });
  }

  pickSpellOnHand(spellNumber: Spell["number"]) {
    this.playerHand.pickSpell(spellNumber);
  }

  unpickSpellOnHand() {
    this.playerHand.unpickSpell();
  }

  pickSpellOnSpellPool(spellNumber: Spell["number"]) {
    this.spellPool.pickSpell(spellNumber);
  }

  unpickSpellOnSpellPool() {
    this.spellPool.unpickSpell();
  }

  putSpellInSpellPool(spellNumber: Spell["number"]) {
    const spell = this.core.getSpellByNumber(spellNumber)!;
    if (!this.spellExistsOnBoard(spell)) {
      spawnSpellOnBoard(spell);
    }
    const containerId = "spell-pool";
    const spellId = Templates.idOfSpell(spell);
    this.deselectSpell(spell.number);
    moveElementOnAnimationSurface(
      spellId,
      containerId,
      this.animationDurationInMs
    );
    this.spellPool.addSpell(spell);
  }

  removeSpellInSpellPool(spellNumber: Spell["number"]) {
    this.spellPool.removeSpell(this.core.getSpellByNumber(spellNumber)!);
  }

  selectSpell(spellNumber: Spell["number"]) {
    const pickedSpellElement = $(`spell_${spellNumber}`) as HTMLElement;
    if (pickedSpellElement) {
      dojo.addClass(pickedSpellElement, "picked");
    } else {
      console.error("Couldn't find spell with number", spellNumber);
    }
  }

  deselectSpell(spellNumber: Spell["number"]) {
    const pickedSpellElement = $(`spell_${spellNumber}`) as HTMLElement;
    if (pickedSpellElement) {
      dojo.removeClass(pickedSpellElement, "picked");
    }
  }

  makeElementSourcesClickableForCurrentPlayer() {
    this.playerBoards[
      this.core.getCurrentPlayerId()
    ]!.makeElementSourcesClickable();
  }

  makeElementSourcesNotClickableForCurrentPlayer() {
    this.playerBoards[
      this.core.getCurrentPlayerId()
    ]!.makeElementSourcesNotClickable();
  }

  makeSpellsClickableOnAllBoardsBesidesCurrentPlayer() {
    const currentPlayerId = this.core.getCurrentPlayerId().toString();
    Object.keys(this.playerBoards)
      .filter((playerId) => playerId !== currentPlayerId)
      .forEach((playerId) => {
        this.playerBoards[playerId]!.makeSpellsClickable();
      });
  }

  makeSpellsClickableOnAllBoards() {
    Object.values(this.playerBoards).forEach((playerBoard) => {
      playerBoard.makeSpellsClickable();
    });
  }

  makeSpellsNotClickableOnAllBoards() {
    Object.values(this.playerBoards).forEach((playerBoard) => {
      playerBoard.makeSpellsNotClickable();
    });
  }

  destroySpellOnBoard(victimPlayerId: PlayerId, spellNumber: number) {
    const spell = this.core.getSpellByNumber(spellNumber)!;
    const playerBoard = this.playerBoards[victimPlayerId]!;
    despawnSpell(spellNumber, this.animationDurationInMs).then(() => {
      playerBoard.removeSpell(spell);
    });
  }

  makeSpellsClickableOnCurrentPlayersBoard() {
    this.playerBoards[this.core.getCurrentPlayerId()]!.makeSpellsClickable();
  }

  makeSpellsNotClickableOnCurrentPlayersBoard() {
    this.playerBoards[this.core.getCurrentPlayerId()]!.makeSpellsNotClickable();
  }
}
