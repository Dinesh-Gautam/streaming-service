import { publishMovie } from "@/helpers/api/data/admin";

export default async function handler(req, res) {
  const id = req.query.id;

  if (!id) {
    req.send("id parameter is missing");
    return;
  }

  const data = publishMovie(id);

  if (data) {
    res.send({ success: true });
  } else {
    res.send({ success: false });
  }
}
