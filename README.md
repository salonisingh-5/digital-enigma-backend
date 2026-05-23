# Digital Enigma - Database Setup

## Setup Instructions

1. Create database:
   CREATE DATABASE digital_enigma;

2. Run schema:
   psql -U postgres -d digital_enigma -f schema.sql

3. Insert puzzles:
   psql -U postgres -d digital_enigma -f seed.sql

## Tables
- players
- puzzles
- attempts
- leaderboard (view)

## Notes
- PostgreSQL required
- Default port: 5432