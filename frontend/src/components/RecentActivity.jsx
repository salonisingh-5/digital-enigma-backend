import React from 'react';
import './RecentActivity.css';

const MOCK_ACTIVITY = [
  { id: 1, type: 'solved',  zone: 'cryptography', text: 'Solved Cryptography Challenge #5', tokens: +50,  time: '2m ago' },
  { id: 2, type: 'solved',  zone: 'web',          text: 'Solved Web Challenge #3',          tokens: +40,  time: '15m ago' },
  { id: 3, type: 'hint',    zone: 'forensics',    text: 'Used a hint in Forensics Challenge #2', tokens: -20, time: '30m ago' },
  { id: 4, type: 'solved',  zone: 'database',     text: 'Solved Database Challenge #1',     tokens: +60,  time: '1h ago' },
];

const zoneIcons = {
  cryptography: { color: '#8b5cf6', icon: '🔐' },
  web:          { color: '#06b6d4', icon: '🌐' },
  forensics:    { color: '#f97316', icon: '🔍' },
  database:     { color: '#10b981', icon: '🗄️' },
};

export default function RecentActivity({ activities }) {
  const items = activities || MOCK_ACTIVITY;

  return (
    <div className="activity-panel">
      <div className="activity-title">RECENT ACTIVITY</div>
      <div className="activity-list">
        {items.map((item) => {
          const zone = zoneIcons[item.zone] || zoneIcons.cryptography;
          const isPositive = item.tokens > 0;
          return (
            <div key={item.id} className="activity-row">
              <div className="activity-dot" style={{ background: zone.color, boxShadow: `0 0 8px ${zone.color}` }} />
              <div className="activity-content">
                <div className="activity-text">{item.text}</div>
                <div className={`activity-tokens ${isPositive ? 'activity-tokens--pos' : 'activity-tokens--neg'}`}>
                  {isPositive ? '+' : ''}{item.tokens} Tokens
                </div>
              </div>
              <div className="activity-time">{item.time}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
