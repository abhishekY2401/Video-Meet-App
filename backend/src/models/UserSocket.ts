import mongoose, { Schema } from "mongoose";

const userSocketSchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: true },
  socket: { type: Schema.Types.Mixed, default: null, required: true },
  availability: { type: Boolean, default: false },
  currentRoomId: { type: String, default: null },
});

const UserSocket = mongoose.model("UserSocket", userSocketSchema);

module.exports = { UserSocket };
