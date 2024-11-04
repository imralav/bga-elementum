import { Handle } from "dojo";
import { Templates } from "../common/Templates";
import { SelectedVirtualElementSourcesTracker } from "../states/SelectedVirtualElementSourcesTracker";

export class VirtualElementSources {
  private tracker: SelectedVirtualElementSourcesTracker =
    SelectedVirtualElementSourcesTracker.startTracking();
  private handles: Handle[] = [];

  public constructor(
    private virtualElementSourcesCandidates: VirtualElementsCandidates
  ) {}

  showVirtualElementSourcesAndMakeThemClickable() {
    for (const spellNumber in this.virtualElementSourcesCandidates) {
      const elements = this.virtualElementSourcesCandidates[spellNumber];
      if (!elements) {
        continue;
      }
      const spellElementId = Templates.idOfSpellByNumber(+spellNumber);
      const containerTemplate = Templates.virtualElementSourcesContainer();
      const containerElement = dojo.place(containerTemplate, spellElementId);
      for (const element of elements) {
        const virtualElementTemplate = Templates.virtualElementSource(element);
        const virtualElementElement = dojo.place(
          virtualElementTemplate,
          containerElement
        );
        const clickHandle = dojo.connect(
          virtualElementElement,
          "onclick",
          () => {
            if (this.tracker.isSelected(+spellNumber, element)) {
              this.tracker.deselect(+spellNumber, element);
              dojo.removeClass(virtualElementElement, "selected");
            } else if (this.tracker.canSelectMoreElements()) {
              dojo.addClass(virtualElementElement, "selected");
              this.tracker.select(+spellNumber, element);
            }
          }
        );
        this.handles.push(clickHandle);
      }
    }
  }

  getSelectedElements() {
    return this.tracker.getSelectedElements();
  }

  hideVirtualElementSources() {
    this.tracker.clear();
    this.handles.forEach((handle) => dojo.disconnect(handle));
    this.destroyVirtualElementCandidatesContainers();
  }

  private destroyVirtualElementCandidatesContainers() {
    dojo
      .query(".virtual-element-sources-container")
      .forEach((node) => dojo.destroy(node));
  }
}
