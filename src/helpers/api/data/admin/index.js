import { config } from "../config";
import fs from "fs";
export function publishMovie(id) {
  if (!id) {
    console.log("id is not provided");
    return;
  }
  try {
    const fileData =
      JSON.parse(
        fs.readFileSync(config.dir + config.pendingMovies).toString()
      ) || [];

    const movieData = fileData.find((e) => e.uid === id);
    const updatedTempFileData = fileData.filter((e) => e.uid !== id);
    saveToOriginalMovies(movieData);
    fs.writeFileSync(
      config.dir + config.pendingMovies,
      JSON.stringify(updatedTempFileData)
    );
  } catch (e) {
    console.log(e);
  }
}

export function getPendingMovies(id) {
  try {
    const data =
      JSON.parse(
        fs.readFileSync(config.dir + config.pendingMovies).toString()
      ) || null;

    if (id !== undefined && data) {
      return data.find((e) => e.uid === id);
    }

    return data;
  } catch (e) {
    console.log("tmpData.json does not exists");
    return null;
  }
}
