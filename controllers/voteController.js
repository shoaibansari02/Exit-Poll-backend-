// controllers/voteController.js
import asyncHandler from "express-async-handler";
import Candidate from "../models/candidateModel.js";
import Vote from "../models/voteModel.js";
import mongoose from "mongoose";

export const castVote = asyncHandler(async (req, res) => {
  const { candidateId, deviceId } = req.body;
  const ipAddress = req.ip;

  // Validate input
  if (!candidateId || !deviceId) {
    res.status(400);
    throw new Error("Candidate ID and Device ID are required");
  }

  // Validate candidateId format
  if (!mongoose.Types.ObjectId.isValid(candidateId)) {
    res.status(400);
    throw new Error("Invalid candidate ID format");
  }

  // Check if candidate exists
  const candidate = await Candidate.findById(candidateId).populate("zone");
  if (!candidate) {
    res.status(404);
    throw new Error("Candidate not found");
  }

  try {
    const session = await mongoose.startSession();
    await session.startTransaction();

    try {
      // Create vote record
      await Vote.create(
        [
          {
            candidate: candidateId,
            deviceId,
            ipAddress,
          },
        ],
        { session }
      );

      // Increment candidate's total votes
      await Candidate.findByIdAndUpdate(
        candidateId,
        { $inc: { totalVotes: 1 } },
        { session }
      );

      await session.commitTransaction();

      res.status(201).json({
        message: "Vote cast successfully",
        candidate: {
          name: candidate.name,
          totalVotes: candidate.totalVotes + 1,
        },
      });
    } catch (error) {
      await session.abortTransaction();

      // Check if error is due to duplicate vote
      if (error.code === 11000) {
        res.status(400);
        throw new Error("You have already voted for this candidate");
      }
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    throw error;
  }
});

export const getZoneVotes = asyncHandler(async (req, res) => {
  const { zoneId } = req.params;

  const baseURL = `${req.protocol}://${req.get("host")}`;

  const candidates = await Candidate.find({ zone: zoneId })
    .select("name totalVotes photo partyName partyLogo") // Added partyName and partyLogo to select
    .sort({ totalVotes: -1 });

  const totalVotesInZone = candidates.reduce(
    (sum, candidate) => sum + candidate.totalVotes,
    0
  );

  res.json({
    totalVotes: totalVotesInZone,
    candidates: candidates.map((candidate) => ({
      _id: candidate._id,
      name: candidate.name,
      partyName: candidate.partyName,
      votes: candidate.totalVotes,
      photo: candidate.photo,
      partyLogo: candidate.partyLogo,
      photoUrl: `${baseURL}/uploads/candidates/${candidate.photo}`,
      partyLogoUrl: candidate.partyLogo
        ? `${baseURL}/uploads/parties/${candidate.partyLogo}`
        : null, // Added partyLogoUrl
      percentage: totalVotesInZone
        ? ((candidate.totalVotes / totalVotesInZone) * 100).toFixed(2)
        : 0,
    })),
  });
});

export const getVotingStats = asyncHandler(async (req, res) => {
  const stats = await Vote.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$votedAt" },
          month: { $month: "$votedAt" },
          day: { $dayOfMonth: "$votedAt" },
          hour: { $hour: "$votedAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": -1, "_id.month": -1, "_id.day": -1, "_id.hour": -1 },
    },
    { $limit: 24 }, // Last 24 hours
  ]);

  res.json(stats);
});
