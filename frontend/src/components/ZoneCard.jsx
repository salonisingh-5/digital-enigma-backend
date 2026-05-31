import React from 'react';
import './ZoneCard.css';

const zoneConfig = {
  cryptography: {
    color: 'purple',
    label: 'CRYPTOGRAPHY',
    desc: 'Decode the secrets hidden in plain sight.',
    challenges: 3,
    icon: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="36" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="4 3" opacity="0.5"/>
        <circle cx="40" cy="40" r="28" stroke="#8b5cf6" strokeWidth="1" opacity="0.3"/>
        <rect x="28" y="36" width="24" height="20" rx="3" stroke="#a855f7" strokeWidth="2" fill="rgba(139,92,246,0.15)"/>
        <path d="M32 36 L32 30 Q32 22 40 22 Q48 22 48 30 L48 36" stroke="#a855f7" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <circle cx="40" cy="46" r="3" fill="#a855f7"/>
        <line x1="40" y1="49" x2="40" y2="53" stroke="#a855f7" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  web: {
    color: 'cyan',
    label: 'WEB EXPLOITATION',
    desc: 'Find vulnerabilities. Exploit the web.',
    challenges: 3,
    icon: (
      <svg viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" stroke="#06b6d4" strokeWidth="1" strokeDasharray="4 3" opacity="0.5"/>
        <circle cx="40" cy="40" r="22" stroke="#06b6d4" strokeWidth="2" fill="rgba(6,182,212,0.08)"/>
        <ellipse cx="40" cy="40" rx="10" ry="22" stroke="#06b6d4" strokeWidth="1.5" fill="none"/>
        <line x1="18" y1="40" x2="62" y2="40" stroke="#06b6d4" strokeWidth="1.5"/>
        <line x1="21" y1="28" x2="59" y2="28" stroke="#06b6d4" strokeWidth="1" opacity="0.5"/>
        <line x1="21" y1="52" x2="59" y2="52" stroke="#06b6d4" strokeWidth="1" opacity="0.5"/>
      </svg>
    ),
  },
  forensics: {
    color: 'orange',
    label: 'FORENSICS',
    desc: 'Analyze the evidence. Uncover the truth.',
    challenges: 3,
    icon: (
      <svg viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" stroke="#f97316" strokeWidth="1" strokeDasharray="4 3" opacity="0.5"/>
        <circle cx="36" cy="36" r="16" stroke="#f97316" strokeWidth="2.5" fill="rgba(249,115,22,0.08)"/>
        <line x1="48" y1="48" x2="60" y2="60" stroke="#f97316" strokeWidth="3.5" strokeLinecap="round"/>
        <circle cx="36" cy="36" r="6" stroke="#fb923c" strokeWidth="1.5" fill="rgba(249,115,22,0.2)"/>
      </svg>
    ),
  },
  database: {
    color: 'green',
    label: 'DATABASE',
    desc: 'Query. Inject. Extract. Take control.',
    challenges: 3,
    icon: (
      <svg viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" stroke="#10b981" strokeWidth="1" strokeDasharray="4 3" opacity="0.5"/>
        <ellipse cx="40" cy="26" rx="16" ry="6" stroke="#10b981" strokeWidth="2" fill="rgba(16,185,129,0.15)"/>
        <path d="M24 26 L24 40 Q24 46 40 46 Q56 46 56 40 L56 26" stroke="#10b981" strokeWidth="2" fill="rgba(16,185,129,0.08)"/>
        <path d="M24 40 L24 54 Q24 60 40 60 Q56 60 56 54 L56 40" stroke="#10b981" strokeWidth="2" fill="rgba(16,185,129,0.08)"/>
        <ellipse cx="40" cy="40" rx="16" ry="6" stroke="#10b981" strokeWidth="1.5" fill="rgba(16,185,129,0.1)"/>
      </svg>
    ),
  },
};

export default function ZoneCard({ zone, onEnter, solved = 0, total }) {
  const config = zoneConfig[zone];
  if (!config) return null;
  const challengeTotal = total ?? config.challenges;
  const allSolved = solved >= challengeTotal;

  return (
    <div className={`zone-card zone-card--${config.color} ${allSolved ? 'zone-card--complete' : ''}`} onClick={() => onEnter && onEnter(zone)}>
      <div className="zone-card__sweep" />
      <span className="corner corner--tl" />
      <span className="corner corner--tr" />
      <span className="corner corner--bl" />
      <span className="corner corner--br" />

      <div className="zone-card__icon">{config.icon}</div>

      <div className={`zone-card__label neon-text-${config.color}`}>{config.label}</div>
      <div className="zone-card__desc">{config.desc}</div>

      {/* Progress */}
      <div className="zone-card__progress-row">
        <span className="zone-card__count">{challengeTotal} Challenges</span>
        {solved > 0 && (
          <span className={`zone-card__solved neon-text-${config.color}`}>
            {solved}/{challengeTotal} solved
          </span>
        )}
      </div>

      {/* Progress bar */}
      {solved > 0 && (
        <div className="zone-card__bar-track">
          <div
            className={`zone-card__bar-fill zone-card__bar-fill--${config.color}`}
            style={{ width: `${(solved / challengeTotal) * 100}%` }}
          />
        </div>
      )}

      <button className={`zone-card__btn zone-card__btn--${config.color}`}>
        {allSolved ? '✓ COMPLETED' : 'ENTER ZONE'}
      </button>
    </div>
  );
}
