import { config } from "@/helpers/api/data/config";
import fs from "fs";

export default async function handler(req, res) {
  const title = req.query.title;
  try {
    const fileData =
      JSON.parse(
        fs.readFileSync(config.dir + config.pendingMovies).toString()
      ) || [];

    const data = fileData.find((e) => e.title === title);
    if (!data) {
      res.send("can't find progress data");
    }
    const progress = data.progress || {};
    res.send(progress);
  } catch (e) {
    res.send({ success: false, error: "some error occurred" });
  }
}
