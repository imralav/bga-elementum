import { ActionsAPI } from "../ActionsAPI";
import { ElementumGameInterface } from "../gui/ElementumGameInterface";
import { Element } from "../spells/elementum.types";
import { NoopState } from "./NoopState";

export class UniversalElementDestinationChoiceState extends NoopState {
  constructor(private gui: ElementumGameInterface) {
    super();
  }

  onEnter(): void {
    this.gui.makeElementSourcesClickableForCurrentPlayer();
  }

  onLeave(): void {
    this.gui.makeElementSourcesNotClickableForCurrentPlayer();
  }

  elementSourceClicked(playerId: PlayerId, element: Element): void {
    console.log("Element source clicked", element);
    ActionsAPI.useElementSource(element)
      .then(() => {
        console.log("Picking element source", element);
      })
      .catch((error) => {
        console.error("Error picking element source", error);
      });
  }
}
