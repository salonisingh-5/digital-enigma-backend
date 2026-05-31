import React, { useState } from 'react';
import './styles/cyberpunk.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

export default function App() {
  const [player, setPlayer] = useState(null);
  const [tokens, setTokens] = useState(250);
  const [loginError, setLoginError] = useState('');

  const handleLogin = ({ username, password }) => {
    if (!username || !password) {
      setLoginError('Please fill in all fields.');
      return;
    }
    setPlayer({ name: username, id: 1 });
    setLoginError('');
  };

  if (!player) {
    return <Login onLogin={handleLogin} error={loginError} />;
  }

  return (
    <Dashboard
      player={player}
      tokens={tokens}
      setTokens={setTokens}
    />
  );
}
