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

  public static async destroyTarget(
    spellNumber: Spell["number"],
    victimPlayerId: PlayerId
  ): Promise<void> {
    return Elementum.getInstance()
      .performAction("actSelectDestroyTarget", {
        spellNumber,
        victimPlayerId,
      })
      .catch(() => {
        throw new Error("Error destroying target");
      });
  }

  public static async actAddFromSpellPool_SelectSpell(
    spellNumber: Spell["number"]
  ): Promise<void> {
    return Elementum.getInstance()
      .performAction("actAddFromSpellPool_SelectSpell", {
        spellNumber,
      })
      .catch(() => {
        throw new Error("Error using spell pool");
      });
  }

  public static async actAddFromSpellPool_PickTargetElement(
    element: Element
  ): Promise<void> {
    return Elementum.getInstance()
      .performAction("actAddFromSpellPool_PickTargetElement", { element })
      .catch(() => {
        throw new Error("Error using element source");
      });
  }

  public static async actAddFromSpellPool_CancelDestinationChoice(): Promise<void> {
    return Elementum.getInstance()
      .performPossibleAction("actAddFromSpellPool_CancelDestinationChoice")
      .catch(() => {
        throw new Error("Error cancelling draft choice");
      });
  }

  public static async actCopyImmediateSpell_selectSpell(
    spellNumber: Spell["number"]
  ): Promise<void> {
    return Elementum.getInstance()
      .performAction("actCopyImmediateSpell_selectSpell", {
        spellNumber,
      })
      .catch(() => {
        throw new Error("Error copying immediate spell");
      });
  }
}
