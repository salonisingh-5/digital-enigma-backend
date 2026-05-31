import React, { useState } from 'react';
import './Login.css';

export default function Login({ onLogin, onRegister, error, isLoading }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const handleSubmit = () => {
    if (!username.trim() || !password.trim()) return;
    if (isRegisterMode) {
      onRegister && onRegister({ username: username.trim(), password });
    } else {
      onLogin && onLogin({ username: username.trim(), password });
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <span className="lc lc--tl" /><span className="lc lc--tr" />
        <span className="lc lc--bl" /><span className="lc lc--br" />

        <div className="login-logo">
          <div className="login-logo-icon">
            <svg viewBox="0 0 60 60" fill="none">
              <polygon points="30,3 57,17 57,43 30,57 3,43 3,17" fill="rgba(139,92,246,0.15)" stroke="#8b5cf6" strokeWidth="1.5"/>
              <circle cx="30" cy="30" r="12" fill="none" stroke="#a855f7" strokeWidth="1.5"/>
              <circle cx="30" cy="22" r="4.5" fill="#a855f7"/>
              <path d="M21 40 Q30 32 39 40" stroke="#a855f7" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div className="login-logo-sub">THE</div>
            <div className="login-logo-main">DIGITAL <span>ENIGMA</span></div>
            <div className="login-logo-tag">CTF CHALLENGE PLATFORM</div>
          </div>
        </div>

        <div className="login-divider" />

        <div className="login-form-title">
          {isRegisterMode ? 'CREATE ACCOUNT' : 'INITIATE ACCESS'}
        </div>

        <div className="login-form">
          <div className="login-field">
            <label className="login-label">HACKER ALIAS</label>
            <input
              className="login-input"
              type="text"
              placeholder="Enter your alias..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              autoComplete="off"
            />
          </div>

          <div className="login-field">
            <label className="login-label">ACCESS CODE</label>
            <input
              className="login-input"
              type="password"
              placeholder="Enter access code..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button
            className="login-btn"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading
              ? 'CONNECTING...'
              : isRegisterMode
              ? 'REGISTER HACKER'
              : 'BREACH THE SYSTEM'}
          </button>

          <div className="login-register">
            {isRegisterMode ? (
              <>
                Already have an account?{' '}
                <span onClick={() => { setIsRegisterMode(false); setUsername(''); setPassword(''); }}>
                  Login here
                </span>
              </>
            ) : (
              <>
                No account?{' '}
                <span onClick={() => { setIsRegisterMode(true); setUsername(''); setPassword(''); }}>
                  Register as new hacker
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
