// models/voteModel.js
import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate",
    required: true,
  },
  deviceId: {
    type: String,
    required: true,
  },
  votedAt: {
    type: Date,
    default: Date.now,
  },
  ipAddress: String,
});

// Compound index to prevent multiple votes from same device for same candidate
voteSchema.index({ candidate: 1, deviceId: 1 }, { unique: true });

const Vote = mongoose.model("Vote", voteSchema);
export default Vote;
