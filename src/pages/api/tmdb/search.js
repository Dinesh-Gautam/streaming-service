export default async function handler(req, res) {
  const options = req.query;

  try {
    const url = `
            https://api.themoviedb.org/3/search/multi?api_key=fd8ea79bd59be3f0f50502ac5ec6031e&language=en-US&query=${options.q}&page=1&include_adult=false`;
    const suggestions = await fetch(url).then((res) => res.json());
    const filter = suggestions.results.filter(
      (item) =>
        (item.media_type === "movie" || item.media_type === "tv") &&
        item.poster_path &&
        (item.title || item.original_title || item.original_name)
    );
    const filteredSuggestions = filter.map(
      ({
        release_date = null,
        media_type,
        poster_path,
        title = null,
        id,
        original_name = null,
        original_title = null,
        name = null,
        first_air_date = null,
        genre_ids,
        overview,
        backdrop_path,
      }) => {
        switch (options.type) {
          case "detailed":
            return {
              media_type,
              poster_path,
              title,
              original_name,
              original_title,
              name,
              id,
              first_air_date: first_air_date || release_date,
              genre_ids,
              overview,
              backdrop_path,
            };

          default:
            return {
              first_air_date: first_air_date || release_date,
              media_type,
              poster_path,
              title,
              original_name,
              original_title,
              name,
              id,
            };
        }
      }
    );
    console.log(filteredSuggestions);
    res.send({ success: true, data: filteredSuggestions });
  } catch (e) {
    console.error(e);
    res.send({ success: false, error: e.message });
  }
}
