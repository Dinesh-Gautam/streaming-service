const api_key = "fd8ea79bd59be3f0f50502ac5ec6031e";

export async function searchSuggest(query, options = {}) {
  // console.log("fetching movie Info....");
  if (typeof query === "string") {
    try {
      const url = `
          https://api.themoviedb.org/3/search/multi?api_key=fd8ea79bd59be3f0f50502ac5ec6031e&language=en-US&query=${query}&page=1&include_adult=false`;
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
      return filteredSuggestions;
    } catch (e) {
      console.error(e);
    }
  }
  return null;
}

export async function getDetails(mediaId, mediaType, options = {}) {
  // console.log("fetching movie Info....");

  try {
    let results;

    if (options.type === "season") {
      const url = `https://api.themoviedb.org/3/${mediaType}/${mediaId}/season/${
        options.season || 1
      }?api_key=${api_key}`;
      results = await fetch(url).then((res) => res.json());
    } else {
      const url = `https://api.themoviedb.org/3/${mediaType}/${mediaId}?api_key=${api_key}&language=en-US`;
      results = await fetch(url).then((res) => res.json());
    }

    // console.log(results);
    const {
      release_date = null,
      media_type = mediaType,
      poster_path = null,
      title = null,
      original_name = null,
      original_title = null,
      name = null,
      id = null,
      first_air_date = null,
      genres = null,
      overview = null,
      backdrop_path = null,
      seasons = null,
      number_of_episodes = null,
      last_air_date = null,
      episode_run_time = null,
      number_of_seasons = null,
      air_date = null,
      episodes = null,
      season_number = null,
    } = results;
    switch (options.type) {
      case "tv":
        return {
          media_type,
          poster_path,
          title,
          original_name,
          original_title,
          name,
          id,
          first_air_date: first_air_date || release_date,
          genres,
          overview,
          backdrop_path,
          seasons,
          last_air_date,
          number_of_episodes,
          episode_run_time,
          number_of_seasons,
        };
      case "season":
        return {
          air_date,
          episodes: episodes.map(
            ({
              air_date,
              episode_number,
              id,
              name,
              overview,
              season_number,
              still_path,
            }) => {
              return {
                air_date,
                episode_number,
                id,
                name,
                overview,
                season_number,
                still_path,
              };
            }
          ),
          name,
          season_number,
          poster_path,
        };
      default:
        return {
          media_type,
          poster_path,
          title,
          original_name,
          original_title,
          name,
          id,
          first_air_date: first_air_date || release_date,
          genres,
          overview,
          backdrop_path,
        };
    }
  } catch (e) {
    console.error(e);
  }

  return null;
}

export function getImageUrl(path) {
  return `https://image.tmdb.org/t/p/original/${path}`;
}

export async function getGenre() {
  const movieUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}&language=en-US`;
  const tvUrl = `https://api.themoviedb.org/3/genre/tv/list?api_key=${api_key}&language=en-US`;

  try {
    const combinedPromises = await Promise.all([
      fetch(movieUrl).then((res) => res.json()),
      fetch(tvUrl).then((res) => res.json()),
    ]);
    const [movieGene, tvGene] = combinedPromises;
    return [...movieGene.genres, ...tvGene.genres];
  } catch (error) {
    console.log(error);
  }

  return null;
}
