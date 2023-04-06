import { getPublishedMovies } from "@/helpers/api/data/movie";

export default async function handler(req, res) {
  // gat movies from data.json
  const movies = await getPublishedMovies();
  // return movies list isth with id
  if (movies) {
    res.send(movies);
  } else {
    res.send({ success: false });
  }
}
