import MovieData from "../../../../db/schemas/movieData";
import Movie from "../../../../db/schemas/movieSchema";
import Pending from "../../../../db/schemas/pendingSchema";
import Progress from "../../../../db/schemas/progressSchema";
import { config } from "../config";

import fs from "fs";

export async function getPublishedMovies() {
  // get all the original movies
  try {
    const fileData = await Movie.find();

    if (fileData.length) {
      const data = fileData.map(
        ({
          title,
          genres,
          description,
          poster_path,
          backdrop_path,
          _id,
          first_air_date,
        }) => ({
          title,
          genres,
          description,
          poster_path,
          backdrop_path,
          uid: _id.toString(),
          first_air_date,
        })
      );
      return data;
    }
    return null;
  } catch (e) {
    console.log("some error occurred");
  }
  return null;
}

export async function saveMovieToPublishedMovie(data) {
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
    const movieData = new Movie({
      ...data,
      _id: data.uid,
      video: JSON.parse(data.video),
      poster: JSON.parse(data.poster),
      backdrop: JSON.parse(data.backdrop),
    });
    const published = await movieData.save();
    await Pending.deleteOne({ _id: data.uid });

    console.log(published);
    return movieData;
  } catch (error) {
    console.error(error);

    // fs.writeFileSync("data.json", JSON.stringify([data]));
  }
  return null;
}

export async function saveMovieData(data) {
  // contains urls for the movie
  if (!data) {
    console.log("data is required when saving movie data");
    return null;
  }
  const { uid } = data;
  console.log("saving movie data");
  try {
    const movieData = new MovieData({ ...data, videoId: uid });
    return await movieData.save();
  } catch (error) {
    console.log("some error occurred");
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

export async function getMovieData(id) {
  // read file containing movie data such as url and other data
  if (!id) {
    console.log("id is required when getting movie data");
    return null;
  }

  try {
    const { title, videoFileName, videoFileDir, videoId } =
      await MovieData.findOne({ videoId: id });
    return { title, videoFileName, videoFileDir, uid: videoId };
  } catch (e) {
    console.log("some error occured");
  }
  return null;
}

export async function deletePendingMovie(id) {
  if (!id) {
    console.log("id is required when deleting movie data");
    return null;
  }

  try {
    const data = await Pending.deleteOne({ _id: id });
    return data;
  } catch (e) {
    console.log("some error occurred");
  }

  return null;
}

export async function getOriginalMovieDetails(id) {
  if (!id) {
    console.log("id is required when getting movie data");
    return null;
  }
  try {
    const {
      title,
      description,
      genres,
      first_air_date,
      media_type,
      poster_path,
      backdrop_path,
      _id,
    } = await Movie.findOne({ _id: id });

    return {
      title,
      description,
      genres,
      first_air_date,
      media_type,
      poster_path,
      backdrop_path,
      uid: _id.toString(),
    };
  } catch (e) {
    console.log("some error occurred");
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
