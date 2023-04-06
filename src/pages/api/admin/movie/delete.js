import { deletePendingMovie } from "@/helpers/api/data/movie";

export default async function handler(req, res) {
  const id = req.query.id;
  if (!id) {
    res.send({ success: false, error: "id required" });
    return;
  }

  const data = await deletePendingMovie(id);

  if (!data) {
    res.send({
      success: false,
      error: "can't find movie to delete form pending movies",
    });

    return;
  }

  res.send({ success: true });
}
