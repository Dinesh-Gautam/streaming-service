import fs from "fs";

const dir = "db/";

export function saveMovieData(data) {
  if (!data) {
    return;
  }
  console.log("saving data");
  try {
    const fileData =
      JSON.parse(fs.readFileSync(dir + "tmpData.json").toString()) || [];
    if (fileData.some((e) => e.title === data.title)) {
      console.log("movie already exists");
      return;
    }
    fileData.push(data);
    fs.writeFileSync(dir + "tmpData.json", JSON.stringify(fileData));
  } catch (error) {
    fs.writeFileSync(dir + "tmpData.json", JSON.stringify([data]));
  }
}

export function saveProgressData(title, data) {
  if (!data) {
    return;
  }
  console.log("saving data");
  try {
    const fileData =
      JSON.parse(fs.readFileSync(dir + "tmpData.json").toString()) || [];

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
    fs.writeFileSync(dir + "tmpData.json", JSON.stringify(fileData));
  } catch (error) {
    // fs.writeFileSync("data.json", JSON.stringify([data]));
    console.error("some error occurred");
  }
}

export function getPendingUploads(id) {
  try {
    const data =
      JSON.parse(fs.readFileSync(dir + "tmpData.json").toString()) || null;

    if (id !== undefined && data) {
      return data.find((e) => e.uid === id);
    }

    return data;
  } catch (e) {
    console.log("tmpData.json does not exists");
    return null;
  }
}

export function saveVideoMetadata(data) {
  if (!data) {
    return;
  }
  const { uid } = data;
  console.log("saving metaData");
  try {
    const fileData =
      JSON.parse(fs.readFileSync(dir + "movieData.json").toString()) || [];

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

    fs.writeFileSync(dir + "movieData.json", JSON.stringify(fileData));
  } catch (error) {
    const fileData = [data];
    // fs.writeFileSync("data.json", JSON.stringify([data]));
    fs.writeFileSync(dir + "movieData.json", JSON.stringify(fileData));
  }
}

export function publishMovie(id) {
  if (!id) {
    console.log("id is not provided");
    return;
  }
  try {
    const fileData =
      JSON.parse(fs.readFileSync(dir + "tmpData.json").toString()) || [];

    const movieData = fileData.find((e) => e.uid === id);
    const updatedTempFileData = fileData.filter((e) => e.uid !== id);
    saveToOriginalMovies(movieData);
    fs.writeFileSync(dir + "tmpData.json", JSON.stringify(updatedTempFileData));
  } catch (e) {
    console.log(e);
  }
}

export function saveToOriginalMovies(data) {
  if (!data) {
    return;
  }
  const { uid, title } = data;
  console.log("saving original movies");
  try {
    const fileData =
      JSON.parse(fs.readFileSync(dir + "originalMovies.json").toString()) || [];

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

    fs.writeFileSync(dir + "originalMovies.json", JSON.stringify(fileData));
  } catch (error) {
    const fileData = [{ uid, title }];
    // fs.writeFileSync("data.json", JSON.stringify([data]));
    fs.writeFileSync(dir + "originalMovies.json", JSON.stringify(fileData));
  }
}

export function getOriginalMovies() {
  const fileData =
    JSON.parse(fs.readFileSync("db/originalMovies.json").toString()) || [];

  if (fileData.length) {
    return fileData;
  }
  return null;
}
