// controllers/adminController.js
import asyncHandler from "express-async-handler";

// imported models
import Admin from "../models/adminModel.js";
import City from "../models/cityModel.js";
import Zone from "../models/zoneModel.js";
import Candidate from "../models/candidateModel.js";
import fs from "fs/promises";
import path from "path";

//jwt token generater
import generateToken from "../utils/generateToken.js";

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

  const candidate = await Candidate.create({
    zone: zoneId,
    name: name.trim(),
    photo: req.file.filename,
  });

  res.status(201).json({
    _id: candidate._id,
    name: candidate.name,
    photo: candidate.photo,
    zone: zone.name,
    city: zone.city.name,
  });
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
      photoUrl: `/uploads/candidates/${candidate.photo}`,
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

  // Update name if provided
  if (req.body.name) {
    candidate.name = req.body.name.trim();
  }

  // Update photo if provided
  if (req.file) {
    // Delete old photo
    try {
      await fs.unlink(path.join("uploads/candidates", candidate.photo));
    } catch (error) {
      console.error("Error deleting old photo:", error);
    }
    candidate.photo = req.file.filename;
  }

  const updatedCandidate = await candidate.save();
  res.json({
    _id: updatedCandidate._id,
    name: updatedCandidate.name,
    photo: updatedCandidate.photo,
    photoUrl: `/uploads/candidates/${updatedCandidate.photo}`,
  });
});
