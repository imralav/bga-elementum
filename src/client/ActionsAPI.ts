import { Elementum } from "./elementum";
import { Element } from "./spells/elementum.types";
import { Spell } from "./spells/Spell";

export class ActionsAPI {
  public static async pickSpell(spellNumber: Spell["number"]): Promise<void> {
    return Elementum.getInstance()
      .performAction("actPickSpell", { spellNumber })
      .catch(() => {
        throw new Error("Error picking spell");
      });
  }

  public static async cancelSpellChoice(): Promise<void> {
    return Elementum.getInstance()
      .performAction("actCancelSpellChoice")
      .catch(() => {
        throw new Error("Error cancelling spell choice");
      });
  }

  public static async playSpell(): Promise<void> {
    return Elementum.getInstance()
      .performAction("actPlaySpell")
      .catch(() => {
        throw new Error("Error playing spell");
      });
  }

  public static async useSpellPool(
    spellFromPoolNumber: Spell["number"]
  ): Promise<void> {
    return Elementum.getInstance()
      .performAction("actUseSpellPool", { spellFromPoolNumber })
      .catch(() => {
        throw new Error("Error using spell pool");
      });
  }

  public static async cancelDraftChoice(): Promise<void> {
    return Elementum.getInstance()
      .performPossibleAction("actCancelDraftChoice")
      .catch(() => {
        throw new Error("Error cancelling draft choice");
      });
  }

  public static async useElementSource(element: Element): Promise<void> {
    return Elementum.getInstance()
      .performAction("actPickTargetElement", { element })
      .catch(() => {
        throw new Error("Error using element source");
      });
  }
}
