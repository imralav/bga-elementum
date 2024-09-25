import { ActionsAPI } from "../ActionsAPI";
import { Elementum } from "../elementum";
import { ElementumGameInterface } from "../gui/ElementumGameInterface";
import { Spell } from "../spells/Spell";
import { NoopState } from "./NoopState";

export class SpellDestinationChoiceState extends NoopState {
  constructor(
    private elementum: Elementum,
    private gui: ElementumGameInterface
  ) {
    super();
  }

  onEnter(): void {
    this.elementum.setTextBeforeCancelButton(
      _(" to pick a Spell from the Spell Pool.")
    );
  }

  onUpdateActionButtons(args: AnyGameStateArgs | null): void {
    this.elementum.addActionButton(
      "playSpellBtn",
      _("Play the Spell on your board"),
      () => ActionsAPI.playSpell()
    );
    this.elementum.addCancelButton(_("Cancel"), () => {
      ActionsAPI.cancelSpellChoice().then(() => {
        this.gui.unpickSpellOnHand();
      });
    });
  }

  spellOnSpellPoolClicked(spell: Spell) {
    console.log("Spell pool clicked", spell);
    ActionsAPI.useSpellPool(spell.number)
      .then(() => {
        console.log("Picking spell on pool", spell.number);
        this.gui.pickSpellOnSpellPool(spell.number);
      })
      .catch((error) => {
        console.error("Error picking spell pool", error);
      });
  }

  onLeave(): void {
    this.elementum.clearTextAfterGeneralActions();
  }
}
