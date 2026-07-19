import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`lp-navbar${scrolled ? ' lp-navbar--scrolled' : ''}`}>
      <div className="lp-container lp-navbar-inner">
        <a href="#top" className="lp-navbar-logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L22 7.5V16.5L12 22L2 16.5V7.5L12 2Z" fill="url(#lp-logo-grad)" />
            <defs>
              <linearGradient id="lp-logo-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#818cf8" />
                <stop offset="1" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
          <span>Smart API</span>
        </a>
        <nav className="lp-navbar-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <Link to="/app/smart-api" className="lp-btn lp-btn-primary lp-btn-sm">
            Launch Smart API
          </Link>
        </nav>
      </div>
    </header>
  );
}
