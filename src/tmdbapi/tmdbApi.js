// todo: implement this on the server side and protect api key

const api_key = process.env.TMDB_API_KEY;

export async function searchSuggest(query, options = {}) {
  // console.log("fetching movie Info....");
  if (typeof query === "string") {
    const result = await fetch(
      "/api/tmdb/search?q=" +
        query +
        Object.keys(options).map((key) => "&" + key + "=" + options[key])
    );
    const data = await result.json();

    if (data.success) {
      return data.data;
    }
  }
  return null;
}

export async function getDetails(mediaId, mediaType, options = {}) {
  // console.log("fetching movie Info....");
  try {
    let results;

    if (options.type === "season") {
      console.log("searching for season");
      const url = `https://api.themoviedb.org/3/${mediaType}/${mediaId}/season/${
        options.season || 1
      }?api_key=${api_key}`;

      results = await fetch(url).then((res) => res.json());
    } else {
      const url = `https://api.themoviedb.org/3/${mediaType}/${mediaId}?api_key=${api_key}&language=en-US&append_to_response=external_ids`;

      results = await fetch(url).then((res) => res.json());
    }
    let {
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
      vote_average = null,
      vote_count = null,
      languages = null,
      runtime = null,
      homepage = null,
      original_language = null,
      production_countries = null,
      spoken_languages = null,
      revenue = null,
      status = null,
      tagline = null,
      external_ids = null,
    } = results;
    const { imdb_id } = external_ids ?? { imdb_id: null };
    let logo = null;

    if (imdb_id) {
      // get media logo
      const streamioUrl = `https://v3-cinemeta.strem.io/meta/${
        media_type === "movie" ? media_type : "series"
      }/${imdb_id}.json`;
      const { meta } = await fetch(streamioUrl).then((res) => res.json());
      logo = meta.logo;
      vote_average = Number(meta.imdbRating);
    }

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
          vote_average,
          vote_count,
          languages,
          runtime,
          homepage,
          original_language,
          production_countries,
          spoken_languages,
          revenue,
          status,
          tagline,
          logo,
          imdb_id,
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
          vote_average,
          vote_count,
          languages,
          runtime,
          homepage,
          original_language,
          production_countries,
          spoken_languages,
          revenue,
          status,
          tagline,
          logo,
          imdb_id,
        };
    }
  } catch (e) {
    console.error(e);
  }

  return null;
}

export function getImageUrl(path, options) {
  if (options?.original) {
    return `/api/static${path}`;
  } else {
    return `https://image.tmdb.org/t/p/${
      options?.size ? "w" + options?.size : "original"
    }${path}`;
  }
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
