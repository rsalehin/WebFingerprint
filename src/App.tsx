/**
 * YourInfo - Privacy Awareness Globe
 * Main application component
 */

import { useState, useCallback, useMemo, Component } from 'react';
import type { ReactNode } from 'react';

class ErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { error: Error | null }> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) return this.props.fallback;
    return this.props.children;
  }
}
import { Globe } from './components/Globe';
import { InfoPanel } from './components/InfoPanel';
import { AdAuction } from './components/AdAuction';
import { useWebSocket } from './hooks/useWebSocket';
import type { VisitorInfo } from './types';
import './App.css';

export default function App() {
  const { connected, visitors, currentVisitor, aiLoading, aiCreditsExhausted, totalUniqueVisitors, revisitData } = useWebSocket();
  const [selectedVisitorId, setSelectedVisitorId] = useState<string | null>(null);

  // Get the selected visitor from the visitors array (always up-to-date)
  const selectedVisitor = useMemo(() => {
    if (!selectedVisitorId) return null;
    return visitors.find(v => v.id === selectedVisitorId) || null;
  }, [selectedVisitorId, visitors]);

  const handleVisitorClick = useCallback((visitor: VisitorInfo) => {
    // If clicking the same visitor, close the popup
    if (selectedVisitorId === visitor.id) {
      setSelectedVisitorId(null);
    } else {
      setSelectedVisitorId(visitor.id);
    }
  }, [selectedVisitorId]);

  const handleCloseSelected = useCallback(() => {
    setSelectedVisitorId(null);
  }, []);

  // Determine which visitor to show in the panel
  const displayedVisitor = selectedVisitor || currentVisitor;
  const isDisplayingCurrentUser = displayedVisitor?.id === currentVisitor?.id;

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="app-logo">
          <span className="logo-icon">◉</span>
          <h1>YourInfo</h1>
        </div>
        <div className="app-stats">
          <div className="stat">
            <span className="stat-value">{visitors.length}</span>
            <span className="stat-label">Online</span>
          </div>
          <div className="stat">
            <span className="stat-value">{totalUniqueVisitors.toLocaleString()}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className={`connection-status ${connected ? 'connected' : 'disconnected'}`}>
            <span className="status-dot" />
            {connected ? 'Live' : 'Connecting...'}
          </div>
        </div>
      </header>

      {/* AI Credits Exhausted Banner */}
      {aiCreditsExhausted && (
        <div className="ai-credits-banner">
          <span className="banner-icon">:(</span>
          <span className="banner-text">
            AI credits exhausted! Help bring back AI-powered insights with a small tip:
          </span>
          <a
            href="https://www.paypal.com/paypalme/hsiingh"
            target="_blank"
            rel="noopener noreferrer"
            className="banner-link"
          >
            Donate via PayPal
          </a>
        </div>
      )}

      {/* Left Panel - Ad Auction */}
      <aside className="left-panel">
        <AdAuction visitor={currentVisitor} />
      </aside>

      {/* Globe */}
      <div className="globe-container">
        <ErrorBoundary fallback={<div style={{ color: 'var(--text-muted)', padding: '2rem', fontFamily: 'var(--mono)', fontSize: '0.8rem', textAlign: 'center' }}>Globe unavailable</div>}>
          <Globe
            visitors={visitors}
            currentVisitorId={currentVisitor?.id || null}
            onVisitorClick={handleVisitorClick}
          />
        </ErrorBoundary>
      </div>

      {/* Right Panel - Info Panel */}
      <ErrorBoundary fallback={<div style={{ color: 'var(--text-muted)', padding: '2rem', fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>Panel unavailable</div>}>
        <InfoPanel
          visitor={displayedVisitor}
          isCurrentUser={isDisplayingCurrentUser ?? true}
          onClose={selectedVisitorId ? handleCloseSelected : undefined}
          aiLoading={aiLoading && isDisplayingCurrentUser}
          revisitData={isDisplayingCurrentUser ? revisitData : null}
        />
      </ErrorBoundary>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          This site demonstrates what information websites can collect about you.
          <a href="https://github.com/siinghd/yourinfo" target="_blank" rel="noopener noreferrer">
            View on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
