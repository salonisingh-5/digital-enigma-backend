const express = require('express');
const router = express.Router();
const pool = require('../helpers/db');

// GET /api/leaderboard
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM leaderboard LIMIT 20');

    const leaderboard = result.rows.map((row, index) => ({
      rank: index + 1,
      name: row.name,
      rank_points: row.rank_points,
      tokens: row.tokens,
      puzzles_solved: row.puzzles_solved
    }));

    res.json({ success: true, leaderboard });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;