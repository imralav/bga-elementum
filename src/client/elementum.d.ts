/*
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * Elementum implementation : © Tomasz Karczewski imralav@gmail.com
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 */

import { Spell } from "./spells/Spell";
import { ElementSource } from "./spells/elementum.types";

// If you have any imports/exports in this file, 'declare global' is access/merge your game specific types with framework types. 'export {};' is used to avoid possible confusion with imports/exports.
declare global {
  /** @gameSpecific Add game specific notifications / arguments here. See {@link NotifTypes} for more information. */
  interface NotifTypes {
    // [name: string]: any; // Uncomment to remove type safety on notification names and arguments
  }
  type PlayerBoardAndElementSources = {
    elementSources: ElementSource["type"][];
    board: Record<ElementSource["type"], Spell["number"][]>;
  };

  /** @gameSpecific Add game specific gamedatas arguments here. See {@link Gamedatas} for more information. */
  interface Gamedatas {
    // [key: string | number]: Record<keyof any, any>; // Uncomment to remove type safety on game state arguments
    allSpells: Spell[];
    spellPool: Record<number, Spell>;
    spellsLeftInDeck: number;
    elementSources: ElementSource[];
    currentPlayerHand: Record<number, Spell>;
    pickedSpell?: Spell["number"];
    crystalsInPile: number;
    crystalsPerPlayer: Record<PlayerId, string>;
    playerBoards: Record<PlayerId, PlayerBoardAndElementSources>;
    currentRound: number;
  }

  //
  // When gamestates.jsonc is enabled in the config, the following types are automatically generated. And you should not add to anything to 'GameStates' or 'PlayerActions'. If gamestates.jsonc is enabled, 'GameStates' and 'PlayerActions' can be removed from this file.
  //

  interface GameStates {
    // [id: number]: string | { name: string, argsType: object} | any; // Uncomment to remove type safety with ids, names, and arguments for game states
    "-1": "dummmy"; // Added so 'dummy' case in examples can compile.
    1: "gameSetup";
    99: { name: "gameEnd"; argsType: {} };
  }

  /** @gameSpecific Add game specific player actions / arguments here. See {@link PlayerActions} for more information. */
  interface PlayerActions {
    // [action: string]: Record<keyof any, any>; // Uncomment to remove type safety on player action names and arguments
    actPickSpell: string;
    actCancelSpellChoice: string;
    actPlaySpell: string;
    actUseSpellPool: string;
    actCancelDraftChoice: string;
    actPickTargetElement: string;
    actSelectDestroyTarget: string;
    actAddFromSpellPool_SelectSpell: string;
    actAddFromSpellPool_PickTargetElement: string;
    actAddFromSpellPool_CancelDestinationChoice: string;
    actCopyImmediateSpell_selectSpell: string;
    actExchangeWithSpellPool_SelectSpellOnBoard: string;
    actExchangeWithSpellPool_SelectSpellFromPool: string;
    actExchangeWithSpellPool_CancelSpellOnBoardChoice: string;
    actExchangeWithSpellPool_PickTargetElement: string;
    actExchangeWithSpellPool_CancelElementDestinationChoice: string;
  }

  type PlayerId = string;
}

export {}; // Force this file to be a module.
