const { execFile } = require("child_process");
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Import routes
const puzzleRoutes = require('./routes/puzzle');
const hintRoutes = require('./routes/hint');
const leaderboardRoutes = require('./routes/leaderboard');
const authRoutes = require('./routes/auth');

// Use routes
app.use('/api/puzzle', puzzleRoutes);
app.use('/api/hint', hintRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/auth', authRoutes);

// Test route - just to check server is alive
app.get('/', (req, res) => {
  res.json({ message: 'Digital Enigma server is running!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});