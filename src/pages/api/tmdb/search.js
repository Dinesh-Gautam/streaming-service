import { tmdbSearch } from "../../../helpers/api/search/tmdb";

export default async function handler(req, res) {
  const options = req.query;

  try {
    const tmdbResult = await tmdbSearch(options);
    res.send({ success: true, data: tmdbResult });
  } catch (e) {
    console.error(e);
    res.send({ success: false, error: e.message });
  }
}
