import fs from "fs";

export default async function handler(req, res) {
  const { file } = req.query;
  const [fileName] = file;
  console.log(file);
  const filePath = `uploads/${fileName}`;

  try {
    const data = fs.readFileSync(filePath);

    // res.setHeader("Content-Type", "application/dash+xml");
    res.write(data);
    res.end();
    return;
  } catch (e) {
    res.status(500).send({ success: false, error: "can't find path" });
    console.log("error occurred while send static file");
    return;
  }
  res.status(500);
  res.send("Internal Server error");
  res.end();
  return;
}
