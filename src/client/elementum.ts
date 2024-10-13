/*
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * Elementum implementation : © Tomasz Karczewski imralav@gmail.com
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 */
/// <amd-module name="bgagame/elementum"/>

import Gamegui = require("ebg/core/gamegui");
import CommonMixer = require("cookbook/common");
import { ElementumGameInterface } from "./gui/ElementumGameInterface";
import { Spell } from "./spells/Spell";
import { State } from "./states/State";
import { NoopState } from "./states/NoopState";
import { PickSpellState } from "./states/PickSpellState";
import { SpellDestinationChoiceState } from "./states/SpellDestinationChoiceState";
import { Templates } from "./common/Templates";
import { onNotification } from "./Notifications";
import { PlayersDraftState } from "./states/PlayersDraftState";
import { GameInfoPanel } from "./gui/GameInfoPanel";
import { Element } from "./spells/elementum.types";
import { UniversalElementDestinationChoiceState } from "./states/UniversalElementDestinationChoiceState";
import { announce } from "./gui/Announcement";
import { DestroyTargetSelectionState } from "./states/DestroyTargetSelectionState";
import { AddFromSpellPoolSpellSelectionState } from "./states/AddFromSpellPoolSpellSelectionState";
import { ExchangeWithSpellPoolUniversalElementSpellDestinationState } from "./states/ExchangeWithSpellPoolUniversalElementSpellDestinationState";
import { CopyImmediateSpellSelectionState } from "./states/CopyImmediateSpellSelectionState";
import { ExchangeWithSpellPoolSpellOnBoardSelectionState } from "./states/ExchangeWithSpellPoolSpellOnBoardSelectionState";
import { ExchangeWithSpellPoolSpellFromPoolSelectionState } from "./states/ExchangeWithSpellPoolSpellFromPoolSelectionState";
import { PlacingPowerCrystalsState } from "./states/PlacingPowerCrystalsState";

/** The root for all of your game code. */
export class Elementum extends CommonMixer(Gamegui) {
  // myGlobalValue: number = 0;
  // myGlobalArray: string[] = [];
  private gui!: ElementumGameInterface;
  private static instance: Elementum;
  private allSpells: Spell[] = [];
  private states: Record<string, State> = {};

  static getInstance() {
    return Elementum.instance;
  }

  /** @gameSpecific See {@link Gamegui} for more information. */
  constructor() {
    super();
    Elementum.instance = this;
  }

  /** @gameSpecific See {@link Gamegui.setup} for more information. */
  setup(gamedatas: Gamedatas): void {
    console.log("Starting game setup");
    this.setupNotifications();
    console.log("Full gamedatas", gamedatas);
    this.allSpells = gamedatas.allSpells;
    this.gui = ElementumGameInterface.init({
      spellPool: Object.values(gamedatas.spellPool),
      playerHand: Object.values(gamedatas.currentPlayerHand),
      pickedSpell: gamedatas.pickedSpell,
      crystalsInPile: gamedatas.crystalsInPile,
      crystalsPerPlayer: gamedatas.crystalsPerPlayer,
      crystalsPerSpell: gamedatas.crystalsPerSpell,
      playerBoards: gamedatas.playerBoards,
      core: this,
    });
    this.gui.whenSpellOnHandClicked((spell) => {
      this.getCurrentState().spellOnHandClicked(spell);
    });
    this.gui.whenSpellOnBoardClicked((playerId, spell, element) => {
      this.getCurrentState().spellOnBoardClicked(playerId, spell, element);
    });
    this.gui.whenSpellPoolClicked((spell) => {
      this.getCurrentState().spellOnSpellPoolClicked(spell);
    });
    this.gui.whenElementSourceClickedOnCurrentPlayer((playerId, element) => {
      this.getCurrentState().elementSourceClicked(playerId, element);
    });
    this.createStates();
    GameInfoPanel.updateCurrentRound(gamedatas.currentRound);
    announce("Current round: " + gamedatas.currentRound + "/3", 2000);
  }

  private getCurrentStateName() {
    return (
      this.gamedatas.gamestate.private_state?.name ||
      this.gamedatas.gamestate.name ||
      "noop"
    );
  }

