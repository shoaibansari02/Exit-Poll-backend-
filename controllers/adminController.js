// controllers/adminController.js
import asyncHandler from "express-async-handler";
import { bucket, verifyFirebaseSetup } from "../config/firebaseConfig.js";
import mime from "mime-types";

// imported models
import Admin from "../models/adminModel.js";
import City from "../models/cityModel.js";
import Zone from "../models/zoneModel.js";
import Candidate from "../models/candidateModel.js";
import AdminMedia from "../models/adminMediaModel.js";
import fs from "fs/promises";
import path from "path";

//jwt token generater
import generateToken from "../utils/generateToken.js";

// Utility function to upload file to Firebase
export async function uploadToFirebase(localFilePath, candidateId) {
  if (!localFilePath || !candidateId) {
    throw new Error(
      "Invalid input: localFilePath and candidateId are required"
    );
  }
  await verifyFirebaseSetup();

  try {
    // Validate file exists
    await fs.access(localFilePath, fs.constants.F_OK);

    const fileName = `candidates/${candidateId}${path.extname(localFilePath)}`;
    const contentType = mime.lookup(localFilePath) || "image/png";

    console.log("Upload Diagnostics:", {
      localFilePath,
      fileName,
      bucketName: bucket.name,
      projectId: bucket.projectId,
    });

    // Determine content type
    console.log("Detected Content Type:", contentType);

    const options = {
      destination: fileName,
      metadata: {
        contentType: contentType,
        metadata: {
          firebaseStorageDownloadTokens: candidateId,
        },
      },
    };

    try {
      // Perform upload
      const [uploadedFile] = await bucket.upload(localFilePath, options);

      // Make publicly accessible
      await uploadedFile.makePublic();

      // Construct public URL (more reliable method)
      const publicUrl = uploadedFile.publicUrl();

      console.log("Upload successful:", publicUrl);

      // Remove local file
      await fs.unlink(localFilePath);

      return publicUrl;
    } catch (uploadError) {
      console.error("Detailed Firebase upload error:", {
        message: uploadError.message,
        code: uploadError.code,
        name: uploadError.name,
        details: uploadError.details,
        stack: uploadError.stack,
      });

      // Additional context logging
      console.error("Bucket details:", {
        name: bucket.name,
        projectId: bucket.projectId,
        exists: await bucket.exists().then(([exists]) => exists),
      });

      throw uploadError;
    }
  } catch (error) {
    console.error("Firebase upload process error:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
    throw error;
  }
}
//admin login
export const loginAdmin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });

  if (admin && (await admin.matchPassword(password))) {
    res.json({
      _id: admin._id,
      username: admin.username,
      token: generateToken(admin._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid username or password");
  }
});

//get admin profile
export const getAdminProfile = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id);

  if (admin) {
    res.json({
      _id: admin._id,
      username: admin.username,
    });
  } else {
    res.status(404);
    throw new Error("Admin not found");
  }
});

//add city
export const addCity = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("City name is required");
  }

  // Check if city already exists
  const cityExists = await City.findOne({
    name: { $regex: new RegExp(`^${name}$`, "i") },
  });

  if (cityExists) {
    res.status(400);
    throw new Error("City already exists");
  }

  const city = await City.create({
    name: name.trim(),
  });

  if (city) {
    res.status(201).json({
      _id: city._id,
      name: city.name,
    });
  } else {
    res.status(400);
    throw new Error("Invalid city data");
  }
});

//getallcities
export const getCities = asyncHandler(async (req, res) => {
  const cities = await City.find({}).sort({ name: 1 });
  res.json(cities);
});

//delete city
export const deleteCity = asyncHandler(async (req, res) => {
  const city = await City.findById(req.params.id);

  if (city) {
    await city.deleteOne();
    res.json({ message: "City removed" });
  } else {
    res.status(404);
    throw new Error("City not found");
  }
});

//add zone within city
export const addZones = asyncHandler(async (req, res) => {
  const { cityId, zones } = req.body;

  // Validate request body
  if (!cityId || !zones || !Array.isArray(zones) || zones.length === 0) {
    res.status(400);
    throw new Error("Please provide cityId and an array of zone names");
  }

  // Check if city exists
  const city = await City.findById(cityId);
  if (!city) {
    res.status(404);
    throw new Error("City not found");
  }

  try {
    // Prepare zone documents
    const zoneDocuments = zones.map((zoneName) => ({
      city: cityId,
      name: zoneName.trim(),
    }));

    // Insert zones
    const createdZones = await Zone.insertMany(zoneDocuments, {
      ordered: false,
    });

    res.status(201).json({
      message: "Zones added successfully",
      zones: createdZones,
    });
  } catch (error) {
    // Handle duplicate zone names
    if (error.code === 11000) {
      res.status(400);
      throw new Error("Some zones already exist in this city");
    }
    throw error;
  }
});

