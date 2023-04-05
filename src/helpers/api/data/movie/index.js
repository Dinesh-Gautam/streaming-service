import Pending from "../../../../db/schemas/pendingSchema";
import Progress from "../../../../db/schemas/progressSchema";
import { config } from "../config";

import fs from "fs";

export function getPublishedMovies() {
  // get all the original movies
  try {
    const fileData =
      JSON.parse(
        fs.readFileSync(config.dir + config.publishedMovies).toString()
      ) || [];

    if (fileData.length) {
      const data = fileData.map(
        ({
          title,
          genres,
          description,
          poster_path,
          backdrop_path,
          uid,
          first_air_date,
        }) => ({
          title,
          genres,
          description,
          poster_path,
          backdrop_path,
          uid,
          first_air_date,
        })
      );
      return data;
    }
    return null;
  } catch (e) {
    console.log(config.publishedMovies, "does not exists");
  }
  return null;
}

export function saveMovieToPublishedMovie(data) {
  // publishing movies
  if (!data) {
    console.log("data is required when publishing movies");
    return null;
  }

  if (!data.uid || !data.title) {
    console.log("uid and title are required when publishing movie");
    return null;
  }

  console.log("saving original movies");

  try {
    const fileData =
      JSON.parse(
        fs.readFileSync(config.dir + config.publishedMovies).toString()
      ) || [];

    const movie = fileData.find((e) => e.uid === data.uid);
    if (movie) {
      console.log("movie already exists");
      fileData.map((e) => {
        if (e.uid === data.uid) {
          return data;
        }
        return e;
      });
    } else {
      fileData.push(data);
    }

    fs.writeFileSync(
      config.dir + config.publishedMovies,
      JSON.stringify(fileData)
    );
  } catch (error) {
    console.error(error);
    console.log("creating new movies.json file");
    const fileData = [data];
    // fs.writeFileSync("data.json", JSON.stringify([data]));
    fs.writeFileSync(
      config.dir + config.publishedMovies,
      JSON.stringify(fileData)
    );
  }
  return null;
}

export function saveMovieData(data) {
  // contains urls for the movie
  if (!data) {
    console.log("data is required when saving movie data");
    return null;
  }
  const { uid } = data;
  console.log("saving movie data");
  try {
    const fileData =
      JSON.parse(fs.readFileSync(config.dir + config.movieData).toString()) ||
      [];

    const movie = fileData.find((e) => e.uid === uid);
    if (movie) {
      console.log("movie metadata already exists");
      fileData.map((e) => {
        if (e.uid === uid) {
          return { ...data };
        }
        return e;
      });
    } else {
      fileData.push(data);
    }

    fs.writeFileSync(config.dir + config.movieData, JSON.stringify(fileData));
  } catch (error) {
    const fileData = [data];
    //  fs.writeFileSync("data.json", JSON.stringify([data]));
    fs.writeFileSync(config.dir + config.movieData, JSON.stringify(fileData));
  }
  return null;
}

export async function savePendingMovieData(data) {
  // saving not published movies
  if (!data) {
    return;
  }
  console.log("saving pending data");
  try {
    const pending = new Pending(data);
    const schemaData = await pending.save();
    const id = schemaData._id.toString();
    const progress = new Progress({
      videoId: id,
      progressPercent: 0,
      completed: false,
      error: false,
    });
    await progress.save();
    return id;
  } catch (error) {
    console.log(error);
  }
  return null;
}

export async function updateMovieProgressData(id, data) {
  // updates the progress of the movie conversion to mpeg-dash format
  if (!data) {
    console.log("progress data not provided");
    return null;
  }
  if (!id) {
    console.log("no id provided for updating the progress data");
    return;
  }
  console.log("updating progress data");
  try {
    const progressData = await Progress.findOneAndUpdate(
      { videoId: id },
      { progressPercent: data.percent, ...data }
    );
    return progressData;
  } catch (error) {
    console.log(error);
  }
  return null;
}

export async function getProgressData(id) {
  try {
    const { videoId, progressPercent, completed, error } =
      await Progress.findOne({ videoId: id }, { __v: 0, _id: 0 });

    return {
      videoId: videoId.toString(),
      progressPercent,
      completed,
      error,
    };
  } catch (e) {
    console.log(e);
  }
  return null;
}

export function getMovieData(id) {
  // read file containing movie data such as url and other data
  if (!id) {
    console.log("id is required when getting movie data");
    return null;
  }
  try {
    const movieData =
      JSON.parse(fs.readFileSync(config.dir + config.movieData).toString()) ||
      [];
    const data = movieData.find((e) => e.uid == id);
    if (!data) {
      console.log("can't find movie data");
      return null;
    }
    return data;
  } catch (e) {
    console.log(config.dir + config.movieData, "does not exists");
  }

  return null;
}

export function deletePendingMovie(id) {
  if (!id) {
    console.log("id is required when deleting movie data");
    return null;
  }

  try {
    let pendingMovieData =
      JSON.parse(
        fs.readFileSync(config.dir + config.pendingMovies).toString()
      ) || [];
    const data = pendingMovieData.find((e) => e.uid == id);
    if (!data) {
      console.log("can't find movie data when deleting from pending movies");
      return null;
    }
    pendingMovieData = pendingMovieData.filter((e) => e.uid !== id);
    fs.writeFileSync(
      config.dir + config.pendingMovies,
      JSON.stringify(pendingMovieData)
    );
    return data;
  } catch (e) {
    console.log(config.dir + config.movieData, "does not exists");
  }

  return null;
}

export function getOriginalMovieDetails(id) {
  if (!id) {
    console.log("id is required when getting movie data");
    return null;
  }
  try {
    const movieData =
      JSON.parse(
        fs.readFileSync(config.dir + config.publishedMovies).toString()
      ) || [];
    const data = movieData.find((e) => e.uid == id);
    if (!data) {
      console.log("can't find movie data");
      return null;
    }
    return data;
  } catch (e) {
    console.log(config.dir + config.movieData, "does not exists");
  }

  return null;
}

export function editPendingMovieData(id, formData) {
  if (!id) {
    console.log("id is required when editing movie data");
    return null;
  }

  try {
    let pendingMovieData =
      JSON.parse(
        fs.readFileSync(config.dir + config.pendingMovies).toString()
      ) || [];
    const data = pendingMovieData.find((e) => e.uid == id);
    if (!data) {
      console.log("can't find movie data when editing from pending movies");
      return null;
    }
    console.log("changing data");
    pendingMovieData = pendingMovieData.map((e) =>
      e.uid == id ? { ...e, ...formData } : e
    );
    console.log(pendingMovieData);
    fs.writeFileSync(
      config.dir + config.pendingMovies,
      JSON.stringify(pendingMovieData)
    );
    return data;
  } catch (e) {
    console.log(config.dir + config.movieData, "does not exists");
  }

  return null;
}
