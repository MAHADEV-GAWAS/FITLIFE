import React from 'react';

/**
 * Navbar Component
 * Displays logo, navigation tabs, and live backend connection status pill.
 */
export default function Navbar({ activeTab, setActiveTab, backendStatus, onOpenStatusModal }) {
  return (
    <header className="navbar">
      <div className="container nav-container">
        {/* Brand Logo */}
        <div className="logo" onClick={() => setActiveTab('home')} role="button" tabIndex={0}>
          <div className="logo-icon">FL</div>
          <span>Fit<span className="logo-highlight">Life</span></span>
        </div>

        {/* Navigation Links */}
        <nav>
          <ul className="nav-links">
            <li>
              <button
                type="button"
                className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`}
                onClick={() => setActiveTab('home')}
              >
                Home
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`nav-btn ${activeTab === 'create' ? 'active' : ''}`}
                onClick={() => setActiveTab('create')}
              >
                Create Diet Plan
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`nav-btn ${activeTab === 'plans' ? 'active' : ''}`}
                onClick={() => setActiveTab('plans')}
              >
                My Plans
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`nav-btn ${activeTab === 'about' ? 'active' : ''}`}
                onClick={() => setActiveTab('about')}
              >
                About &amp; Viva
              </button>
            </li>
          </ul>
        </nav>

        {/* Backend Status & Quick Action */}
        <div className="nav-actions">
          <div
            className="status-pill"
            onClick={onOpenStatusModal}
            title="Click to check backend details and connection commands"
            role="button"
            tabIndex={0}
          >
            <span
              className={`status-dot ${
                backendStatus.online === true
                  ? 'online'
                  : backendStatus.checking
                  ? 'checking'
                  : 'offline'
              }`}
            />
            <span>
              {backendStatus.checking
                ? 'Connecting...'
                : backendStatus.online
                ? 'Spring Boot Online'
                : 'Backend Offline'}
            </span>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setActiveTab('create')}
          >
            + New Plan
          </button>
        </div>
      </div>
    </header>
  );
}
