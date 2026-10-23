import React, { useState } from 'react';
import { checkBackendHealth, API_BASE_URL } from '../api/dietPlanApi.js';

/**
 * BackendStatusModal Component
 * Provides live diagnostic tools to check Spring Boot and SQLite health,
 * plus copy-pasteable terminal commands to launch the Java backend on macOS.
 */
export default function BackendStatusModal({ isOpen, onClose, backendStatus, onStatusUpdated }) {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const data = await checkBackendHealth();
      setTestResult({
        success: true,
        data
      });
      onStatusUpdated({
        online: true,
        checking: false,
        details: data
      });
    } catch (err) {
      setTestResult({
        success: false,
        error: err.message
      });
      onStatusUpdated({
        online: false,
        checking: false,
        details: null
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff' }}>
            Backend &amp; SQLite Connection Manager
          </h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          FitLife connects to the Java 21 Spring Boot REST API running locally on port <code>8080</code>.
        </p>

        {/* Current Target URL */}
        <div style={{ background: 'var(--bg-input)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: '600' }}>
            Configured Backend Endpoint
          </div>
          <div style={{ fontSize: '1.05rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)', marginTop: '4px' }}>
            {API_BASE_URL}
          </div>
        </div>

        {/* Test Ping Button */}
        <div style={{ marginBottom: '20px' }}>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleTestConnection}
            disabled={testing}
          >
            {testing ? 'Pinging /api/health...' : '&#9889; Ping Backend Now (GET /api/health)'}
          </button>
        </div>

        {/* Test Result Display */}
        {testResult && (
          <div className={`alert ${testResult.success ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: '20px' }}>
            {testResult.success ? (
              <div>
                <strong>&#10003; Spring Boot &amp; SQLite are Connected!</strong>
                <div style={{ fontSize: '0.82rem', marginTop: '4px' }}>
                  Application: {testResult.data.application}<br />
                  Database: {testResult.data.database}<br />
                  File: <code>{testResult.data.databasePath}</code><br />
                  File Exists: {testResult.data.databaseFileExists ? 'Yes (Active)' : 'Created on write'}
                </div>
              </div>
            ) : (
              <div>
                <strong>&#9888; Connection Failed:</strong>
                <div style={{ fontSize: '0.82rem', marginTop: '4px' }}>
                  {testResult.error}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Instructions to Start Java Backend on macOS */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>
            How to start the Spring Boot backend on macOS:
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Open Terminal on your Mac and run:
          </p>

          <div className="terminal-box">
{`# 1. Navigate to the backend folder
cd fitlife/backend

# 2. Run the Spring Boot application (Java 21 + Maven)
mvn spring-boot:run`}
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-subtle)', marginTop: '8px' }}>
            If Maven is not installed on your Mac, install it once with: <code>brew install maven openjdk@21</code>.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
