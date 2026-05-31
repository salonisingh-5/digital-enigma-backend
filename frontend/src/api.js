// api.js — drop this in your frontend src/ folder
// This replaces the hardcoded puzzles.js data file.
// FE-B imports these functions and passes results down as props to FE-A's components.

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function loginPlayer(username, password) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return res.json();
  // Returns: { success, player: { id, name, tokens, puzzles_solved, rank_points } }
}

export async function registerPlayer(username, password) {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return res.json();
}

// ─── Puzzles ─────────────────────────────────────────────────────────────────

// Load a single puzzle by ID (no flag — backend strips it)
export async function fetchPuzzle(puzzleId) {
  const res = await fetch(`${BASE_URL}/api/puzzle/${puzzleId}`);
  return res.json();
  // Returns: { success, puzzle: { id, domain, question, difficulty, hint1, hint2, hint3 } }
}

// Submit a flag for a puzzle
// player_name is the string username (C binary uses name, not id)
export async function submitFlag(playerName, puzzleId, flag, timeTaken) {
  const res = await fetch(`${BASE_URL}/api/puzzle/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      player_name: playerName,
      puzzle_id: puzzleId,
      flag,
      time_taken: timeTaken
    })
  });
  return res.json();
  // Returns: { success, correct, tokens, rank, message }
}

// ─── Hints ───────────────────────────────────────────────────────────────────

// hint_tier: 'light' (5 tokens) | 'detailed' (20 tokens) | 'skip' (50 tokens)
export async function requestHint(playerId, puzzleId, hintTier) {
  const res = await fetch(`${BASE_URL}/api/hint`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      player_id: playerId,
      puzzle_id: puzzleId,
      hint_tier: hintTier
    })
  });
  return res.json();
  // Returns: { success, hint, tokens_spent, tokens_remaining }
}

// ─── Leaderboard ─────────────────────────────────────────────────────────────

export async function fetchLeaderboard() {
  const res = await fetch(`${BASE_URL}/api/leaderboard`);
  return res.json();
  // Returns: { success, leaderboard: [{ rank, name, rank_points, tokens, puzzles_solved }] }
}

// ─── Helpers (kept from old puzzles.js so FE-A's components don't break) ─────

export const difficultyLabel = (d) =>
  d === 1 ? 'EASY' : d === 2 ? 'MEDIUM' : 'HARD';

export const difficultyColor = (d) =>
  d === 1 ? '#10b981' : d === 2 ? '#eab308' : '#ef4444';