//get zone
export const getZonesByCity = asyncHandler(async (req, res) => {
  const { cityId } = req.params;

  // Check if city exists
  const city = await City.findById(cityId);
  if (!city) {
    res.status(404);
    throw new Error("City not found");
  }

  const zones = await Zone.find({ city: cityId })
    .sort({ name: 1 })
    .select("name createdAt");

  res.json({
    city: city.name,
    zones: zones,
  });
});

//delete zone
export const deleteZone = asyncHandler(async (req, res) => {
  const zone = await Zone.findById(req.params.id);

  if (!zone) {
    res.status(404);
    throw new Error("Zone not found");
  }

  await zone.deleteOne();
  res.json({ message: "Zone removed successfully" });
});

//update zone
export const updateZone = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Zone name is required");
  }

  const zone = await Zone.findById(req.params.id);

  if (!zone) {
    res.status(404);
    throw new Error("Zone not found");
  }

  try {
    zone.name = name.trim();
    const updatedZone = await zone.save();
    res.json(updatedZone);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400);
      throw new Error("A zone with this name already exists in this city");
    }
    throw error;
  }
});

// add Candidate
export const addCandidate = asyncHandler(async (req, res) => {
  const { zoneId, name } = req.body;

  // Validation
  if (!zoneId || !name || !req.file) {
    // Delete uploaded file if validation fails
    if (req.file) {
      await fs.unlink(req.file.path);
    }
    res.status(400);
    throw new Error("Please provide zone ID, candidate name, and photo");
  }

  // Check if zone exists
  const zone = await Zone.findById(zoneId).populate("city");
  if (!zone) {
    if (req.file) {
      await fs.unlink(req.file.path);
    }
    res.status(404);
    throw new Error("Zone not found");
  }

  try {
    // Create candidate first to get an ID for the photo filename
    const candidate = await Candidate.create({
      zone: zoneId,
      name: name.trim(),
      photo: null, // Temporary, will be updated with Firebase URL
    });

    // Upload photo to Firebase
    const photoUrl = await uploadToFirebase(
      req.file.path,
      candidate._id.toString()
    );

    // Update candidate with Firebase photo URL
    candidate.photo = photoUrl;
    await candidate.save();

    res.status(201).json({
      _id: candidate._id,
      name: candidate.name,
      photo: candidate.photo,
      zone: zone.name,
      city: zone.city.name,
    });
  } catch (error) {
    console.error("Candidate creation error:", error);
    res.status(500);
    throw new Error("Error creating candidate");
  }
});

// get Candidate
export const getCandidatesByZone = asyncHandler(async (req, res) => {
  const { zoneId } = req.params;

  const zone = await Zone.findById(zoneId).populate("city");
  if (!zone) {
    res.status(404);
    throw new Error("Zone not found");
  }

  const candidates = await Candidate.find({ zone: zoneId }).sort({ name: 1 });

  res.json({
    zone: zone.name,
    city: zone.city.name,
    candidates: candidates.map((candidate) => ({
      _id: candidate._id,
      name: candidate.name,
      photo: candidate.photo,
      // photoUrl: `/uploads/candidates/${candidate.photo}`,
    })),
  });
});

// Delete Candidate
export const deleteCandidate = asyncHandler(async (req, res) => {
  const candidate = await Candidate.findById(req.params.id);

  if (!candidate) {
    res.status(404);
    throw new Error("Candidate not found");
  }

  // Delete photo file
  try {
    await fs.unlink(path.join("uploads/candidates", candidate.photo));
  } catch (error) {
    console.error("Error deleting photo:", error);
  }

  await candidate.deleteOne();
  res.json({ message: "Candidate removed successfully" });
});

