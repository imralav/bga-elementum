import CoreCore = require("bga-ts-template/typescript/types/ebg/core/core");
import Thumb = require("bga-ts-template/typescript/types/ebg/thumb");
import Zone = require("ebg/zone");
import { doAfter } from "../common/utils";

interface CrystalsPile {
  zone: Zone;
  element: HTMLElement;
}

export class Crystals {
  private static CRYSTALS_PILE_ID = "main-crystals-pile";
  private static CRYSTAL_SIZE = 25;
  private crystalsPilesPerPlayer: Record<PlayerId, CrystalsPile> = {};
  private crystalsPile!: CrystalsPile;
  private allCrystalsAmount = 0;

  constructor(
    amountOfCrystalsInPile: number,
    private amountOfCrystalsPerPlayer: Record<PlayerId, string>,
    private core: CoreCore
  ) {
    this.allCrystalsAmount =
      amountOfCrystalsInPile +
      +Object.values(amountOfCrystalsPerPlayer)
        .map((a) => +a)
        .reduce((a, b) => a + b, 0);
  }

  public putCrystalsOnBoardAndInPlayerPanels() {
    this.createCrystalsPileAndAddInitialCrystals();
    this.createCrystalsForPlayers();
  }

  private createCrystalsPileAndAddInitialCrystals() {
    this.createMainPile();
    this.addInitialCrystals();
  }

  private createMainPile() {
    const crystalsPile = $(Crystals.CRYSTALS_PILE_ID)! as HTMLElement;
    this.crystalsPile = { zone: new Zone(), element: crystalsPile };
    this.crystalsPile.zone.create(
      this.core,
      crystalsPile,
      Crystals.CRYSTAL_SIZE,
      Crystals.CRYSTAL_SIZE
    );
  }

  private addInitialCrystals() {
    for (let i = 0; i < this.allCrystalsAmount; i++) {
      const { id } = this.createCrystalElement(i);
      this.crystalsPile.zone.placeInZone(id, 1);
    }
  }

  private createCrystalElement(id: number) {
    const element = this.core.format_block("jstpl_crystal", { id });
    return dojo.place(element, Crystals.CRYSTALS_PILE_ID);
  }

  private createCrystalsForPlayers() {
    console.log("Creating crystals for players");
    this.addCrystalsPilesToPlayerPanels();
    this.dealInitialCrystalsToEachPlayer();
  }

  addCrystalsPilesToPlayerPanels() {
    Object.keys(this.amountOfCrystalsPerPlayer).forEach((playerId) => {
      this.createCrystalsPileForPlayer(playerId);
    });
  }

  createCrystalsPileForPlayer(playerId: PlayerId) {
    const crystalsPile = this.core.format_block(
      "jstpl_crystals_pile_on_player_panel",
      { playerId }
    );
    const pileInDom = dojo.place(crystalsPile, `player_board_${playerId}`);
    const crystalsPileZone = new Zone();
    crystalsPileZone.create(
      this.core,
      pileInDom,
      Crystals.CRYSTAL_SIZE,
      Crystals.CRYSTAL_SIZE
    );
    this.crystalsPilesPerPlayer[playerId] = {
      zone: crystalsPileZone,
      element: pileInDom,
    };
    return crystalsPile;
  }

  dealInitialCrystalsToEachPlayer() {
    for (const playerId of Object.keys(this.amountOfCrystalsPerPlayer)) {
      const amount = +(this.amountOfCrystalsPerPlayer[playerId] ?? 0);
      for (let i = 0; i < amount; i++) {
        doAfter(1000 * (2 + i), () =>
          this.moveCrystalFromPileToPlayer(playerId)
        );
      }
    }
  }

  private moveCrystalFromPileToPlayer(playerId: PlayerId) {
    const id = this.getIdOfFirstCrystalInPile();
    const crystalsPileOfPlayer = this.crystalsPilesPerPlayer[playerId]!;
    this.crystalsPile.zone.removeFromZone(
      id,
      false,
      crystalsPileOfPlayer.element.id
    );
    this.crystalsPilesPerPlayer[playerId]!.zone.placeInZone(id, 1);
  }

  private getIdOfFirstCrystalInPile() {
    const crystal = this.crystalsPile.element.childNodes[0] as HTMLElement;
    return crystal.id;
  }

  public moveCrystalsFromPlayerToPile(playerId: PlayerId, amount: number) {
    for (let i = 0; i < amount; i++) {
      doAfter(1000 * (2 + i), () => this.moveCrystalFromPlayerToPile(playerId));
    }
  }

  public moveCrystalFromPlayerToPile(playerId: PlayerId) {
    const id = this.getIdOfFirstCrystalInPlayerPile(playerId);
    const crystalsPileOfPlayer = this.crystalsPilesPerPlayer[playerId]!;
    crystalsPileOfPlayer.zone.removeFromZone(
      id,
      false,
      Crystals.CRYSTALS_PILE_ID
    );
    this.crystalsPile.zone.placeInZone(id, 1);
  }

  private getIdOfFirstCrystalInPlayerPile(playerId: PlayerId) {
    const crystal = this.crystalsPilesPerPlayer[playerId]!.element
      .childNodes[0] as HTMLElement;
    return crystal.id;
  }
}
