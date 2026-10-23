import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import WorkflowCards from './components/WorkflowCards.jsx';
import DietPlanForm from './components/DietPlanForm.jsx';
import DietPlanResult from './components/DietPlanResult.jsx';
import SavedPlansList from './components/SavedPlansList.jsx';
import AboutSection from './components/AboutSection.jsx';
import BackendStatusModal from './components/BackendStatusModal.jsx';
import { checkBackendHealth } from './api/dietPlanApi.js';

/**
 * FitLife Main Application Component
 */
export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentPlan, setCurrentPlan] = useState(null);
  const [backendStatus, setBackendStatus] = useState({
    online: false,
    checking: true,
    details: null
  });
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  // Check Spring Boot backend connectivity on mount
  useEffect(() => {
    let isMounted = true;

    async function verifyBackend() {
      try {
        const data = await checkBackendHealth();
        if (isMounted) {
          setBackendStatus({
            online: true,
            checking: false,
            details: data
          });
        }
      } catch (err) {
        if (isMounted) {
          setBackendStatus({
            online: false,
            checking: false,
            details: null
          });
        }
      }
    }

    verifyBackend();

    // Check periodically every 15 seconds
    const interval = setInterval(verifyBackend, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handlePlanGenerated = (plan) => {
    setCurrentPlan(plan);
    setActiveTab('create');
  };

  const handleSelectSavedPlan = (plan) => {
    setCurrentPlan(plan);
    setActiveTab('plans');
  };

  const handleResetPlan = () => {
    setCurrentPlan(null);
    setActiveTab('create');
  };

  const handleViewSavedPlans = () => {
    setCurrentPlan(null);
    setActiveTab('plans');
  };

  return (
    <div className="app-layout">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'home' || tab === 'about') {
            setCurrentPlan(null);
          }
        }}
        backendStatus={backendStatus}
        onOpenStatusModal={() => setIsStatusModalOpen(true)}
      />

      {/* Main Content Area */}
      <main style={{ minHeight: 'calc(100vh - 160px)', paddingTop: '20px' }}>
        {activeTab === 'home' && (
          <>
            <Hero
              onStartPlan={() => setActiveTab('create')}
              onViewPlans={() => setActiveTab('plans')}
            />
            <WorkflowCards />
          </>
        )}

        {activeTab === 'create' && (
          <div className="container">
            {currentPlan ? (
              <DietPlanResult
                plan={currentPlan}
                onReset={handleResetPlan}
                onViewSavedPlans={handleViewSavedPlans}
              />
            ) : (
              <DietPlanForm
                onPlanGenerated={handlePlanGenerated}
                onOpenStatusModal={() => setIsStatusModalOpen(true)}
              />
            )}
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="container">
            {currentPlan ? (
              <DietPlanResult
                plan={currentPlan}
                onReset={handleResetPlan}
                onViewSavedPlans={() => setCurrentPlan(null)}
              />
            ) : (
              <SavedPlansList
                onSelectPlan={handleSelectSavedPlan}
                onStartNewPlan={() => {
                  setCurrentPlan(null);
                  setActiveTab('create');
                }}
                onOpenStatusModal={() => setIsStatusModalOpen(true)}
              />
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <AboutSection />
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>
            <strong>FitLife &mdash; Personalized Diet Transformation</strong> &bull; College Capstone Project
          </p>
          <p style={{ marginTop: '4px', color: 'var(--text-subtle)' }}>
            Built with Java 21 Spring Boot, Spring JDBC, SQLite (<code>fitlife.db</code>), and React.
            Educational demonstration only &mdash; Not certified medical advice.
          </p>
        </div>
      </footer>

      {/* Status & Diagnostic Modal */}
      <BackendStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        backendStatus={backendStatus}
        onStatusUpdated={setBackendStatus}
      />
    </div>
  );
}
