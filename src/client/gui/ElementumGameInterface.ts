import { RIGHT_ARROW } from "dojo/keys";
import { ActionsAPI } from "../api/ActionsAPI";
import { Elementum } from "../elementum";
import { Spell } from "../spells/Spell";
import { Crystals } from "./Crystals";
import { PlayerBoard } from "./PlayerBoard";
import { OnSpellClicked, Spells } from "./Spells";
import { moveElementOnAnimationSurface } from "./animations";
import { Templates } from "../common/Templates";
import { Element } from "../spells/elementum.types";

export interface ElementumGameInterfaceInput {
  spellPool: Spell[];
  playerHand: Spell[];
  pickedSpell?: Spell["number"]; //TODO: shouldnt happen in constructor but in separate method, invoked outside
  crystalsInPile: number;
  crystalsPerPlayer: Record<string, string>;
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
  private playerBoards!: Record<PlayerId, PlayerBoard>;
  private playerHand!: Spells;
  private spellPool!: Spells;

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
  }

  public static init(input: ElementumGameInterfaceInput) {
    const gui = new ElementumGameInterface(
      input.spellPool,
      input.playerHand,
      new Crystals(input.crystalsInPile, input.crystalsPerPlayer, input.core),
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

  private buildSpellPool(spellPool: Spell[]) {
    this.spellPool = new Spells("spell-pool", spellPool, this);
  }

  private buildPlayerHand(playerHand: Spell[]) {
    this.playerHand = new Spells("current-player-hand", playerHand, this);
  }

  buildPlayerBoards(playerBoards: Gamedatas["playerBoards"]) {
    this.playerBoards = Object.fromEntries(
      Object.entries(playerBoards).map(([playerId, playerBoard]) => {
        return [playerId, new PlayerBoard(playerId, playerBoard, this.core)];
      })
    );
  }

  putSpellOnBoard(playerId: PlayerId, spell: Spell) {
    if (!this.spellExistsOnBoard(spell)) {
      this.spawnSpellOnBoard(spell);
    }
    const columnId = Templates.idOfSpellColumn(playerId, spell.element);
    const spellId = Templates.idOfSpell(spell);
    moveElementOnAnimationSurface(spellId, columnId, 2000);
  }

  spellExistsOnBoard(spell: Spell) {
    return !!$(Templates.idOfSpell(spell));
  }

  spawnSpellOnBoard(spell: Spell) {
    const spellTemplate = Templates.spell(spell);
    dojo.place(spellTemplate, "cards-spawn-point");
  }

  replaceHand(hand: Spell[]) {
    this.playerHand.replaceSpells(hand);
  }

  pickSpell(spellNumber: Spell["number"]) {
    this.playerHand.pickSpell(spellNumber);
  }

  unpickSpell() {
    this.playerHand.unpickSpell();
  }

  pickSpellOnSpellPool(spellNumber: Spell["number"]) {
    this.spellPool.pickSpell(spellNumber);
  }

  unpickSpellOnSpellPool() {
    this.spellPool.unpickSpell();
  }

  putSpellInSpellPool(spellNumber: Spell["number"]) {
    this.spellPool.addSpell(this.core.getSpellByNumber(spellNumber)!);
  }

  removeSpellInSpellPool(spellNumber: Spell["number"]) {
    this.spellPool.removeSpell(this.core.getSpellByNumber(spellNumber)!);
  }

  //TODO: do zaorania
  pickSpell2(spellNumber: Spell["number"]) {
    const pickedSpellElement = $(`spell_${spellNumber}`) as HTMLElement;
    if (pickedSpellElement) {
      dojo.addClass(pickedSpellElement, "picked");
    } else {
      console.error("Couldn't find spell with number", spellNumber);
    }
  }

  //TODO: do zaorania
  unpickSpell2(spellNumber: Spell["number"]) {
    const pickedSpellElement = $(`spell_${spellNumber}`) as HTMLElement;
    if (pickedSpellElement) {
      dojo.removeClass(pickedSpellElement, "picked");
    } else {
      console.error("Couldn't find spell with number", spellNumber);
    }
  }
}
