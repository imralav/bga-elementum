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
      .performAction("actAddFromSpellPool_CancelDestinationChoice")
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

  public static async actExchangeWithSpellPool_SelectSpellOnBoard(
    spellNumber: Spell["number"]
  ): Promise<void> {
    return Elementum.getInstance()
      .performAction("actExchangeWithSpellPool_SelectSpellOnBoard", {
        spellNumber,
      })
      .catch(() => {
        throw new Error("Error exchanging with spell pool");
      });
  }

  public static async actExchangeWithSpellPool_CancelSpellOnBoardChoice() {
    return Elementum.getInstance()
      .performAction("actExchangeWithSpellPool_CancelSpellOnBoardChoice")
      .catch(() => {
        throw new Error("Error cancelling exchange with spell pool");
      });
  }

  public static async actExchangeWithSpellPool_SelectSpellFromPool(
    spellNumberFromPool: Spell["number"]
  ): Promise<void> {
    return Elementum.getInstance()
      .performAction("actExchangeWithSpellPool_SelectSpellFromPool", {
        spellNumberFromPool,
      })
      .catch(() => {
        throw new Error("Error exchanging with spell pool");
      });
  }

  public static async actExchangeWithSpellPool_CancelElementDestinationChoice() {
    return Elementum.getInstance()
      .performAction("actExchangeWithSpellPool_CancelElementDestinationChoice")
      .catch(() => {
        throw new Error("Error cancelling exchange with spell pool");
      });
  }

  public static async actExchangeWithSpellPool_PickTargetElement(
    element: Element
  ): Promise<void> {
    return Elementum.getInstance()
      .performAction("actExchangeWithSpellPool_PickTargetElement", { element })
      .catch(() => {
        throw new Error("Error using element source");
      });
  }

  public static async actDontPlacePowerCrystal() {
    return Elementum.getInstance()
      .performAction("actDontPlacePowerCrystal")
      .catch(() => {
        throw new Error("Error cancelling crystal placement");
      });
  }

  public static async actPlacePowerCrystal(spellNumber: Spell["number"]) {
    return Elementum.getInstance()
      .performAction("actPlacePowerCrystal", { spellNumber })
      .catch(() => {
        throw new Error("Error placing power crystal");
      });
  }

  public static async dontPickVirtualElementSources() {
    return Elementum.getInstance()
      .performAction("actPickVirtualElementSources", {
        virtualElements: JSON.stringify({}),
      })
      .catch(() => {
        throw new Error("Error cancelling virtual element sources");
      });
  }

  public static async actPickVirtualElementSources(
    virtualElements: VirtualElementsCandidates
  ) {
    return Elementum.getInstance()
      .performAction("actPickVirtualElementSources", {
        virtualElements: JSON.stringify(virtualElements),
      })
      .catch(() => {
        throw new Error("Error picking virtual element sources");
      });
  }
}