// Update Candidate
export const updateCandidate = asyncHandler(async (req, res) => {
  const candidate = await Candidate.findById(req.params.id);

  if (!candidate) {
    if (req.file) {
      await fs.unlink(req.file.path);
    }
    res.status(404);
    throw new Error("Candidate not found");
  }

  try {
    // Update name if provided
    if (req.body.name) {
      candidate.name = req.body.name.trim();
    }

    // Update photo if provided
    if (req.file) {
      // Delete existing photo from Firebase
      if (candidate.photo) {
        await deleteExistingPhoto(candidate.photo);
      }

      // Upload new photo to Firebase
      const photoUrl = await uploadToFirebase(
        req.file.path,
        candidate._id.toString()
      );
      candidate.photo = photoUrl;
    }

    const updatedCandidate = await candidate.save();

    res.json({
      _id: updatedCandidate._id,
      name: updatedCandidate.name,
      photo: updatedCandidate.photo,
    });
  } catch (error) {
    console.error("Candidate update error:", error);
    res.status(500);
    throw new Error("Error updating candidate");
  }
});

export const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = {
    totalCities: await City.countDocuments(),
    totalZones: await Zone.countDocuments(),
    totalCandidates: await Candidate.countDocuments(),
    recentActivities: await getRecentActivities(),
  };

  res.json(stats);
});

// Get recent activities
const getRecentActivities = async () => {
  const activities = [];

  // Get latest cities
  const recentCities = await City.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select("name createdAt");

  recentCities.forEach((city) => {
    activities.push({
      type: "city_added",
      description: `New city "${city.name}" was added`,
      timestamp: city.createdAt,
    });
  });

  // Get latest zones
  const recentZones = await Zone.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("city", "name")
    .select("name city createdAt");

  recentZones.forEach((zone) => {
    activities.push({
      type: "zone_added",
      description: `New zone "${zone.name}" was added in ${zone.city.name}`,
      timestamp: zone.createdAt,
    });
  });

  // Get latest candidates
  const recentCandidates = await Candidate.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate({
      path: "zone",
      select: "name",
      populate: {
        path: "city",
        select: "name",
      },
    })
    .select("name createdAt");

  recentCandidates.forEach((candidate) => {
    activities.push({
      type: "candidate_added",
      description: `New candidate "${candidate.name}" was registered in ${candidate.zone.name}, ${candidate.zone.city.name}`,
      timestamp: candidate.createdAt,
    });
  });

  // Sort all activities by timestamp
  return activities
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10)
    .map((activity) => ({
      ...activity,
      timestamp: formatTimestamp(activity.timestamp),
    }));
};

// Utility function to format timestamps
const formatTimestamp = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return "Just now";
};

export const uploadAdminMedia = asyncHandler(async (req, res) => {
  const { files } = req;

  // Check if files are uploaded
  if (!files || (!files.photo && !files.video)) {
    res.status(400);
    throw new Error("No files uploaded");
  }

  try {
    // Find existing media record
    let existingMedia = await AdminMedia.findOne({});

    // If no existing record, create a new one
    if (!existingMedia) {
      existingMedia = new AdminMedia();
    }

    // Handle photo upload
    if (files.photo) {
      const photoPath = files.photo[0].path;

      // Delete existing photo from Firebase if it exists
      if (existingMedia.photoUrl) {
        try {
          const oldPhotoFileName = existingMedia.photoUrl.split("/").pop();
          await bucket.file(`media/${oldPhotoFileName}`).delete();
        } catch (deleteError) {
          console.log("Error deleting existing photo:", deleteError);
        }
      }

      // Upload new photo
      existingMedia.photoUrl = await uploadToFirebase(photoPath, "photo");
    }

    // Handle video upload
    if (files.video) {
      const videoPath = files.video[0].path;

      // Delete existing video from Firebase if it exists
      if (existingMedia.videoUrl) {
        try {
          const oldVideoFileName = existingMedia.videoUrl.split("/").pop();
          await bucket.file(`media/${oldVideoFileName}`).delete();
        } catch (deleteError) {
          console.log("Error deleting existing video:", deleteError);
        }
      }

      // Upload new video
      existingMedia.videoUrl = await uploadToFirebase(videoPath, "video");
    }

    // Save the updated media record
    await existingMedia.save();

    res.status(200).json({
      message: "Media uploaded successfully",
      photo: existingMedia.photoUrl,
      video: existingMedia.videoUrl,
    });
  } catch (error) {
    console.error("Media upload error:", error);
    res.status(500);
    throw new Error("Error uploading media");
  }
});

export const getAdminMedia = asyncHandler(async (req, res) => {
  try {
    const existingMedia = await AdminMedia.findOne({});

    if (!existingMedia) {
      return res.status(404).json({ message: "No media found" });
    }

    res.status(200).json({
      photo: existingMedia.photoUrl,
      video: existingMedia.videoUrl,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Error retrieving media");
  }
});
