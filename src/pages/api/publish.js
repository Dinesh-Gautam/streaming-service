import { publishMovie } from "@/helpers/api/data";

export default async function handler(req, res) {
  const id = req.query.id;

  if (!id) {
    req.send("id parameter is missing");
  }

  publishMovie(id);

  res.send({ success: true });
}
