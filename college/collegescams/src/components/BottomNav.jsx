import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusSquare, Zap, Info } from 'lucide-react';

export default function BottomNav({ onOpenCreate }) {
  const location = useLocation();
  const path = location.pathname;

  const isActive = (route) => path === route;

  return (
    <nav style={styles.nav}>
      <Link to="/home" style={styles.link}>
        <Home
          size={24}
          color={isActive('/home') ? 'var(--primary)' : 'var(--text-secondary)'}
          strokeWidth={isActive('/home') ? 3 : 2}
        />
      </Link>

      <Link to="/search" style={styles.link}>
        <Search
          size={24}
          color={isActive('/search') ? 'var(--primary)' : 'var(--text-secondary)'}
          strokeWidth={isActive('/search') ? 3 : 2}
        />
      </Link>

      <button onClick={onOpenCreate} style={styles.createBtn}>
        <PlusSquare
          size={28}
          color="var(--text-main)"
          strokeWidth={2}
        />
      </button>

      <Link to="/" style={styles.link}>
        <Zap
          size={24}
          color={isActive('/') ? 'var(--primary)' : 'var(--text-secondary)'}
          strokeWidth={isActive('/') ? 3 : 2}
        />
      </Link>

      <Link to="/about" style={styles.link}>
        <Info
          size={24}
          color={isActive('/about') ? 'var(--primary)' : 'var(--text-secondary)'}
          strokeWidth={isActive('/about') ? 3 : 2}
        />
      </Link>
    </nav>
  );
}

const styles = {
  nav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 'var(--nav-height-mobile)',
    background: 'rgba(5, 5, 5, 0.95)',
    backdropFilter: 'blur(10px)',
    borderTop: '1px solid var(--border-light)',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 1000,
    paddingBottom: 'safe-area-inset-bottom', // for iPhone home bar
  },
  link: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50px',
    height: '100%',
    background: 'transparent',
  },
  createBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
  }
};
