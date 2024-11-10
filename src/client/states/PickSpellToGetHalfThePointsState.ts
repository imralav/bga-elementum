import { ActionsAPI } from "../ActionsAPI";
import { Elementum } from "../elementum";
import { ElementumGameInterface } from "../gui/ElementumGameInterface";
import { Element } from "../spells/elementum.types";
import { Spell } from "../spells/Spell";
import { NoopState } from "./NoopState";

export class PickSpellToGetHalfThePointsState extends NoopState {
  constructor(
    private gui: ElementumGameInterface,
    private elementum: Elementum
  ) {
    super();
  }

  public onEnter() {
    console.log("PickSpellToGetHalfThePointsState");
    this.gui.makeSpellsClickableOnCurrentPlayersBoard();
  }

  onUpdateActionButtons(args: AnyGameStateArgs | null): void {
    this.elementum.addCancelButton(_("Don't pick any spell"), () => {
      ActionsAPI.actDontPickSpellToGetHalfThePoints().then(() => {
        console.log("Cancelled spell choice");
      });
    });
  }

  spellOnBoardClicked(
    playerId: PlayerId,
    spell: Spell,
    element: Element
  ): void {
    if (+playerId != +this.elementum.getActivePlayerId()) {
      return;
    }
    console.log("Picking spell to get half the points", spell, element);
    ActionsAPI.actPickSpellToGetHalfThePoints(spell.number).then(
      () => {
        console.log("Picked spell to get half the points");
      },
      () => {
        console.error("Failed to pick spell to get half the points");
      }
    );
  }

  public onLeave() {
    console.log("PickSpellToGetHalfThePointsState");
    this.gui.makeSpellsNotClickableOnCurrentPlayersBoard();
  }
}
