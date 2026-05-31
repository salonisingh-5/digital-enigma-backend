import React from 'react';
import './PlayerStats.css';

export default function PlayerStats({ stats }) {
  const s = stats || {
    challengesSolved: 15,
    totalTokensEarned: 850,
    successRate: 75,
    currentRank: 3,
  };

  return (
    <div className="stats-panel">
      <div className="stats-title">YOUR STATS</div>
      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon stat-icon--cyan">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M14 17.5 L17.5 21 L21 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M17.5 14 L17.5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="stat-info">
            <div className="stat-label">Challenges Solved</div>
            <div className="stat-value stat-value--cyan">{s.challengesSolved}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon--orange">
            <svg viewBox="0 0 24 24" fill="none">
              <ellipse cx="12" cy="6" rx="9" ry="3" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M3 6 L3 12 Q3 16 12 16 Q21 16 21 12 L21 6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M3 12 L3 18 Q3 22 12 22 Q21 22 21 18 L21 12" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            </svg>
          </div>
          <div className="stat-info">
            <div className="stat-label">Total Tokens Earned</div>
            <div className="stat-value stat-value--orange">{s.totalTokensEarned.toLocaleString()}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon--green">
            <svg viewBox="0 0 24 24" fill="none">
              <polyline points="3,17 8,12 12,15 16,9 21,7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="3" y1="21" x2="21" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="stat-info">
            <div className="stat-label">Success Rate</div>
            <div className="stat-value stat-value--green">{s.successRate}%</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon--purple">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M6 21 L6 19 Q6 15 12 15 Q18 15 18 19 L18 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M16 4 L18 6 M8 4 L6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="stat-info">
            <div className="stat-label">Current Rank</div>
            <div className="stat-value stat-value--purple">{s.currentRank}</div>
          </div>
        </div>

      </div>
    </div>
  );
}
