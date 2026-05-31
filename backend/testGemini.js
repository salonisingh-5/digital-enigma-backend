require('dotenv').config();
const { callGemini } = require('./helpers/gemini');

async function test() {
  console.log('Testing Gemini API...');
  console.log('API Key found:', process.env.GEMINI_API_KEY ? 'YES ✅' : 'NO ❌');

  const result = await callGemini(
    'You are a helpful CTF hint assistant.',
    'Give me a one sentence hint for a basic cryptography puzzle.'
  );

  console.log('Gemini Response:', result);
}

test();