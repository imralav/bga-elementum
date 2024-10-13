import Zone = require("ebg/zone");
import { doAfter } from "../common/utils";
import { Elementum } from "../elementum";
import { Spell } from "../spells/Spell";
import { Templates } from "../common/Templates";

interface CrystalsPile {
  zone: Zone;
  element: HTMLElement;
}

export class Crystals {
  private static CRYSTALS_PILE_ID = "main-crystals-pile";
  private static CRYSTAL_SIZE = 16;
  private crystalsPilesPerPlayer: Record<PlayerId, CrystalsPile> = {};
  private crystalsPilesPerSpell: Record<Spell["number"], CrystalsPile> = {};
  private crystalsPile!: CrystalsPile;
  private allCrystalsAmount = 0;

  constructor(
    amountOfCrystalsInPile: number,
    private amountOfCrystalsPerPlayer: Record<PlayerId, number>,
    private crystalsPerSpell: Record<Spell["number"], number>,
    private core: Elementum
  ) {
    const amountOfCrystalsInPlayerPiles = +Object.values(
      amountOfCrystalsPerPlayer
    )
      .map((a) => +a)
      .reduce((a, b) => a + b, 0);
    const amountOfCrystalsOnSpells = +Object.values(crystalsPerSpell)
      .map((a) => +a)
      .reduce((a, b) => a + b, 0);
    this.allCrystalsAmount =
      amountOfCrystalsInPile +
      amountOfCrystalsInPlayerPiles +
      amountOfCrystalsOnSpells;
  }

  public putCrystalsOnBoardAndInPlayerPanels() {
    this.createMainCrystalsPileAndAddInitialCrystals();
    this.createCrystalsForPlayers();
  }

  public putCrystalsOnSpells() {
    Object.keys(this.crystalsPerSpell).forEach((spellNumber) => {
      this.createCrystalPileForSpell(+spellNumber);
      const amount = +(this.crystalsPerSpell[+spellNumber] ?? 0);
      for (let i = 0; i < amount; i++) {
        doAfter(1000 * (2 + i), () =>
          this.moveCrystalFromPileToSpell(+spellNumber)
        );
      }
    });
  }

  private createCrystalPileForSpell(spellNumber: number) {
    const crystalsPile = Templates.idOfCrystalsForSpell(spellNumber);
    const pileInDom = $(crystalsPile)! as HTMLElement;
    const crystalsPileZone = new Zone();
    crystalsPileZone.create(
      this.core,
      pileInDom,
      Crystals.CRYSTAL_SIZE,
      Crystals.CRYSTAL_SIZE
    );
    this.crystalsPilesPerSpell[spellNumber] = {
      zone: crystalsPileZone,
      element: pileInDom,
    };
  }

  moveCrystalFromPileToSpell(spellNumber: Spell["number"]) {
    const id = this.getIdOfFirstCrystalInPile();
    const crystalsPileOfSpell = this.crystalsPilesPerSpell[spellNumber]!;
    this.crystalsPile.zone.removeFromZone(
      id,
      false,
      crystalsPileOfSpell.element.id
    );
    crystalsPileOfSpell.zone.placeInZone(id, 1);
  }

  private createMainCrystalsPileAndAddInitialCrystals() {
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

  moveCrystalFromPileToPlayer(playerId: PlayerId) {
    const id = this.getIdOfFirstCrystalInPile();
    const crystalsPileOfPlayer = this.crystalsPilesPerPlayer[playerId]!;
    this.moveCristal(id).from(this.crystalsPile).to(crystalsPileOfPlayer);
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
    this.moveCristal(id).from(crystalsPileOfPlayer).to(this.crystalsPile);
  }

  private getIdOfFirstCrystalInPlayerPile(playerId: PlayerId) {
    const crystal = this.crystalsPilesPerPlayer[playerId]!.element
      .childNodes[0] as HTMLElement;
    return crystal.id;
  }

  public moveCrystalFromAllPlayersToPile() {
    for (const playerId of Object.keys(this.crystalsPilesPerPlayer)) {
      if (
        this.crystalsPilesPerPlayer[playerId]!.element.childNodes.length > 0
      ) {
        this.moveCrystalFromPlayerToPile(playerId);
      }
    }
  }

  public moveCrystalFromPlayerToSpell(playerId: string, spellNumber: number) {
    const crystalId = this.getIdOfFirstCrystalInPlayerPile(playerId);
    const crystalsPileOfPlayer = this.crystalsPilesPerPlayer[playerId]!;
    if (!this.crystalsPileOnSpellExists(spellNumber)) {
      this.createCrystalPileForSpell(spellNumber);
    }
    const spellCrystalsPile = this.crystalsPilesPerSpell[spellNumber]!;
    this.moveCristal(crystalId)
      .from(crystalsPileOfPlayer)
      .to(spellCrystalsPile);
  }

  private moveCristalBetweenPiles(
    crystalId: string,
    from: CrystalsPile,
    to: CrystalsPile
  ) {
    from.zone.removeFromZone(crystalId, false, to.element.id);
    to.zone.placeInZone(crystalId, 1);
  }

  private moveCristal(crystalId: string) {
    return {
      from: (from: CrystalsPile) => ({
        to: (to: CrystalsPile) => {
          from.zone.removeFromZone(crystalId, false, to.element.id);
          to.zone.placeInZone(crystalId, 1);
        },
      }),
    };
  }

  private crystalsPileOnSpellExists(spellNumber: number) {
    return !!this.crystalsPilesPerSpell[spellNumber];
  }
}
