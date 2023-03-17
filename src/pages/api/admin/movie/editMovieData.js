import { editPendingMovieData } from "@/helpers/api/data/movie";

export default async function handler(req, res) {
  const id = req.query.id;
  const formData = JSON.parse(req.body);
  console.log(formData);
  //   return null;
  if (!id) {
    res.send({ success: false, error: "id required" });
    return;
  }

  const data = editPendingMovieData(id, formData);

  if (!data) {
    res.send({
      success: false,
      error: "can't find movie to delete form pending movies",
    });

    return;
  }

  res.send({ success: true });
}
