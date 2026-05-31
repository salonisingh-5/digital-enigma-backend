import React from 'react';
import './Sidebar.css';

const navItems = [
  {
    id: 'dashboard',
    label: 'DASHBOARD',
    icon: (
      <svg viewBox="0 0 20 20" fill="none">
        <rect x="2" y="2" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="11" y="2" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="2" y="11" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="11" y="11" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    id: 'profile',
    label: 'PROFILE',
    icon: (
      <svg viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M3 18 Q3 13 10 13 Q17 13 17 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'leaderboard',
    label: 'LEADERBOARD',
    icon: (
      <svg viewBox="0 0 20 20" fill="none">
        <rect x="2" y="12" width="4" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="8" y="8"  width="4" height="10" rx="0.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="14" y="4" width="4" height="14" rx="0.5" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    id: 'history',
    label: 'HISTORY',
    icon: (
      <svg viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M10 6 L10 10 L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activePage === item.id ? 'nav-item--active' : ''}`}
            onClick={() => onNavigate && onNavigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {activePage === item.id && <span className="nav-active-bar" />}
          </button>
        ))}
      </nav>
    </aside>
  );
}
