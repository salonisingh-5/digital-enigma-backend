import React from 'react';
import './Leaderboard.css';

const MOCK_DATA = [
  { rank: 1, name: 'root_shadow',  tokens: 1250 },
  { rank: 2, name: 'null_byte',    tokens: 980 },
  { rank: 3, name: 'cyber_queen',  tokens: 850, isCurrentUser: true },
  { rank: 4, name: 'hack_master',  tokens: 670 },
  { rank: 5, name: 'dark_knight',  tokens: 540 },
  { rank: 6, name: 'phantom_x',    tokens: 430 },
  { rank: 7, name: 'zero_day',     tokens: 310 },
  { rank: 8, name: 'byte_bandit',  tokens: 210 },
];

const rankColors = { 1: '#f59e0b', 2: '#94a3b8', 3: '#a855f7' };

export default function Leaderboard({ data }) {
  const players = data || MOCK_DATA;

  return (
    <div className="leaderboard-panel">
      <div className="lb-header">
        <span className="lb-title">LEADERBOARD</span>
      </div>

      <div className="lb-cols">
        <span>#</span>
        <span>PLAYER</span>
        <span style={{ textAlign: 'right' }}>TOKENS</span>
      </div>

      <div className="lb-list">
        {players.map((p) => (
          <div key={p.rank} className={`lb-row ${p.isCurrentUser ? 'lb-row--me' : ''}`}>
            <div className="lb-rank">
              {p.rank <= 3 ? (
                <span className="lb-medal" style={{ color: rankColors[p.rank] }}>
                  {p.rank}
                </span>
              ) : (
                <span className="lb-rank-num">{p.rank}</span>
              )}
            </div>
            <div className={`lb-name ${p.isCurrentUser ? 'lb-name--me' : ''}`}>
              {p.name}
            </div>
            <div className={`lb-tokens ${p.isCurrentUser ? 'lb-tokens--me' : ''}`}>
              {p.tokens.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <button className="lb-view-all">VIEW FULL LEADERBOARD</button>
    </div>
  );
}
