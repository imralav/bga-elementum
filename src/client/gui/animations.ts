import { clone } from "dojo/_base/lang";

/**
 * Taken from VictoriaLa's codepen: https://codepen.io/VictoriaLa/pen/gORvdJo
 * This function is used to clone an element on the animation surface
 * and return the cloned element
 *
 * @param idOfElementToClone - id of the element to clone
 * @param postfix - postfix to add to the id of the cloned element, as id must be unique
 * @returns the cloned element
 */
export function cloneOnAnimationSurface(
  idOfElementToClone: string,
  postfix: string
) {
  var elementToClone = $(idOfElementToClone);
  if (!elementToClone) {
    console.error("Element to clone not found", idOfElementToClone);
    return;
  }
  var animationSurface = $("animation-surface");
  if (!animationSurface) {
    console.error("Animation surface not found");
    return;
  }
  var parent: HTMLElement | null = elementToClone.parentNode as HTMLElement;
  var elementRectangle = elementToClone.getBoundingClientRect();

  var centerY = elementRectangle.y + elementRectangle.height / 2;
  var centerX = elementRectangle.x + elementRectangle.width / 2;

  var newId = elementToClone.id + postfix;
  var existingElementByNewId = $(newId);
  existingElementByNewId?.parentNode?.removeChild(existingElementByNewId);
  var clone = elementToClone.cloneNode(true) as HTMLElement;
  clone.id = newId;

  // this caclculates transitive maxtrix for transformations of the parent
  // so we can apply it oversurface to match exact scale and rotate
  var fullmatrix = "";
  while (
    parent != animationSurface.parentNode &&
    parent != null &&
    parent != document
  ) {
    var styleOfParent = window.getComputedStyle(parent);
    var transformationMatrixOfParent = styleOfParent.transform; //|| "matrix(1,0,0,1,0,0)";

    if (
      transformationMatrixOfParent &&
      transformationMatrixOfParent != "none" //TODO: coś zrobić, by lepiej działało gdy jest none, bo teraz skacze
    ) {
      fullmatrix += " " + transformationMatrixOfParent;
    }
    parent = parent.parentNode as HTMLElement;
  }

  // Doing this now means I can use getBoundingClientRect
  animationSurface.appendChild(clone);

  var cloneRect = clone.getBoundingClientRect();

  // centerX/Y is where the center point must be
  // I need to calculate the offset from top and left
  // Therefore I remove half of the dimensions + the existing offset
  var offsetY = centerY - cloneRect.height / 2 - cloneRect.y;
  var offsetX = centerX - cloneRect.width / 2 - cloneRect.x;

  // Finally apply the offects and transform - we should have exact copy of object but on different parent
  clone.style.left = offsetX + "px";
  clone.style.top = offsetY + "px";
  clone.style.transform = fullmatrix;
  clone.style.position = "absolute";
  return clone;
}

/**
1. Clone the original on the oversurface
2. Turn it transparent
3. Add it to a new parent
4. Clone it on the oversurface after moving it (so that we have destination coords)
5. Transition the clone (set left, top, transform with transformDuration). Instant action, it fires the CSS animation immediately
6. remove the destination, as it just duplicates the original in the new parent.
7. Wait the specified duration, then make it visible (remove opacity)
8. Remove the clone
*/
export function moveElementOnAnimationSurface(
  elementToMoveId: string,
  newParentId: string,
  durationInMs: number = 1000
) {
  var elementToMove = $(elementToMoveId) as HTMLElement;
  var newParent = $(newParentId) as HTMLElement;
  console.log("Cloning mobile object");
  var clone = cloneOnAnimationSurface(elementToMove.id, "_animated");
  if (!clone) {
    console.error("Clone not found");
    return Promise.reject("Clone not found");
  }
  console.log("Making it opaque");
  elementToMove.style.opacity = "0.25";
  console.log("Adding the original to new parent");
  newParent.appendChild(elementToMove);

  console.log(
    "Cloning mobile object when it's already in new place, to have destination coordinates"
  );
  var temporaryDestinationElement = cloneOnAnimationSurface(
    elementToMove.id,
    "_animation_destination"
  );
  if (!temporaryDestinationElement) {
    console.error("Destination not found");
    return Promise.reject("Destination not found");
  }

  console.log("Transitioning the clone to where the second clone is pointing");
  clone.style.position = "absolute";
  clone.style.transitionDuration = durationInMs + "ms";
  //clone.offsetTop;
  clone.style.left = temporaryDestinationElement.style.left;
  clone.style.top = temporaryDestinationElement.style.top;
  clone.style.transform = temporaryDestinationElement.style.transform;
  //console.log(desti.style.top, clone.style.top);
  temporaryDestinationElement.parentNode?.removeChild(
    temporaryDestinationElement
  );
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      elementToMove.style.removeProperty("opacity");
      if (clone && clone.parentNode) clone.parentNode.removeChild(clone);
      resolve();
    }, durationInMs);
  });
}
