import fs from "fs";

export default async function handler(req, res) {
  const title = req.query.title;
  try {
    const fileData =
      JSON.parse(fs.readFileSync("db/tmpData.json").toString()) || [];

    const data = fileData.find((e) => e.title === title);
    if (!data) {
      res.send("can't find progress data");
    }
    const progress = data.progress;
    res.send(progress);
  } catch (e) {
    res.send("some error occurred");
  }
}
