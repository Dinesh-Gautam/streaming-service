import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  creationDate: Date,
  role: { type: String, default: "user" },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