  private getCurrentState() {
    return this.getStateByName(this.getCurrentStateName());
  }

  private createStates() {
    this.states = {
      spellChoice: new PickSpellState(this.gui),
      spellDestinationChoice: new SpellDestinationChoiceState(this, this.gui),
      playersDraft: new PlayersDraftState(this, this.gui),
      noop: new NoopState(),
      universalElementSpellDestination:
        new UniversalElementDestinationChoiceState(this.gui),
      destroyTargetSelection: new DestroyTargetSelectionState(this.gui),
      addFromSpellPool_spellSelection:
        new AddFromSpellPoolSpellSelectionState(),
      addFromSpellPool_universalElementSpellDestination:
        new ExchangeWithSpellPoolUniversalElementSpellDestinationState(
          this.gui,
          this
        ),
      copyImmediateSpell_spellSelection: new CopyImmediateSpellSelectionState(
        this.gui
      ),
      exchangeWithSpellPool_spellOnBoardSelection:
        new ExchangeWithSpellPoolSpellOnBoardSelectionState(this.gui),
      exchangeWithSpellPool_spellFromSpellPoolSelection:
        new ExchangeWithSpellPoolSpellFromPoolSelectionState(this),
      exchangeWithSpellPool_universalElementSpellDestination:
        new ExchangeWithSpellPoolUniversalElementSpellDestinationState(
          this.gui,
          this
        ),
      placingPowerCrystals: new PlacingPowerCrystalsState(this.gui, this),
    };
  }

  private getStateByName(stateName: GameStateName) {
    return this.states[stateName] ?? this.states.noop!;
  }

  getSpellByNumber(spellNumber: Spell["number"]) {
    return this.allSpells[spellNumber - 1];
  }

  ///////////////////////////////////////////////////
  //// Game & client states

  /** @gameSpecific See {@link Gamegui.onEnteringState} for more information. */
  onEnteringState(stateName: GameStateName, args: CurrentStateArgs): void {
    console.log("Entering state: " + stateName);
    this.setStateBasedOnName(stateName);
  }

  private setStateBasedOnName(stateName: GameStateName) {
    this.getStateByName(stateName).onEnter();
  }

  setTextBeforeCancelButton(text: string) {
    dojo.place(Templates.textBeforeCancelButton(text), "cancel", "before");
  }

  /** @gameSpecific See {@link Gamegui.onLeavingState} for more information. */
  onLeavingState(stateName: GameStateName): void {
    console.log("Leaving state: " + stateName);
    this.getStateByName(stateName).onLeave();
  }

  clearTextAfterGeneralActions() {
    dojo.destroy("text-before-cancel-button");
  }

  /** @gameSpecific See {@link Gamegui.onUpdateActionButtons} for more information. */
  onUpdateActionButtons(
    stateName: GameStateName,
    args: AnyGameStateArgs | null
  ): void {
    console.log("onUpdateActionButtons: " + stateName, args);
    this.getStateByName(stateName).onUpdateActionButtons(args);
  }

  ///////////////////////////////////////////////////
  //// Utility methods

  /*
		Here, you can defines some utility methods that you can use everywhere in your typescript
		script.
	*/

  addCancelButton(text: string, onClick: () => void) {
    this.addActionButton("cancel", text, onClick, undefined, false, "red");
  }

  ///////////////////////////////////////////////////
  //// Player's action

  ///////////////////////////////////////////////////
  //// Reaction to cometD notifications

