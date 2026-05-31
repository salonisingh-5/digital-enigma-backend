const express = require('express');
const router = express.Router();
const pool = require('../helpers/db');
const { callEngine } = require('../helpers/callEngine');

// POST /api/puzzle/submit
router.post('/submit', async (req, res) => {
  const { player_id, puzzle_id, flag, time_taken } = req.body;

  if (!player_id || !puzzle_id || !flag) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    // Get the puzzle's correct flag from DB
    const puzzleResult = await pool.query('SELECT * FROM puzzles WHERE id = $1', [puzzle_id]);
    if (puzzleResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Puzzle not found' });
    }

    const puzzle = puzzleResult.rows[0];
    const isCorrect = flag.trim().toLowerCase() === puzzle.flag.trim().toLowerCase();

    // Get player info
    const playerResult = await pool.query('SELECT * FROM players WHERE id = $1', [player_id]);
    const player = playerResult.rows[0];

    // Save attempt to DB
    await pool.query(
      'INSERT INTO attempts (player_id, puzzle_id, time_taken, solved) VALUES ($1, $2, $3, $4)',
      [player_id, puzzle_id, time_taken || 0, isCorrect]
    );

    if (isCorrect) {
      // Calculate rank points using the formula
      const newPoints = (player.puzzles_solved + 1) * puzzle.difficulty - player.total_hints_used;
      const safePoints = Math.max(newPoints, 0);

      // Update player stats
      await pool.query(
        `UPDATE players SET 
          puzzles_solved = puzzles_solved + 1,
          rank_points = rank_points + $1
         WHERE id = $2`,
        [safePoints, player_id]
      );

      return res.json({
        success: true,
        correct: true,
        message: 'Correct flag! Well done!',
        points_earned: safePoints
      });
    } else {
      return res.json({
        success: true,
        correct: false,
        message: 'Wrong flag. Keep trying!'
      });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/puzzle/:id — fetch a puzzle
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
    // Note: we don't send the flag back to the player!
    res.json({ success: true, puzzle: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;