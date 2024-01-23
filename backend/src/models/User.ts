import mongoose from "mongoose";

const userData = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String, required: true },
});

const User = mongoose.model("User", userData);

module.exports = { User };
