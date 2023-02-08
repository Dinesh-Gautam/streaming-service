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
      return fileData;
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

    const movie = fileData.find((e) => e.uid === uid);
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

export function savePendingMovieData(data) {
  // saving not published movies
  if (!data) {
    return;
  }
  console.log("saving data");
  try {
    const fileData =
      JSON.parse(
        fs.readFileSync(config.dir + config.pendingMovies).toString()
      ) || [];
    if (fileData.some((e) => e.uid === data.uid)) {
      console.log("movie already exists");
      return null;
    }
    fileData.push(data);
    fs.writeFileSync(
      config.dir + config.pendingMovies,
      JSON.stringify(fileData)
    );
  } catch (error) {
    fs.writeFileSync(config.dir + config.pendingMovies, JSON.stringify([data]));
  }
  return null;
}

export function updateMovieProgressData(id, data) {
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
    const fileData =
      JSON.parse(
        fs.readFileSync(config.dir + config.pendingMovies).toString()
      ) || [];

    const movie = fileData.find((e) => e.uid === id);
    if (!movie) {
      console.log("can't find movie for updating progress data");
      return null;
    }
    fileData.map((e) => {
      if (e.uid === id) {
        e.progress = data;
      }
      return e;
    });
    fs.writeFileSync(
      config.dir + config.pendingMovies,
      JSON.stringify(fileData)
    );
  } catch (error) {
    // fs.writeFileSync("data.json", JSON.stringify([data]));
    console.error("some error occurred while updating the progress data");
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
    const { title, description, genres } = data;
    return { title, description, genres };
  } catch (e) {
    console.log(config.dir + config.movieData, "does not exists");
  }

  return null;
}
