import { getOriginalMovies } from "@/helpers/api/data/config";

export default async function handler(req, res) {
  // gat movies from data.json
  const movies = getOriginalMovies();
  // return movies list isth with id
  res.send(movies);
}
