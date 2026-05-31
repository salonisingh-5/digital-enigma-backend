const express = require('express');
const router = express.Router();
const pool = require('../helpers/db');
const { callEngine } = require('../helpers/callEngine');

// POST /api/puzzle/submit
// Body: { player_name, puzzle_id, flag, time_taken }
router.post('/submit', async (req, res) => {
  const { player_name, puzzle_id, flag, time_taken } = req.body;

  if (!player_name || !puzzle_id || !flag) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: player_name, puzzle_id, flag'
    });
  }

  try {
    const engineResult = await callEngine([
      'submit',
      player_name,
      String(puzzle_id),
      flag,
      String(time_taken || 0)
    ]);

    // C binary returns: { result: "correct"|"wrong"|"error", tokens, rank, message }
    if (engineResult.result === 'error') {
      return res.status(400).json({ success: false, message: engineResult.message });
    }

    return res.json({
      success: true,
      correct: engineResult.result === 'correct',
      tokens: engineResult.tokens,
      rank: engineResult.rank,
      message: engineResult.message
    });

  } catch (err) {
    console.error('Engine call failed:', err);
    res.status(500).json({ success: false, message: 'Game engine error' });
  }
});

// GET /api/puzzle/:id
// Never sends the flag to the client
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT id, domain, question, difficulty, time_limit FROM puzzles WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Puzzle not found' });
    }
    res.json({ success: true, puzzle: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;