import fs from "fs";
export default async function handler(req, res) {
  // gat movies from data.json
  const movies = getOriginalMovies();
  // return movies list isth with id
  res.send(movies);
}

function getOriginalMovies() {
  const fileData = JSON.parse(fs.readFileSync("data.json").toString()) || [];

  if (fileData.length) {
    return fileData;
  }
  return null;
}
