import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginPage from './components/Login/login';
import App from './App';

const AppWrapper = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  const extractNameFromEmail = (email) => {
    if (!email || typeof email !== 'string') return 'User';
    const prefix = email.split('@')[0];
    return prefix
      .replace(/\./g, ' ')
      .replace(/\d+/g, '')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleLoginSuccess = (email) => {
    const name = extractNameFromEmail(email);
    setUserName(name);
    setIsLoggedIn(true);
    navigate('/');
  };

  return isLoggedIn ? (
    <App userName={userName} />
  ) : (
    <LoginPage onLoginSuccess={handleLoginSuccess} />
  );
};

export default AppWrapper;
