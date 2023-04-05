import { config } from "../config";
import fs from "fs";
import { saveMovieToPublishedMovie } from "../movie";
import { readFile } from "../../user/user";
import User from "../../../../db/schemas/userSchema";

export function publishMovie(id) {
  if (!id) {
    console.log("id is not provided");
    return null;
  }
  try {
    const fileData =
      JSON.parse(
        fs.readFileSync(config.dir + config.pendingMovies).toString()
      ) || [];

    if (!fileData.length) {
      console.log("info:", "fileData:", config.pendingMovies, "length is zero");
    }

    const movieData = fileData.find((e) => e.uid === id);
    if (!movieData) {
      console.log("can't find movie in:", config.pendingMovies);
      return null;
    }

    const updatedTempFileData = fileData.filter((e) => e.uid !== id);
    saveMovieToPublishedMovie(movieData);
    fs.writeFileSync(
      config.dir + config.pendingMovies,
      JSON.stringify(updatedTempFileData)
    );
    return movieData;
  } catch (e) {
    console.log(
      "error in publishMovie function:",
      config.pendingMovies,
      "does not exists"
    );
    return null;
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
    console.log(config.pendingMovies, "does not exists");
    return null;
  }
}

export async function getAllUsersInfo() {
  const dataArr = await User.find().select({
    _id: 1,
    name: 1,
    username: 1,
  });
  const data = dataArr.map(({ _id, name, username }) => {
    return {
      name,
      email: username,
      id: _id.toString(),
    };
  });

  if (data) {
    return { success: true, data };
  }
  return { success: false, errMessage: "some error occurred" };
}
export async function getDetailedUserData() {
  const dataArr = await User.find().select({ password: 0 });
  const data = dataArr.map(({ _id, name, username, role, creationDate }) => {
    return {
      name,
      email: username,
      id: _id.toString(),
      role,
      creationDate: creationDate.toString(),
    };
  });

  if (data) {
    return { success: true, data };
  }
  return { success: false, errMessage: "some error occurred" };
}
