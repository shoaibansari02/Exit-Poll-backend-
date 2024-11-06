import mongoose from "mongoose";

const adminMediaSchema = new mongoose.Schema(
  {
    photoUrl: {
      type: String,
      default: null,
    },
    videoUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const AdminMedia = mongoose.model("AdminMedia", adminMediaSchema);

export default AdminMedia;
