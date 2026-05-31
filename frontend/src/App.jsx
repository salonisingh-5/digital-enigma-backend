import React, { useState } from 'react';
import './styles/cyberpunk.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function App() {
  const [player, setPlayer] = useState(null);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async ({ username, password }) => {
    if (!username || !password) {
      setLoginError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    setLoginError('');

    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: username, password })
      });

      const data = await res.json();

      if (!data.success) {
        setLoginError(data.message || 'Login failed.');
        return;
      }

      setPlayer(data.player);
    } catch (err) {
      console.error(err);
      setLoginError('Cannot reach server. Is backend running on port 3001?');
    } finally {
      setIsLoading(false);
    }
  };

  // NEW REGISTER FUNCTION
  const handleRegister = async ({ username, password }) => {
    if (!username || !password) {
      setLoginError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    setLoginError('');

    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: username,
          password
        })
      });

      const data = await res.json();

      if (!data.success) {
        setLoginError(data.message || 'Registration failed.');
        return;
      }

      // auto-login after successful registration
      await handleLogin({ username, password });

    } catch (err) {
      console.error(err);
      setLoginError('Cannot reach server. Is backend running on port 3001?');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTokens = (newTokens) => {
    setPlayer(prev => ({
      ...prev,
      tokens: newTokens
    }));
  };

  if (!player) {
    return (
      <Login
        onLogin={handleLogin}
        onRegister={handleRegister}
        error={loginError}
        isLoading={isLoading}
      />
    );
  }

  return (
    <Dashboard
      player={player}
      tokens={player.tokens}
      setTokens={updateTokens}
    />
  );
}