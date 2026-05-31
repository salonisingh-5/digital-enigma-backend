const express = require('express');
const router = express.Router();
const pool = require('../helpers/db');
const bcrypt = require('bcrypt');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ success: false, message: 'Name and password required' });
  }

  try {
    const result = await pool.query('SELECT * FROM players WHERE name = $1', [name]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Player not found' });
    }

    const player = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, player.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Wrong password' });
    }

    res.json({
      success: true,
      message: 'Login successful',
      player: {
        id: player.id,
        name: player.name,
        tokens: player.tokens,
        rank_points: player.rank_points,
        puzzles_solved: player.puzzles_solved
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ success: false, message: 'Name and password required' });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO players (name, password_hash) VALUES ($1, $2) RETURNING id, name, tokens',
      [name, hashed]
    );

    res.json({
      success: true,
      message: 'Player registered!',
      player: result.rows[0]
    });

  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ success: false, message: 'Name already taken' });
    }
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;