import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router";

const NotFound = () => {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [glitchActive, setGlitchActive] = useState(false);

  // 3D tilt effect
  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 25;
    const y = (e.clientY - rect.top - rect.height / 2) / 25;
    setMousePos({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: 0, y: 0 });
  }, []);

  // Random glitch trigger
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // You can customize this to search your app or redirect to Google
      window.location.href = `/?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="nf-root" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <PageStyles />

      {/* Floating particles */}
      <div className="nf-particles" aria-hidden="true">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="nf-particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${8 + Math.random() * 10}s`
          }} />
        ))}
      </div>

      <div 
        className="nf-wrap" 
        ref={cardRef}
        style={{
          transform: `perspective(1000px) rotateX(${-mousePos.y}deg) rotateY(${mousePos.x}deg)`
        }}
      >
        {/* 404 hero with glitch */}
        <div className="nf-hero">
          <div className={`nf-404 ${glitchActive ? 'glitch' : ''}`} data-text="404">
            404
          </div>
          <div className="nf-icon-wrap">
            <CompassIcon />
          </div>
        </div>

        {/* Decorative thread */}
        <div className="nf-thread" aria-hidden="true">
          <div className="nf-line" />
          <div className="nf-dot" />
          <div className="nf-dot" style={{ opacity: 0.3 }} />
          <div className="nf-dot" style={{ opacity: 0.15 }} />
          <div className="nf-line" />
        </div>

        {/* Copy */}
        <h1 className="nf-heading">Lost in the void</h1>
        <p className="nf-body">
          This page seems to have drifted into the digital abyss.<br />
          The coordinates you entered don't match any known destination.
        </p>

        {/* Search bar - modern 2026 trend */}
        <form className="nf-search" onSubmit={handleSearch}>
          <div className="nf-search-icon">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search for what you're looking for..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="nf-search-input"
          />
          <button type="submit" className="nf-search-btn">
            Search
          </button>
        </form>

        {/* Dynamic coordinates display */}
        <div className="nf-coords">
          <span className="nf-coords-label">LAST KNOWN POSITION</span>
          <span className="nf-coords-value">
            {mousePos.x.toFixed(2)}°N, {mousePos.y.toFixed(2)}°W
          </span>
        </div>

        {/* Actions */}
        <div className="nf-actions">
          <button className="nf-btn nf-btn-ghost" onClick={() => navigate(-1)}>
            <span className="nf-arrow"><ArrowLeft /></span>
            Go back
          </button>
          <button className="nf-btn nf-btn-primary" onClick={() => navigate("/")}>
            <HomeIcon />
            Back to home
          </button>
        </div>

        {/* Footer */}
        <p className="nf-code">ERROR · 404 · PAGE_NOT_FOUND · SNITCH</p>
      </div>

      {/* Noise overlay */}
      <div className="nf-noise" aria-hidden="true" />
    </div>
  );
};

const PageStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(30px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50%       { transform: translateY(-15px) rotate(3deg); }
    }
    @keyframes particle {
      0% { transform: translateY(100vh) scale(0); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(-10vh) scale(1); opacity: 0; }
    }
    @keyframes glitch-1 {
      0% { clip-path: inset(40% 0 61% 0); transform: translate(-2px, 2px); }
      20% { clip-path: inset(92% 0 1% 0); transform: translate(1px, -1px); }
      40% { clip-path: inset(43% 0 1% 0); transform: translate(-1px, 2px); }
      60% { clip-path: inset(25% 0 58% 0); transform: translate(2px, 1px); }
      80% { clip-path: inset(54% 0 7% 0); transform: translate(-2px, -2px); }
      100% { clip-path: inset(58% 0 43% 0); transform: translate(1px, 1px); }
    }
    @keyframes grain {
      0%, 100% { transform: translate(0, 0); }
      10% { transform: translate(-5%, -10%); }
      20% { transform: translate(-15%, 5%); }
      30% { transform: translate(7%, -25%); }
      40% { transform: translate(-5%, 25%); }
      50% { transform: translate(-15%, 10%); }
      60% { transform: translate(15%, 0%); }
      70% { transform: translate(0%, 15%); }
      80% { transform: translate(3%, 35%); }
      90% { transform: translate(-10%, 10%); }
    }

    .nf-root {
      min-height: 100vh;
      background: #0a0a0a;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem 1.5rem 3rem;
      font-family: 'DM Sans', sans-serif;
      position: relative;
      overflow: hidden;
      cursor: default;
    }

    /* Noise texture overlay */
    .nf-noise {
      position: fixed;
      inset: -50%;
      width: 200%;
      height: 200%;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
      opacity: 0.03;
      pointer-events: none;
      animation: grain 8s steps(10) infinite;
      z-index: 1;
    }

    /* Floating particles */
    .nf-particles {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
    }
    .nf-particle {
      position: absolute;
      width: 2px;
      height: 2px;
      background: #c4956a;
      border-radius: 50%;
      opacity: 0.4;
      animation: particle linear infinite;
    }

    .nf-wrap {
      text-align: center;
      width: 100%;
      max-width: 520px;
      animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
      position: relative;
      z-index: 2;
      transition: transform 0.1s ease-out;
      transform-style: preserve-3d;
    }

    /* ── 404 hero with glitch ── */
    .nf-hero {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 2rem;
      transform-style: preserve-3d;
    }
    .nf-404 {
      font-family: 'Playfair Display', serif;
      font-size: clamp(120px, 22vw, 180px);
      font-weight: 600;
      line-height: 1;
      letter-spacing: -0.04em;
      color: #1c1c1c;
      user-select: none;
      position: relative;
      transition: color 0.3s ease;
    }
    .nf-404.glitch {
      color: #c4956a;
    }
    .nf-404.glitch::before,
    .nf-404.glitch::after {
      content: attr(data-text);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .nf-404.glitch::before {
      left: 2px;
      text-shadow: -2px 0 #ff00c1;
      clip-path: inset(0 0 0 0);
      animation: glitch-1 0.3s linear infinite;
    }
    .nf-404.glitch::after {
      left: -2px;
      text-shadow: -2px 0 #00fff9;
      clip-path: inset(0 0 0 0);
      animation: glitch-1 0.3s linear infinite reverse;
    }
    .nf-icon-wrap {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: float 5s ease-in-out infinite;
      transform: translateZ(30px);
    }
    .nf-triangle {
      width: clamp(48px, 9vw, 72px);
      height: clamp(48px, 9vw, 72px);
      color: #c4956a;
      filter: drop-shadow(0 0 20px rgba(196, 149, 106, 0.3));
    }

    /* ── decorative thread ── */
    .nf-thread {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      margin-bottom: 1.5rem;
    }
    .nf-dot {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #c4956a;
      opacity: 0.5;
    }
    .nf-line {
      width: 32px;
      height: 1px;
      background: linear-gradient(90deg, transparent, #c4956a55, transparent);
    }

    /* ── copy ── */
    .nf-heading {
      font-family: 'Playfair Display', serif;
      font-size: clamp(24px, 5vw, 32px);
      font-weight: 500;
      color: #f0ede8;
      margin: 0 0 0.75rem;
      line-height: 1.2;
    }
    .nf-body {
      font-size: clamp(14px, 2.5vw, 16px);
      color: #888;
      line-height: 1.75;
      margin: 0 auto 2rem;
      max-width: 360px;
      font-weight: 400;
    }

    /* ── search bar (2026 trend) ── */
    .nf-search {
      display: flex;
      align-items: center;
      gap: 0;
      background: #0f0f0f;
      border: 1px solid #222;
      border-radius: 12px;
      padding: 4px;
      margin-bottom: 1.5rem;
      transition: all 0.3s ease;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }
    .nf-search:focus-within {
      border-color: #c4956a;
      box-shadow: 0 0 0 3px rgba(196, 149, 106, 0.1);
      background: #111;
    }
    .nf-search-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 12px;
      color: #666;
    }
    .nf-search-icon svg {
      width: 16px;
      height: 16px;
    }
    .nf-search-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: #f0ede8;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      padding: 10px 0;
      min-width: 0;
    }
    .nf-search-input::placeholder {
      color: #555;
    }
    .nf-search-btn {
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      color: #c4956a;
      padding: 8px 16px;
      border-radius: 8px;
      font-family: 'DM Sans', sans-serif;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .nf-search-btn:hover {
      background: #c4956a;
      color: #0a0a0a;
      border-color: #c4956a;
    }

    /* ── coordinates ── */
    .nf-coords {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      margin-bottom: 2rem;
      font-family: 'DM Mono', monospace;
    }
    .nf-coords-label {
      font-size: 9px;
      letter-spacing: 0.2em;
      color: #333;
      text-transform: uppercase;
    }
    .nf-coords-value {
      font-size: 11px;
      color: #c4956a;
      opacity: 0.7;
      letter-spacing: 0.05em;
    }

    /* ── buttons ── */
    .nf-actions {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      margin-bottom: 2.5rem;
    }
    @media (min-width: 480px) {
      .nf-actions { flex-direction: row; justify-content: center; }
    }
    .nf-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 24px;
      border-radius: 10px;
      font-family: 'DM Sans', sans-serif;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.2s ease;
      width: 100%;
      border: none;
      outline: none;
      position: relative;
      overflow: hidden;
    }
    @media (min-width: 480px) {
      .nf-btn { width: auto; }
    }
    .nf-btn-ghost {
      background: #0f0f0f;
      border: 1px solid #222;
      color: #c8c4be;
    }
    .nf-btn-ghost:hover {
      background: #141414;
      border-color: #c4956a;
      color: #f0ede8;
      transform: translateY(-1px);
    }
    .nf-btn-ghost:active { transform: scale(0.98) translateY(0); }

    .nf-btn-primary {
      background: #c4956a;
      color: #0a0a0a;
    }
    .nf-btn-primary:hover { 
      background: #d4a57a; 
      transform: translateY(-1px);
      box-shadow: 0 4px 20px rgba(196, 149, 106, 0.3);
    }
    .nf-btn-primary:active { transform: scale(0.98) translateY(0); }

    .nf-btn svg {
      width: 15px;
      height: 15px;
      flex-shrink: 0;
      transition: transform 0.2s ease;
    }
    .nf-btn-ghost:hover .nf-arrow { transform: translateX(-3px); }

    /* ── footer code ── */
    .nf-code {
      font-family: 'DM Mono', 'Courier New', monospace;
      font-size: 10px;
      letter-spacing: 0.12em;
      color: #2e2e2e;
    }
  `}</style>
);

const ArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);

const CompassIcon = () => (
  <svg className="nf-triangle" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

export default NotFound;