import { announce } from "../gui/Announcement";
import { NoopState } from "./NoopState";

export class AnnounceOnEnterState extends NoopState {
  private announcementCounter = 0;
  constructor(private message: string, private limit = 1) {
    super();
  }

  public onEnter() {
    console.log("AnnounceOnEnterState");
    if (this.canAnnounce()) {
      this.announceAndIncrementCounter(this.message);
    }
  }

  private canAnnounce() {
    return this.announcementCounter < this.limit;
  }

  private announceAndIncrementCounter(message: string) {
    announce(message);
    this.announcementCounter++;
  }
}
