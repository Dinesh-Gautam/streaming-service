import fs from "fs";

export default async function handler(req, res) {
  const { videoFile } = req.query;
  const filePath = `converted/mpdVideos/1675056732291-zoom_0/${videoFile}`;
  console.log(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.status(500).send({ success: false, error: "can't find path" });
    } else {
      res.setHeader("Content-Type", "application/dash+xml");
      res.send(data);
    }
  });
}
