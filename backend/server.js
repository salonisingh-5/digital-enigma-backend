const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

app.use('/api/auth',        require('./routes/auth'));
app.use('/api/puzzle',      require('./routes/puzzle'));
app.use('/api/hint',        require('./routes/hint'));
app.use('/api/leaderboard', require('./routes/leaderboard'));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Digital Enigma backend running' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.error(`Backend running on http://localhost:${PORT}`);
});