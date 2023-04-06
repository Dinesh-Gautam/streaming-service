const tmdbApiKey = process.env.TMDB_API_KEY;

export async function tmdbSearch(options) {
  if (options.q.length < 2) return [];
  const url = `
    https://api.themoviedb.org/3/search/multi?api_key=fd8ea79bd59be3f0f50502ac5ec6031e&language=en-US&query=${options.q}&page=1&include_adult=false`;
  const suggestions = await fetch(url).then((res) => res.json());
  const filter = suggestions.results?.filter(
    (item) =>
      (item.media_type === "movie" || item.media_type === "tv") &&
      item.poster_path &&
      (item.title || item.original_title || item.original_name)
  );
  if (!filter) return [];
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
      vote_average,
      vote_count,
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
            vote_average,
            vote_count,
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
            vote_average,
            vote_count,
          };
      }
    }
  );
  return filteredSuggestions;
}

export async function getPopularMovies(
  first = "movie",
  second = "popular",
  optionalPath
) {
  const url = `https://api.themoviedb.org/3/${first}/${second}${
    optionalPath ? "/" + optionalPath : ""
  }?api_key=${tmdbApiKey}`;

  const data = await fetch(url)
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
    });

  return addCommonElementsToObjectsOfArray(data.results, {
    media_type: first === "tv" || second === "tv" ? "tv" : "movie",
  });
}

function addCommonElementsToObjectsOfArray(array, elementsObj) {
  return array.map((item) => ({ ...item, ...elementsObj }));
}

export async function getVideosOfMovie(id, media_type) {
  if (!id || !media_type) return;
  const url = `https://api.themoviedb.org/3/${media_type}/${id}/videos?api_key=${tmdbApiKey}&language=en-US`;
  const data = await fetch(url)
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
    });
  return data.results;
}

export async function getReviews(id, media_type) {
  if (!id || !media_type) return;
  const url = `https://api.themoviedb.org/3/${media_type}/${id}/reviews?api_key=${tmdbApiKey}&language=en-US&page=1`;
  const data = await fetch(url)
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
    });
  return data;
}

export async function getWatchProviders(id, media_type) {
  if (!id || !media_type) return;
  const url = `https://api.themoviedb.org/3/${media_type}/${id}/watch/providers?api_key=${tmdbApiKey}&language=en-US&page=1`;
  const data = await fetch(url)
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
    });
  return data;
}
export async function getExternalIds(id, media_type) {
  if (!id || !media_type) return;
  const url = `https://api.themoviedb.org/3/${media_type}/${id}/external_ids?api_key=${tmdbApiKey}`;
  const data = await fetch(url)
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
    });
  return data;
}
