import { ActionsAPI } from "../ActionsAPI";
import { Elementum } from "../elementum";
import { ElementumGameInterface } from "../gui/ElementumGameInterface";
import { NoopState } from "./NoopState";

export class PlayersDraftState extends NoopState {
  constructor(
    private elementum: Elementum,
    private gui: ElementumGameInterface
  ) {
    super();
  }
  onUpdateActionButtons(): void {
    this.elementum.addCancelButton(_("Cancel"), () =>
      ActionsAPI.cancelDraftChoice().then(() => {
        this.gui.unpickSpellOnHand();
        this.gui.unpickSpellOnSpellPool();
      })
    );
  }
}
