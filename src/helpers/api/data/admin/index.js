import { config } from "../config";
import fs from "fs";
import { saveMovieToPublishedMovie } from "../movie";
import { readFile } from "../../user/user";
import User from "../../../../db/schemas/userSchema";
import Pending from "../../../../db/schemas/pendingSchema";

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

export async function getPendingMovies(id) {
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
      video,
      poster,
      backdrop,
    } = await Pending.findOne({ _id: id }, { __v: 0 });
    return {
      video: JSON.stringify(video),
      poster: JSON.stringify(poster),
      backdrop: JSON.stringify(backdrop),
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
    console.log(e);
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
