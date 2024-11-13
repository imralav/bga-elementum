import { ActionsAPI } from "../ActionsAPI";
import { Elementum } from "../elementum";
import { ElementumGameInterface } from "../gui/ElementumGameInterface";
import { Element } from "../spells/elementum.types";
import { Spell } from "../spells/Spell";
import { NoopState } from "./NoopState";

export class PickSpellWithScoringActivationToCopyState extends NoopState {
  constructor(
    private gui: ElementumGameInterface,
    private elementum: Elementum
  ) {
    super();
  }

  public onEnter() {
    console.log("pickSpellWithScoringActivationToCopy");
    this.gui.makeSpellsClickableOnAllBoards();
  }

  onUpdateActionButtons(args: AnyGameStateArgs | null): void {
    if (!this.elementum.isCurrentPlayerActive()) {
      return;
    }
    this.elementum.addCancelButton(_("Don't pick any spell"), () => {
      ActionsAPI.actDontPickSpellWithScoringActivationToCopy().then(() => {
        console.log("Cancelled spell choice");
      });
    });
  }

  spellOnBoardClicked(
    playerId: PlayerId,
    spell: Spell,
    element: Element
  ): void {
    console.log("Picking spell to", spell, element);
    ActionsAPI.actPickSpellWithScoringActivationToCopy(spell.number).then(
      () => {
        console.log("Picked spell");
      },
      () => {
        console.error("Failed to pick spell");
      }
    );
  }

  public onLeave() {
    console.log("PickSpellWithScoringActivationToCopyState");
    this.gui.makeSpellsNotClickableOnAllBoards();
  }
}
