const express = require('express');
const router = express.Router();
const pool = require('../helpers/db');
const { callGemini } = require('../helpers/gemini');

const HINT_COSTS = {
  light: 5,
  detailed: 20,
  skip: 50
};

// POST /api/hint
router.post('/', async (req, res) => {
  const { player_id, puzzle_id, hint_tier } = req.body;

  if (!player_id || !puzzle_id || !hint_tier) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  if (!HINT_COSTS[hint_tier]) {
    return res.status(400).json({ success: false, message: 'Invalid hint_tier. Use: light, detailed, or skip' });
  }

  const cost = HINT_COSTS[hint_tier];

  try {
    // Check player's token balance
    const playerResult = await pool.query('SELECT * FROM players WHERE id = $1', [player_id]);
    if (playerResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Player not found' });
    }

    const player = playerResult.rows[0];

    if (player.tokens < cost) {
      return res.status(403).json({
        success: false,
        message: `Not enough tokens! You need ${cost} but have ${player.tokens}.`
      });
    }

    // Get puzzle info and player's attempt count
    const puzzleResult = await pool.query('SELECT * FROM puzzles WHERE id = $1', [puzzle_id]);
    if (puzzleResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Puzzle not found' });
    }
    const puzzle = puzzleResult.rows[0];

    const attemptsResult = await pool.query(
      'SELECT COUNT(*) FROM attempts WHERE player_id = $1 AND puzzle_id = $2 AND solved = false',
      [player_id, puzzle_id]
    );
    const failedAttempts = parseInt(attemptsResult.rows[0].count);

    // Build AI prompt based on hint tier
    let systemInstruction = '';
    let userPrompt = '';

    if (hint_tier === 'light') {
      systemInstruction = `You are a CTF hint assistant. Give a very brief, cryptic nudge — one or two sentences maximum. 
        Do NOT reveal the answer or the flag. Do NOT give step-by-step instructions. 
        Think of it like a riddle clue that points in the right direction without spoiling the challenge.
        The flag format is typically FLAG{something}.`;

      userPrompt = `Puzzle domain: ${puzzle.domain}
        Puzzle question: ${puzzle.question}
        Player has failed ${failedAttempts} times.
        Give a light, cryptic hint.`;

    } else if (hint_tier === 'detailed') {
      systemInstruction = `You are a CTF mentor. Give a helpful step-by-step conceptual guide.
        Explain the APPROACH and TOOLS the player should use.
        STRICTLY FORBIDDEN: Do NOT output the actual flag or its value under any circumstances.
        You can explain the technique, the tools, and the methodology.
        The flag format is FLAG{something} but never reveal what's inside the curly braces.`;

      userPrompt = `Puzzle domain: ${puzzle.domain}
        Puzzle question: ${puzzle.question}
        Player has failed ${failedAttempts} times.
        Give a detailed conceptual walkthrough without revealing the actual flag.`;

    } else if (hint_tier === 'skip') {
      systemInstruction = `You are a CTF solution revealer. The player has spent 50 tokens to skip this puzzle.
        Explain the full solution clearly, including what the flag is and how it was derived.
        Be educational — explain WHY the solution works so the player learns.`;

      userPrompt = `Puzzle domain: ${puzzle.domain}
        Puzzle question: ${puzzle.question}
        Correct flag: ${puzzle.flag}
        Explain the full solution.`;
    }

    // Call Gemini AI
    const hintText = await callGemini(systemInstruction, userPrompt);

    // Deduct tokens from player
    await pool.query(
      'UPDATE players SET tokens = tokens - $1, total_hints_used = total_hints_used + 1 WHERE id = $2',
      [cost, player_id]
    );

    // Save hint usage in attempts
    await pool.query(
      `INSERT INTO attempts (player_id, puzzle_id, hints_used, tokens_spent)
       VALUES ($1, $2, 1, $3)
       ON CONFLICT DO NOTHING`,
      [player_id, puzzle_id, cost]
    );

    res.json({
      success: true,
      hint: hintText,
      tokens_spent: cost,
      tokens_remaining: player.tokens - cost
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;