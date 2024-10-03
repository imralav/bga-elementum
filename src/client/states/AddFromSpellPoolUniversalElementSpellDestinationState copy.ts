import { ActionsAPI } from "../ActionsAPI";
import { Elementum } from "../elementum";
import { ElementumGameInterface } from "../gui/ElementumGameInterface";
import { Element } from "../spells/elementum.types";
import { NoopState } from "./NoopState";

export class AddFromSpellPoolUniversalElementSpellDestinationState extends NoopState {
  constructor(
    private gui: ElementumGameInterface,
    private elementum: Elementum
  ) {
    super();
  }

  onEnter(): void {
    this.gui.makeElementSourcesClickableForCurrentPlayer();
  }

  onLeave(): void {
    this.gui.makeElementSourcesNotClickableForCurrentPlayer();
  }

  onUpdateActionButtons(args: AnyGameStateArgs | null): void {
    this.elementum.addCancelButton(_("Cancel"), () =>
      ActionsAPI.actAddFromSpellPool_CancelDestinationChoice().then(() => {
        this.gui.unpickSpellOnSpellPool();
      })
    );
  }

  elementSourceClicked(playerId: PlayerId, element: Element): void {
    console.log("Element source clicked", element);
    ActionsAPI.actAddFromSpellPool_PickTargetElement(element)
      .then(() => {
        console.log("Picking element source", element);
      })
      .catch((error) => {
        console.error("Error picking element source", error);
      });
  }
}
