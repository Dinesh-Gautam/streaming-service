import { config } from "@/helpers/api/data/config";
import fs from "fs";

export default async function handler(req, res) {
  const uid = req.query.id;

  if (!uid) {
    res.send("id parameter is missing");
    return;
  }
  try {
    const fileData =
      JSON.parse(
        fs.readFileSync(config.dir + config.pendingMovies).toString()
      ) || [];

    const data = fileData.find((e) => e.uid === uid);
    if (!data) {
      res.send("can't find progress data");
      return;
    }
    const progress = data.progress || {};
    res.send(progress);
  } catch (e) {
    res.send({ success: false, error: "some error occurred" });
  }
}
