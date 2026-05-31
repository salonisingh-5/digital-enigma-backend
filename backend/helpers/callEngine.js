const { execFile } = require('child_process');
const path = require('path');

// Point this to wherever your compiled game_engine.exe lives
// You can override with C_ENGINE_PATH in your .env file
const ENGINE_PATH = process.env.C_ENGINE_PATH || path.join(__dirname, '..', 'build', 'game_engine.exe');

/*
 * callEngine(args)
 * args is an array, e.g. ['submit', 'arjun', '3', 'FLAG{hello}', '45']
 * The C binary reads argv[] so we must pass an array, NOT a joined string.
 * execFile is safer than exec — it does NOT spawn a shell, so spaces in
 * flag values won't break argument parsing.
 */
function callEngine(args) {
  return new Promise((resolve, reject) => {
    console.error('Calling engine:', ENGINE_PATH, args); // stderr only — never stdout

    execFile(ENGINE_PATH, args, (error, stdout, stderr) => {
      if (stderr) {
        // C code uses fprintf(stderr,...) for debug — log it here
        console.error('Engine stderr:', stderr);
      }

      if (error) {
        console.error('Engine exec error:', error.message);
        // Fall back to mock only in development
        if (process.env.NODE_ENV !== 'production') {
          resolve(getMockResponse(args));
        } else {
          reject(new Error('Game engine failed: ' + error.message));
        }
        return;
      }

      try {
        const result = JSON.parse(stdout);
        resolve(result);
      } catch (e) {
        console.error('Could not parse engine output:', stdout);
        reject(new Error('Engine returned non-JSON output'));
      }
    });
  });
}

/*
 * Mock responses — only used in development when the binary isn't available.
 * These match the EXACT JSON shape the real C binary outputs so your
 * routes don't need to change at all when you switch to the real binary.
 */
function getMockResponse(args) {
  const command = args[0];

  if (command === 'submit') {
    return {
      result: 'wrong',           // or 'correct' or 'error'
      tokens: 100,
      rank: 0,
      message: 'Mock: flag checked'
    };
  }

  if (command === 'hint') {
    return {
      result: 'hint',
      hint: 'Mock hint: look at the encoding carefully.',
      tokens_left: 90
    };
  }

  if (command === 'leaderboard') {
    return [
      { rank: 1, name: 'TestPlayer', rank_points: 100, tokens: 50, puzzles_solved: 3 }
    ];
  }

  return { result: 'error', message: 'Unknown mock command' };
}

module.exports = { callEngine };