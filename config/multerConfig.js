import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure temporary uploads directory exists
const uploadDir = path.join(process.cwd(), "temp-uploads/media");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const prefix = file.fieldname === "photo" ? "photo-" : "video-";
    cb(null, prefix + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "photo" || file.fieldname === "partyLogo") {
    // Handle image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Please upload a valid image file (jpg, jpeg, png)"), false);
    }
  } else if (file.fieldname === "video") {
    // Handle video files
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Please upload a valid video file (mp4, mov)"), false);
    }
  } else {
    cb(new Error("Invalid field name"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for videos
  },
});

export default upload;