  /** @gameSpecific See {@link Gamegui.setupNotifications} for more information. */
  setupNotifications() {
    onNotification("spellPlayedOnBoard").do((notification: Notif) => {
      const playerId = notification.args!.player_id as PlayerId;
      const spell = notification.args!.spell as Spell;
      const element = notification.args!.element as Element;
      this.gui.putSpellOnBoard(playerId, spell, element);
    });
    onNotification("newHand").do((notification: Notif) => {
      this.gui.replaceHand(notification.args!.newHand as Spell[]);
    });
    onNotification("newSpellPoolCard").do((notification: Notif) => {
      const newSpellNumber = notification.args!
        .newSpellNumber as Spell["number"];
      this.gui.putSpellInSpellPool(newSpellNumber);
    });
    onNotification("youPaidCrystalForSpellPool").do((notification: Notif) => {
      this.gui.crystals.moveCrystalFromPlayerToPile(
        this.getCurrentPlayerId().toString()
      );
    });
    onNotification("otherPlayerPaidCrystalForSpellPool").do(
      (notification: Notif) => {
        this.gui.crystals.moveCrystalFromPlayerToPile(
          notification.args!.playerId as PlayerId
        );
      }
    );
    onNotification("newRound").do((notification: Notif) => {
      const round = notification.args!.round as number;
      GameInfoPanel.updateCurrentRound(round);
      announce("Round " + round + " started", 2000);
    });
    onNotification("elementPicked").do(() => {
      this.gui.makeElementSourcesNotClickableForCurrentPlayer();
    });
    onNotification("playerTookCrystal").do((notification: Notif) => {
      const playerId = notification.args!.playerId as PlayerId;
      this.gui.crystals.moveCrystalFromPileToPlayer(playerId);
    });
    onNotification("everyoneLostCrystal").do(() => {
      this.gui.crystals.moveCrystalFromAllPlayersToPile();
    });
    onNotification("playerDestroyedSpell").do((notification: Notif) => {
      console.log("Spell destroyed", notification.args);
      const victimPlayerId = notification.args!.victimPlayerId as PlayerId;
      const spellNumber = notification.args!.spellNumber as Spell["number"];
      this.gui.destroySpellOnBoard(victimPlayerId, spellNumber);
    });
    onNotification("playerAddedSpellFromPool").do((notification: Notif) => {
      console.log("Spell added from spell pool", notification.args);
      const playerId = notification.args!.playerId as PlayerId;
      const spellNumber = notification.args!.spellNumber as Spell["number"];
      const element = notification.args!.element as Element;
      const spell = this.getSpellByNumber(spellNumber);
      this.gui.putSpellOnBoard(playerId, spell!, element);
    });
    onNotification("exchangedSpellWithPool").do((notification: Notif) => {
      console.log("Spell exchanged with pool", notification.args);
      const playerId = notification.args!.playerId as PlayerId;
      const spellNumber = notification.args!.spellNumber as Spell["number"];
      const spellPoolNumber = notification.args!
        .spellPoolNumber as Spell["number"];
      const element = notification.args!.element as Element;
      const spellFromPool = this.getSpellByNumber(spellPoolNumber);
      this.gui.putSpellOnBoard(playerId, spellFromPool!, element);
      this.gui.putSpellInSpellPool(spellNumber);
    });
    onNotification("playerPlacedPowerCrystal").do((notification: Notif) => {
      const playerId = notification.args!.playerId as PlayerId;
      const spellNumber = notification.args!.spellNumber as Spell["number"];
      this.gui.crystals.moveCrystalFromPlayerToSpell(playerId, spellNumber);
    });
  }

  public performAction(action: keyof PlayerActions, args?: any): Promise<void> {
    return this.performActionInternal(action, args, false);
  }

  private performActionInternal(
    action: keyof PlayerActions,
    args: any,
    checkPossible: boolean
  ): Promise<void> {
    if (!args) {
      args = {};
    }
    args.lock = true;

    const checkMethod = checkPossible
      ? this.checkPossibleActions
      : this.checkAction;

    if (!checkMethod.call(this, action as never)) {
      return Promise.reject();
    }

    return new Promise<void>((resolve, reject) => {
      this.ajaxcall(
        "/" + this.game_name + "/" + this.game_name + "/" + action + ".html",
        args,
        this,
        (_) => {},
        (error) => {
          if (error) {
            console.error("Error performing action", action, args);
            reject();
          } else {
            resolve();
          }
        }
      );
    });
  }

  public performPossibleAction(
    action: keyof PlayerActions,
    args?: any
  ): Promise<void> {
    return this.performActionInternal(action, args, true);
  }
}

// The global 'bgagame.elementum' class is instantiated when the page is loaded. The following code sets this variable to your game class.
dojo.setObject("bgagame.elementum", Elementum);
// Same as: (window.bgagame ??= {}).elementum = Elementum;
