// routes/voteRoutes.js
import express from "express";
import {
  castVote,
  getZoneVotes,
  getVotingStats,
} from "../controllers/voteController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", castVote);
router.get("/zone/:zoneId", getZoneVotes);
router.get("/stats", protect, getVotingStats);

export default router;
