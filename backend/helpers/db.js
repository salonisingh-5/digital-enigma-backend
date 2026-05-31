const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD  || 'ShreyaSharma@21.8' ,   // dotenv handles the @ symbol fine when quoted
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    console.error('Check your DB_PASSWORD in .env — special characters like @ need quotes');
  } else {
    console.log('Connected to PostgreSQL successfully!');
    release();
  }
});

module.exports = pool;