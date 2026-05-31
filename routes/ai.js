const express = require("express");

const router = express.Router();

const { getPlayer,useTokens,getHint,getLeaderboard, updateRank, getPuzzle, submitAnswer  } = require("../controllers/aiController");

router.get("/player", getPlayer);

router.get("/use-token/:username", useTokens);
router.get("/hint/:username", getHint);
router.get("/leaderboard", getLeaderboard);
router.get("/solve/:username", updateRank);
router.get("/puzzle", getPuzzle);
router.post("/submit", submitAnswer);

module.exports = router;