import fs from "fs";

export default async function handler(req, res) {
  // get title and id from req.
  const id = req.query.id;

  if (!id) {
    res.send("id parameter is missing");
  }
  const movieData = getMovieData(id);

  if (movieData) {
    res.send({ success: true, data: movieData });
  } else {
    res.send({ success: false, data: null, error: "can't get the movie." });
  }

  // check if the user is eligible

  // return streaming url of the movie
}

function getMovieData(id) {
  // read file containing movie data such as url and other data

  const movieData =
    JSON.parse(fs.readFileSync("db/movieData.json").toString()) || [];
  const data = movieData.find((e) => e.id == id);
  return data;
}
