import React, { useState, useEffect, useCallback } from 'react';
import { getPuzzlesByDomain, difficultyLabel, difficultyColor } from '../data/puzzles';
import './PuzzleModal.css';

const zoneColors = {
  cryptography: 'purple',
  web: 'cyan',
  forensics: 'orange',
  database: 'green',
};

const HINT_COSTS = [5, 20, 50];

export default function PuzzleModal({ zone, onClose, tokens, setTokens, onSolve }) {
  const puzzles = getPuzzlesByDomain(zone);
  const color = zoneColors[zone] || 'purple';

  const [selected, setSelected] = useState(null);
  const [flag, setFlag] = useState('');
  const [status, setStatus] = useState(null); // 'correct' | 'wrong' | null
  const [hintsRevealed, setHintsRevealed] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [solved, setSolved] = useState({});

  // Timer
  useEffect(() => {
    if (!selected) return;
    setTimeLeft(selected.time_limit);
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(id); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [selected]);

  const handleSelectPuzzle = (puzzle) => {
    setSelected(puzzle);
    setFlag('');
    setStatus(null);
    setHintsRevealed([]);
  };

  const handleBack = () => {
    setSelected(null);
    setFlag('');
    setStatus(null);
    setHintsRevealed([]);
    setTimeLeft(null);
  };

  const handleSubmit = () => {
    if (!flag.trim()) return;
    const correct = flag.trim().toUpperCase() === selected.flag.toUpperCase();
    if (correct) {
      setStatus('correct');
      setSolved((prev) => ({ ...prev, [selected.id]: true }));
      onSolve && onSolve(selected);
    } else {
      setStatus('wrong');
      setTimeout(() => setStatus(null), 1500);
    }
  };

  const handleHint = (level) => {
    const idx = level - 1;
    if (hintsRevealed.includes(idx)) return;
    const cost = HINT_COSTS[idx];
    if (tokens < cost) {
      alert(`Not enough tokens! You need ${cost} tokens.`);
      return;
    }
    setTokens && setTokens((t) => t - cost);
    setHintsRevealed((prev) => [...prev, idx]);
  };

  const formatTime = (s) => {
    if (s == null) return '–:––';
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal-box modal-box--${color} ${status === 'correct' ? 'modal-box--correct' : ''} ${status === 'wrong' ? 'modal-box--wrong' : ''}`}>
        <span className="corner corner--tl" />
        <span className="corner corner--tr" />
        <span className="corner corner--bl" />
        <span className="corner corner--br" />

        {/* ── Zone list view ── */}
        {!selected && (
          <>
            <div className="modal-header">
              <div>
                <div className={`modal-zone neon-text-${color}`}>{zone.toUpperCase()} ZONE</div>
                <div className="modal-title">SELECT A CHALLENGE</div>
              </div>
              <button className="modal-close" onClick={onClose}>✕</button>
            </div>

            <div className="puzzle-list">
              {puzzles.map((p) => (
                <button
                  key={p.id}
                  className={`puzzle-list-item puzzle-list-item--${color} ${solved[p.id] ? 'puzzle-list-item--solved' : ''}`}
                  onClick={() => !solved[p.id] && handleSelectPuzzle(p)}
                  disabled={solved[p.id]}
                >
                  <div className="pli-left">
                    <span className="pli-id font-mono">#{p.id.toString().padStart(2, '0')}</span>
                    <div className="pli-info">
                      <span className="pli-title">{p.title}</span>
                      <span className="pli-desc">{p.question.slice(0, 60)}{p.question.length > 60 ? '…' : ''}</span>
                    </div>
                  </div>
                  <div className="pli-right">
                    <span className="pli-diff" style={{ color: difficultyColor(p.difficulty) }}>
                      {difficultyLabel(p.difficulty)}
                    </span>
                    <span className="pli-time font-mono">{Math.floor(p.time_limit / 60)}:{String(p.time_limit % 60).padStart(2,'0')}</span>
                    {solved[p.id] && <span className="pli-solved">✓ SOLVED</span>}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* ── Puzzle solve view ── */}
        {selected && (
          <>
            <div className="modal-header">
              <div>
                <div className={`modal-zone neon-text-${color}`}>{zone.toUpperCase()} ZONE · #{selected.id.toString().padStart(2,'0')}</div>
                <div className="modal-title">{selected.title}</div>
              </div>
              <div className="modal-meta">
                <div className={`modal-timer ${timeLeft !== null && timeLeft < 60 ? 'modal-timer--urgent' : ''}`}>
                  {formatTime(timeLeft)}
                </div>
                <button className="modal-close modal-close--back" onClick={handleBack} title="Back to list">←</button>
                <button className="modal-close" onClick={onClose}>✕</button>
              </div>
            </div>

            {/* Difficulty badge */}
            <div className="modal-diff-row">
              <span className="modal-diff-badge" style={{ color: difficultyColor(selected.difficulty), borderColor: difficultyColor(selected.difficulty) + '55', background: difficultyColor(selected.difficulty) + '15' }}>
                {difficultyLabel(selected.difficulty)}
              </span>
              <span className="modal-time-badge font-mono">⏱ {Math.floor(selected.time_limit / 60)} min limit</span>
            </div>

            {/* Question */}
            <div className="modal-question">{selected.question}</div>

            {/* Status */}
            {status === 'correct' && <div className="modal-status modal-status--correct">✓ CORRECT FLAG! Well played, hacker.</div>}
            {status === 'wrong'   && <div className="modal-status modal-status--wrong">✗ Wrong flag. Try again or use a hint.</div>}

            {/* Flag input */}
            {status !== 'correct' && (
              <div className="modal-input-row">
                <input
                  className={`modal-input modal-input--${color}`}
                  type="text"
                  placeholder="Enter flag here..."
                  value={flag}
                  onChange={(e) => setFlag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  autoFocus
                />
                <button className={`modal-submit modal-submit--${color}`} onClick={handleSubmit}>
                  SUBMIT
                </button>
              </div>
            )}

            {/* Hints section */}
            {status !== 'correct' && (
              <div className="modal-hints">
                <div className="modal-hints-label">NEED A HINT?</div>
                <div className="modal-hint-btns">
                  {selected.hints.map((hintText, idx) => (
                    <div key={idx} className="hint-wrapper">
                      {hintsRevealed.includes(idx) ? (
                        <div className={`hint-revealed hint-revealed--${color}`}>
                          <span className="hint-revealed__num">HINT {idx + 1}</span>
                          <span className="hint-revealed__text">{hintText}</span>
                        </div>
                      ) : (
                        <button
                          className={`hint-btn ${idx === 2 ? 'hint-btn--skip' : ''}`}
                          onClick={() => handleHint(idx + 1)}
                        >
                          <span className="hint-btn__label">
                            {idx === 0 ? 'Light Hint' : idx === 1 ? 'Detailed Hint' : 'Reveal Answer'}
                          </span>
                          <span className="hint-btn__cost">−{HINT_COSTS[idx]} tokens</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Solved state next puzzle CTA */}
            {status === 'correct' && (
              <button className={`modal-submit modal-submit--${color}`} style={{ alignSelf: 'flex-start' }} onClick={handleBack}>
                ← BACK TO CHALLENGES
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
