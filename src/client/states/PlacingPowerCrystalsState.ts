import { ActionsAPI } from "../ActionsAPI";
import { Elementum } from "../elementum";
import { ElementumGameInterface } from "../gui/ElementumGameInterface";
import { Element } from "../spells/elementum.types";
import { Spell } from "../spells/Spell";
import { NoopState } from "./NoopState";

export class PlacingPowerCrystalsState extends NoopState {
  constructor(
    private gui: ElementumGameInterface,
    private elementum: Elementum
  ) {
    super();
  }

  onEnter(): void {
    this.gui.makeSpellsClickableOnCurrentPlayersBoard();
  }

  spellOnBoardClicked(
    playerId: PlayerId,
    spell: Spell,
    element: Element
  ): void {
    ActionsAPI.actPlacePowerCrystal(spell.number)
      .then(() => {
        console.log("Placed power crystal");
      })
      .catch((error) => {
        console.error("Failed to place power crystal", error);
      });
  }

  onUpdateActionButtons(args: AnyGameStateArgs | null): void {
    this.elementum.addCancelButton(_("Cancel"), () => {
      ActionsAPI.actDontPlacePowerCrystal()
        .then(() => {
          console.log("Cancelled crystal placement");
        })
        .catch((error) => {
          console.error("Failed to cancel crystal placement", error);
        });
    });
  }
}
