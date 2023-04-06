import { getMovieData } from "@/helpers/api/data/movie";
import fs from "fs";

export default async function handler(req, res) {
  // get title and id from req.
  const id = req.query.id;

  if (!id) {
    res.send("id parameter is missing");
  }
  const movieData = await getMovieData(id);

  // check if the user is eligible

  // return streaming url of the movie

  if (movieData) {
    res.send({ success: true, data: movieData });
  } else {
    res.send({ success: false, data: null, error: "can't get the movie." });
  }
}
