// routes/adminRoutes.js
import express from "express";
import {
  loginAdmin,
  getAdminProfile,
  addCity,
  getCities,
  deleteCity,
  addZones,
  getZonesByCity,
  deleteZone,
  updateZone,
  addCandidate,
  getCandidatesByZone,
  deleteCandidate,
  updateCandidate,
  getDashboardStats,
  uploadAdminMedia,
  getAdminMedia,
  addNews,
  getAllNews,
  deleteNews,
} from "../controllers/adminController.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../config/multerConfig.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/profile", protect, getAdminProfile);
router.post("/add-city", protect, addCity);
router.get("/cities", getCities);
router.delete("/delete-city/:id", protect, deleteCity);
router.post("/addZones", protect, addZones);
router.get("/getZonesByCity/:cityId", getZonesByCity);
router.delete("/deleteZone/:id", protect, deleteZone);
router.put("/updateZone/:id", protect, updateZone);

router.post(
  "/add-candidate",
  protect,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "partyLogo", maxCount: 1 },
  ]),
  addCandidate
);
router.get("/get-candidates/:zoneId", getCandidatesByZone);
router.delete("/delete-candidate/:id", protect, deleteCandidate);
router.get("/dashboard/stats", protect, getDashboardStats);
router.put(
  "/update-candidate/:id",
  protect,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "partyLogo", maxCount: 1 },
  ]),
  updateCandidate
);

router.post(
  "/upload-media",
  protect,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  uploadAdminMedia
);
router.get("/get-media", getAdminMedia);

router.post("/add-news", protect, addNews);
router.get("/get-news", getAllNews);
router.delete("/delete-news/:id", protect, deleteNews);

export default router;
