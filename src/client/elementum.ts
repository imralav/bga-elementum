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
import "ebg/counter";
import CommonMixer = require("cookbook/common");
import { ElementumGameInterface } from "./gui/ElementumGameInterface";
import { ActionsAPI } from "./api/ActionsAPI";
import { Spell } from "./spells/Spell";
import { State } from "./states/State";
import { NoopState } from "./states/NoopState";
import { PickSpellState } from "./states/PickSpellState";
import { SpellDestinationChoiceState } from "./states/SpellDestinationChoiceState";

/** The root for all of your game code. */
export class Elementum extends CommonMixer(Gamegui) {
  // myGlobalValue: number = 0;
  // myGlobalArray: string[] = [];
  private gui!: ElementumGameInterface;
  private static instance: Elementum;
  private state: State = new NoopState();
  private allSpells: Spell[] = [];

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

    // Setting up player boards
    for (var player_id in gamedatas.players) {
      var player = gamedatas.players[player_id];
      // TODO: Setting up players boards if needed
    }

    // TODO: Set up your game interface here, according to "gamedatas"

    // Setup game notifications to handle (see "setupNotifications" method below)
    this.setupNotifications();

    console.log("Full gamedatas", gamedatas);

    this.allSpells = gamedatas.allSpells;

    this.gui = ElementumGameInterface.init({
      spellPool: Object.values(gamedatas.spellPool),
      playerHand: Object.values(gamedatas.currentPlayerHand),
      pickedSpell: gamedatas.pickedSpell,
      crystalsInPile: gamedatas.crystalsInPile,
      crystalsPerPlayer: gamedatas.crystalsPerPlayer,
      playerBoards: gamedatas.playerBoards,
      core: this,
    });
    this.gui.whenSpellOnHandClicked((spell) => {
      this.state.spellClicked(spell);
    });
    this.gui.whenSpellPoolClicked((spell) => {
      this.state.spellOnSpellPoolClicked(spell);
    });

    console.log("Ending game setup");
    dojo.connect($("animation-test-button"), "onclick", (event: Event) => {
      const animationId = this.slideToObject("actor", "box2", 2000, 500);
      dojo.connect(animationId, "onEnd", () => {
        this.attachToNewParentNoDestroy("actor", "box2");
      });
      animationId.play();
    });
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
    switch (stateName) {
      case "spellDestinationChoice":
        this.setTextBeforeCancelButton(
          _(", pick a Spell from the Spell Pool or ")
        );
        break;
    }
  }

  private setStateBasedOnName(stateName: GameStateName) {
    switch (stateName) {
      case "spellChoice":
        this.state = new PickSpellState(this.gui);
        break;
      case "spellDestinationChoice":
        this.state = new SpellDestinationChoiceState(this.gui);
        break;
      default:
        this.state = new NoopState();
    }
  }

  private setTextBeforeCancelButton(text: string) {
    console.log("Setting text after general actions", text);
    dojo.place(
      `<span id="text-before-cancel-button">${text}</span>`,
      "cancel",
      "before"
    );
  }

  /** @gameSpecific See {@link Gamegui.onLeavingState} for more information. */
  onLeavingState(stateName: GameStateName): void {
    console.log("Leaving state: " + stateName);
    this.state.onLeave();
    switch (stateName) {
      case "spellDestinationChoice":
        this.clearTextAfterGeneralActions();
        break;
    }
  }

  private clearTextAfterGeneralActions() {
    dojo.destroy("text-before-cancel-button");
  }

  /** @gameSpecific See {@link Gamegui.onUpdateActionButtons} for more information. */
  onUpdateActionButtons(
    stateName: GameStateName,
    args: AnyGameStateArgs | null
  ): void {
    console.log("onUpdateActionButtons: " + stateName, args);
    switch (stateName) {
      case "spellDestinationChoice":
        this.addActionButton(
          "playSpellBtn",
          _("Play the Spell on your board"),
          () => ActionsAPI.playSpell()
        );
        this.addCancelButton(_("Cancel"), () => {
          ActionsAPI.cancelSpellChoice().then(() => {
            this.gui.unpickSpell();
          });
        });
        break;
      case "playersDraft":
        this.addCancelButton(_("Cancel"), () =>
          ActionsAPI.cancelDraftChoice().then(() => {
            this.gui.unpickSpell();
            this.gui.unpickSpellOnSpellPool();
          })
        );
        break;
    }
  }

  ///////////////////////////////////////////////////
  //// Utility methods

  /*
		Here, you can defines some utility methods that you can use everywhere in your typescript
		script.
	*/

  private addCancelButton(text: string, onClick: () => void) {
    this.addActionButton("cancel", text, onClick, undefined, false, "red");
  }

  ///////////////////////////////////////////////////
  //// Player's action

  ///////////////////////////////////////////////////
  //// Reaction to cometD notifications

  /** @gameSpecific See {@link Gamegui.setupNotifications} for more information. */
  setupNotifications() {
    this.on("spellPlayedOnBoard").do((notification: Notif) => {
      console.log("Spell played on board notification", notification);
      const playerId = notification.args!.player_id as PlayerId;
      const spell = notification.args!.spell as Spell;
      if (this.isCurrentPlayer(playerId)) {
        this.gui.moveSpellFromHandToBoard(playerId, spell);
      } else {
        this.gui.putSpellOnBoard(playerId, spell);
      }
    });
    this.on("newHand").do((notification: Notif) => {
      this.gui.replaceHand(notification.args!.newHand as Spell[]);
    });
    this.on("newSpellPoolCard").do((notification: Notif) => {
      const newSpellNumber = notification.args!
        .newSpellNumber as Spell["number"];
      const oldSpellNumber = notification.args!
        .oldSpellNumber as Spell["number"];
      this.gui.putSpellInSpellPool(newSpellNumber);
      this.gui.removeSpellInSpellPool(oldSpellNumber);
    });
    this.on("youPaidCrystalForSpellPool").do((notification: Notif) => {
      this.gui.crystals.moveCrystalFromPlayerToPile(
        this.getCurrentPlayerId().toString()
      );
    });
    this.on("otherPlayerPaidCrystalForSpellPool").do((notification: Notif) => {
      this.gui.crystals.moveCrystalFromPlayerToPile(
        notification.args!.playerId as PlayerId
      );
    });
  }

  private on(notificationName: string) {
    return {
      do: (callback: (notification: Notif) => void) => {
        dojo.subscribe(notificationName, this, callback);
      },
    };
  }

  private isCurrentPlayer(playerId: PlayerId) {
    return +playerId === this.player_id;
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
