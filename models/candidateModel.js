// models/candidateModel.js (Updated)
import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema({
  zone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Zone",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  partyName: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    default: null,
  },
  partyLogo: {
    type: String,
    required: true,
  },
  totalVotes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Candidate = mongoose.model("Candidate", candidateSchema);
export default Candidate;
