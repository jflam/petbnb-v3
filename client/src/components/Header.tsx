import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
}

export default function Header({ user, onLogin, onLogout }: HeaderProps): React.ReactElement {
  return (
    <header className="header">
      <a href="/" className="logo">PetBnB</a>
      <div>
        {user ? (
          <div className="user-menu">
            <span>Welcome, {user.firstName}</span>
            <button onClick={onLogout} className="btn">Logout</button>
          </div>
        ) : (
          <button onClick={onLogin} className="btn">Login</button>
        )}
      </div>
    </header>
  );
}