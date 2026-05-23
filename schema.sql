CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    tokens INTEGER DEFAULT 100,
    puzzles_solved INTEGER DEFAULT 0,
    total_hints_used INTEGER DEFAULT 0,
    difficulty_multiplier FLOAT DEFAULT 1.0,
    crypto_score INTEGER DEFAULT 0,
    web_score INTEGER DEFAULT 0,
    forensics_score INTEGER DEFAULT 0,
    logic_score INTEGER DEFAULT 0,
    network_score INTEGER DEFAULT 0,
    rank_points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE puzzles (
    id SERIAL PRIMARY KEY,
    domain VARCHAR(30) NOT NULL,
    question TEXT NOT NULL,
    flag VARCHAR(100) NOT NULL,
    difficulty INTEGER DEFAULT 1,
    time_limit INTEGER DEFAULT 300,
    hint1 TEXT,
    hint2 TEXT,
    hint3 TEXT
);

CREATE TABLE attempts (
    id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES players(id),
    puzzle_id INTEGER REFERENCES puzzles(id),
    time_taken INTEGER,
    hints_used INTEGER DEFAULT 0,
    tokens_spent INTEGER DEFAULT 0,
    solved BOOLEAN DEFAULT FALSE,
    attempted_at TIMESTAMP DEFAULT NOW()
);

CREATE VIEW leaderboard AS
SELECT
    name,
    rank_points,
    puzzles_solved,
    total_hints_used,
    RANK() OVER (ORDER BY rank_points DESC) AS position
FROM players;