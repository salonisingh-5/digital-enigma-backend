import React from 'react';
import './Header.css';

export default function Header({ player, tokens }) {
  return (
    <header className="header">
      {/* Left: Logo */}
      <div className="header-logo">
        <div className="logo-icon">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="20,2 38,11 38,29 20,38 2,29 2,11" fill="rgba(139,92,246,0.15)" stroke="#8b5cf6" strokeWidth="1.5"/>
            <circle cx="20" cy="20" r="8" fill="none" stroke="#a855f7" strokeWidth="1.5"/>
            <circle cx="20" cy="14" r="3" fill="#a855f7"/>
            <path d="M14 26 Q20 20 26 26" stroke="#a855f7" strokeWidth="1.5" fill="none"/>
          </svg>
        </div>
        <div className="logo-text">
          <div className="logo-title">
            <span className="logo-the">THE</span>
            <span className="logo-main">DIGITAL <span className="logo-accent">ENIGMA</span></span>
          </div>
          <div className="logo-sub">CTF CHALLENGE PLATFORM</div>
        </div>
      </div>

      {/* Right: Player + Tokens */}
      <div className="header-right">
        <div className="player-info">
          <div className="player-avatar">
            <svg viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="19" fill="rgba(139,92,246,0.2)" stroke="#8b5cf6" strokeWidth="1"/>
              <circle cx="20" cy="15" r="6" fill="#8b5cf6" opacity="0.8"/>
              <path d="M8 34 Q20 24 32 34" fill="#8b5cf6" opacity="0.6"/>
            </svg>
          </div>
          <div className="player-details">
            <div className="player-welcome">WELCOME,</div>
            <div className="player-name">{player?.name || 'cyber_queen'}</div>
          </div>
        </div>

        <div className="header-divider" />

        <div className="tokens-display">
          <div className="tokens-icon">
            <svg viewBox="0 0 32 32" fill="none">
              <ellipse cx="16" cy="8" rx="12" ry="4" fill="rgba(6,182,212,0.3)" stroke="#06b6d4" strokeWidth="1.5"/>
              <path d="M4 8 L4 16 Q4 22 16 22 Q28 22 28 16 L28 8" stroke="#06b6d4" strokeWidth="1.5" fill="rgba(6,182,212,0.15)"/>
              <path d="M4 16 L4 24 Q4 30 16 30 Q28 30 28 24 L28 16" stroke="#06b6d4" strokeWidth="1.5" fill="rgba(6,182,212,0.15)"/>
            </svg>
          </div>
          <div className="tokens-info">
            <div className="tokens-label">TOKENS</div>
            <div className="tokens-value">{tokens ?? 250}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
