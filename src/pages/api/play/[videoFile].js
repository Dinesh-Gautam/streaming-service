import fs from "fs";

export default async function handler(req, res) {
  const { videoFile } = req.query;
  const filePath = `converted/mpdVideos/1675168824280-prototype v0.1 (2)/${videoFile}`;

  try {
    const data = fs.readFileSync(filePath);

    res.setHeader("Content-Type", "application/dash+xml");
    res.send(data);
  } catch (e) {
    res.status(500).send({ success: false, error: "can't find path" });
    console.log("error occurred while send video file");
  }
}
