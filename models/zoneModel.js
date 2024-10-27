// models/zoneModel.js
import mongoose from "mongoose";

const zoneSchema = new mongoose.Schema({
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to ensure unique zone names within a city
zoneSchema.index({ city: 1, name: 1 }, { unique: true });

const Zone = mongoose.model("Zone", zoneSchema);
export default Zone;
