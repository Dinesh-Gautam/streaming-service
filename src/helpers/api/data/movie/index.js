import { config } from "../config";

import fs from "fs";

export function getPublishedMovies() {
  // get all the original movies
  const fileData =
    JSON.parse(
      fs.readFileSync(config.dir + config.publishedMovies).toString()
    ) || [];

  if (fileData.length) {
    return fileData;
  }
  return null;
}

export function saveMovieToPublishedMovie(data) {
  // publishing movies
  if (!data) {
    return;
  }
  const { uid, title } = data;
  console.log("saving original movies");
  try {
    const fileData =
      JSON.parse(
        fs.readFileSync(config.dir + config.publishedMovies).toString()
      ) || [];

    const movie = fileData.find((e) => e.uid === uid);
    if (movie) {
      console.log("movie metadata already exists");
      fileData.map((e) => {
        if (e.uid === uid) {
          return { uid, title };
        }
        return e;
      });
    }

    fileData.push({ uid, title });

    fs.writeFileSync(
      config.dir + config.publishedMovies,
      JSON.stringify(fileData)
    );
  } catch (error) {
    const fileData = [{ uid, title }];
    // fs.writeFileSync("data.json", JSON.stringify([data]));
    fs.writeFileSync(
      config.dir + config.publishedMovies,
      JSON.stringify(fileData)
    );
  }
}

export function saveMovieData(data) {
  // contains urls for the movie
  if (!data) {
    return;
  }
  const { uid } = data;
  console.log("saving metaData");
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
    }

    fs.writeFileSync(config.dir + config.movieData, JSON.stringify(fileData));
  } catch (error) {
    const fileData = [data];
    //  fs.writeFileSync("data.json", JSON.stringify([data]));
    fs.writeFileSync(config.dir + config.movieData, JSON.stringify(fileData));
  }
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
    if (fileData.some((e) => e.title === data.title)) {
      console.log("movie already exists");
      return;
    }
    fileData.push(data);
    fs.writeFileSync(
      config.dir + config.pendingMovies,
      JSON.stringify(fileData)
    );
  } catch (error) {
    fs.writeFileSync(config.dir + config.pendingMovies, JSON.stringify([data]));
  }
}

export function updateMovieProgressData(title, data) {
  // updates the progress of the movie conversion to mpeg-dash format
  if (!data) {
    return;
  }
  console.log("saving data");
  try {
    const fileData =
      JSON.parse(
        fs.readFileSync(config.dir + config.pendingMovies).toString()
      ) || [];

    const movie = fileData.find((e) => e.title === title);
    if (!movie) {
      console.log("can't find movie");
      return;
    }
    fileData.map((e) => {
      if (e.title === title) {
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
    console.error("some error occurred");
  }
}
