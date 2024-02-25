import { onPage } from "../../src/extension/extension";

class WatchNow {
  name = "watch now";
  id = "watch_now";

  constructor() {
    this.init();
  }

  async init() {
    onPage(this.id, "title", async (page) => {
      const { id, media_type } = page.params;
      // perform heavy tast
      await new Promise(async (resolve, reject) => {
        setTimeout(() => console.log("timeout") || resolve(), 2000);
      });

      page.addElement("button", {
        content: "watch now",
        icon: null,
        onClick: () => console.log("clicked"),
      });
    });
  }
}

export default WatchNow;
