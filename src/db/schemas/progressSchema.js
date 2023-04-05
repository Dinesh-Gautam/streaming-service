import mongoose from "mongoose";
const { Schema } = mongoose;

const ProgressSchema = new Schema({
  videoId: Schema.Types.ObjectId,
  progressPercent: Number,
  completed: Boolean,
  error: Boolean,
  errMessage: String,
  //   progress: { type: Map, of: Schema.Types.Mixed },
});

const Progress =
  mongoose.models.Progress || mongoose.model("Progress", ProgressSchema);

export default Progress;
