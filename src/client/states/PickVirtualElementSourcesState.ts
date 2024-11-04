import { ActionsAPI } from "../ActionsAPI";
import { Elementum } from "../elementum";
import { VirtualElementSources } from "../gui/VirtualElementSources";
import { NoopState } from "./NoopState";

export class PickVirtualElementSourcesState extends NoopState {
  private virtualElementSources?: VirtualElementSources;
  constructor(private elementum: Elementum) {
    super();
  }

  onEnter(args: CurrentStateArgs): void {
    if (!args.args) {
      console.error("No args provided to PickVirtualElementSourcesState");
    }
    const { virtualElements } =
      args.args as GameStateArgs<"pickVirtualElementSources">;
    console.log("Picking virtual elements with args", virtualElements);
    this.virtualElementSources = new VirtualElementSources(virtualElements);
    this.virtualElementSources.showVirtualElementSourcesAndMakeThemClickable();
  }

  onUpdateActionButtons(): void {
    if (!this.elementum.isCurrentPlayerActive()) {
      return;
    }
    this.elementum.addActionButton(
      "confirm",
      _("Pick selected virtual element sources"),
      () => {
        const selectedElements =
          this.virtualElementSources?.getSelectedElements() ?? {};
        console.log("Picking virtual element sources", selectedElements);
        ActionsAPI.actPickVirtualElementSources(selectedElements).then(() => {
          console.log("picked virtual elements");
        });
      },
      undefined,
      false,
      "blue"
    );
    this.elementum.addCancelButton(
      _("Don't pick any virtual element sources"),
      () => {
        ActionsAPI.dontPickVirtualElementSources().then(() => {});
      }
    );
  }

  onLeave(): void {
    this.virtualElementSources?.hideVirtualElementSources();
    this.virtualElementSources = undefined;
  }
}
