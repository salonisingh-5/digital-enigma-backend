const { exec } = require('child_process');
const path = require('path');

const ENGINE_PATH = process.env.C_ENGINE_PATH || '../build/game_engine.exe';

function callEngine(args) {
  return new Promise((resolve, reject) => {
    const command = `${ENGINE_PATH} ${args}`;
    console.log('Calling engine:', command);

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Engine error:', stderr);
        // Return mock data if binary not available yet
        resolve(getMockResponse(args));
        return;
      }
      try {
        const result = JSON.parse(stdout);
        resolve(result);
      } catch (e) {
        console.error('Could not parse engine output:', stdout);
        resolve(getMockResponse(args));
      }
    });
  });
}

// Mock responses — used until Person 2's binary is connected
function getMockResponse(args) {
  if (args.includes('submit')) {
    return {
      success: true,
      correct: false,
      message: 'Mock: flag checked',
      tokens_earned: 0,
      rank_points: 0
    };
  }
  if (args.includes('leaderboard')) {
    return {
      success: true,
      leaderboard: [
        { name: 'TestPlayer', rank_points: 100, puzzles_solved: 3, position: 1 }
      ]
    };
  }
  return { success: true, message: 'Mock response' };
}

module.exports = { callEngine };