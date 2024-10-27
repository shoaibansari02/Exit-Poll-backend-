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
} from "../controllers/adminController.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../config/multerConfig.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/profile", protect, getAdminProfile);
router.post("/add-city", protect, addCity);
router.get("/cities", protect, getCities);
router.delete("/delete-city/:id", protect, deleteCity);
router.post("/addZones", protect, addZones);
router.get("/getZonesByCity/:cityId", protect, getZonesByCity);
router.delete("/deleteZone/:id", protect, deleteZone);
router.put("/updateZone/:id", protect, updateZone);

router.post("/add-candidate", protect, upload.single("photo"), addCandidate);
router.get("/get-candidates/:zoneId", protect, getCandidatesByZone);
router.delete("/delete-candidate/:id", protect, deleteCandidate);
router.put(
  "/update-candidate/:id",
  protect,
  upload.single("photo"),
  updateCandidate
);
export default router;
