import mongoose from "mongoose";
const { Schema } = mongoose;

const MovieSchema = new Schema({
  video: {
    type: Map,
    of: String,
  },
  poster: {
    type: Map,
    of: String,
  },
  backdrop: {
    type: Map,
    of: String,
  },
  title: { type: String, required: true },
  description: String,
  genres: String,
  first_air_date: String,
  media_type: String,
  poster_path: String,
  backdrop_path: String,
  //   progress: { type: Map, of: Schema.Types.Mixed },
});

const Movie = mongoose.models.Movie || mongoose.model("Movie", MovieSchema);

export default Movie;
