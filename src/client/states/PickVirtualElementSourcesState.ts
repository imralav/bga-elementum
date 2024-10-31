import { ActionsAPI } from "../ActionsAPI";
import { Elementum } from "../elementum";
import { ElementumGameInterface } from "../gui/ElementumGameInterface";
import { NoopState } from "./NoopState";

export class PickVirtualElementSourcesState extends NoopState {
  constructor(
    private elementum: Elementum,
    private gui: ElementumGameInterface
  ) {
    super();
  }

  onEnter(args: CurrentStateArgs): void {
    if (!args.args) {
      console.error("No args provided to PickVirtualElementSourcesState");
    }
    const virtualElements =
      args.args as GameStateArgs<"pickVirtualElementSources">;
    console.log("Picking virtual elements with args", virtualElements);
    // this.gui.showVirtualElementSources(virtualElements);
  }

  onUpdateActionButtons(args: AnyGameStateArgs | null): void {
    if (!this.elementum.isCurrentPlayerActive()) {
      return;
    }
    this.elementum.addCancelButton(
      _("Don't pick any virtual element sources"),
      () => {
        ActionsAPI.dontPickVirtualElementSources().then(() => {});
      }
    );
  }

  onLeave(): void {
    // this.gui.hideVirtualElementSources();
  }
}
