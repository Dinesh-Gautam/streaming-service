import { getPublishedMovies } from "@/helpers/api/data/movie";

export default async function handler(req, res) {
  // gat movies from data.json
  const movies = getPublishedMovies();
  // return movies list isth with id
  res.send(movies);
}
