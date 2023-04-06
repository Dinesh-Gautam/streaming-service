import mongoose from "mongoose";
const { Schema } = mongoose;

const MovieDataSchema = new Schema({
  title: { type: String, required: true },
  videoId: { type: String, require: true },
  videoFileName: { type: String },
  videoFileDir: String,
});

const MovieData =
  mongoose.models.MovieData || mongoose.model("MovieData", MovieDataSchema);

export default MovieData;
