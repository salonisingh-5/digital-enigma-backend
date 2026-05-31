const express = require('express');
const router = express.Router();
const pool = require('../helpers/db');

// GET /api/leaderboard
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM leaderboard LIMIT 20');
    res.json({
      success: true,
      leaderboard: result.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;