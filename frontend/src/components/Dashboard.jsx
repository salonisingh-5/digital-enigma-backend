import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import ZoneCard from './ZoneCard';
import Leaderboard from './Leaderboard';
import AIChat from './AIChat';
import PlayerStats from './PlayerStats';
import RecentActivity from './RecentActivity';
import PuzzleModal from './PuzzleModal';
import './Dashboard.css';

const domainChallengeCount = {
  cryptography: 3,
  web: 3,
  forensics: 3,
  database: 3,
};

export default function Dashboard({ player, tokens, setTokens }) {
  const [activePage, setActivePage] = useState('dashboard');
  const [activeZone, setActiveZone] = useState(null);
  const [solvedCount, setSolvedCount] = useState({
    cryptography: 0, web: 0, forensics: 0, database: 0,
  });
  const [totalSolved, setTotalSolved] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);

  const handleEnterZone = (zone) => setActiveZone(zone);

  const handleSolve = (puzzle) => {
    const rewardMap = { 1: 50, 2: 80, 3: 120 };
    const reward = rewardMap[puzzle.difficulty] || 50;
    setTokens((t) => t + reward);
    setSolvedCount((prev) => ({
      ...prev,
      [puzzle.domain]: (prev[puzzle.domain] || 0) + 1,
    }));
    setTotalSolved((n) => n + 1);
    setRecentActivity((prev) => [
      {
        id: Date.now(),
        text: `Solved ${puzzle.title}`,
        tokens: `+${reward} Tokens`,
        domain: puzzle.domain,
        time: 'just now',
      },
      ...prev.slice(0, 9),
    ]);
  };

  const handleSendAI = (message) => {
    console.log('AI message:', message);
  };

  return (
    <div className="dashboard">
      <Header player={player} tokens={tokens ?? 250} />
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      <main className="dashboard-main">
        <div className="zone-section-header">
          <h2 className="zone-section-title">CHOOSE YOUR ZONE</h2>
          <p className="zone-section-sub">Solve challenges. Earn tokens. Be the ultimate hacker!</p>
        </div>

        <div className="dashboard-top-row">
          <div className="zones-grid">
            <ZoneCard zone="cryptography" onEnter={handleEnterZone} solved={solvedCount.cryptography} total={domainChallengeCount.cryptography} />
            <ZoneCard zone="web"          onEnter={handleEnterZone} solved={solvedCount.web}          total={domainChallengeCount.web} />
            <ZoneCard zone="forensics"    onEnter={handleEnterZone} solved={solvedCount.forensics}    total={domainChallengeCount.forensics} />
            <ZoneCard zone="database"     onEnter={handleEnterZone} solved={solvedCount.database}     total={domainChallengeCount.database} />
          </div>
          <div className="leaderboard-slot">
            <Leaderboard />
          </div>
        </div>

        <div className="dashboard-bottom-row">
          <div className="ai-slot"><AIChat onSend={handleSendAI} /></div>
          <div className="stats-slot"><PlayerStats totalSolved={totalSolved} tokens={tokens} /></div>
          <div className="activity-slot"><RecentActivity activity={recentActivity} /></div>
        </div>
      </main>

      {activeZone && (
        <PuzzleModal
          zone={activeZone}
          onClose={() => setActiveZone(null)}
          tokens={tokens}
          setTokens={setTokens}
          onSolve={handleSolve}
        />
      )}
    </div>
  );
}
