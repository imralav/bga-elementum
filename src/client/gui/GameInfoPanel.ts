import "ebg/counter";
import { Templates } from "../common/Templates";

export class GameInfoPanel {
  static readonly GAME_INFO_PANEL_ID = "game-info-panel";
  static readonly currentRoundCounter = new ebg.counter();

  static init() {
    dojo.place(Templates.gameInfoPanel(), "player_boards", "first");
    this.currentRoundCounter.create("current-round");
  }

  static updateCurrentRound(round: number) {
    this.currentRoundCounter.toValue(round);
  }
}
