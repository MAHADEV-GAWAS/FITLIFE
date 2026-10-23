import React, { useState, useEffect } from 'react';
import { getAllDietPlans, getDietPlanById, deleteDietPlan } from '../api/dietPlanApi.js';

/**
 * SavedPlansList Component
 * Retrieves and manages saved diet plans from the SQLite database via Spring Boot.
 */
export default function SavedPlansList({ onSelectPlan, onStartNewPlan, onOpenStatusModal }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllDietPlans();
      setPlans(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load saved plans:', err);
      setError(err.message || 'Could not connect to Spring Boot backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleOpenPlan = async (id) => {
    try {
      const fullPlan = await getDietPlanById(id);
      onSelectPlan(fullPlan);
    } catch (err) {
      alert('Failed to load plan #' + id + ': ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    setIsDeleting(true);
    try {
      await deleteDietPlan(id);
      setSuccessMessage(`Plan #${id} deleted from SQLite database.`);
      setDeleteConfirmId(null);
      // Refresh list
      fetchPlans();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      alert('Delete failed: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredPlans = plans.filter((p) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (p.name && p.name.toLowerCase().includes(term)) ||
      (p.email && p.email.toLowerCase().includes(term)) ||
      (p.goal && p.goal.toLowerCase().includes(term))
    );
  });

  return (
    <div className="saved-plans-container">
      <div className="section-header" style={{ textAlign: 'left', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h2 className="section-title">Saved Diet Plans</h2>
            <p className="section-subtitle">
              Stored persistently in SQLite (<code>fitlife.db</code>).
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={fetchPlans}
              disabled={loading}
            >
              &#8635; Refresh
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onStartNewPlan}
            >
              + Create New Plan
            </button>
          </div>
        </div>

        {/* Search Filter */}
        <div style={{ marginTop: '16px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search saved plans by user name, email, or goal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {successMessage && (
        <div className="alert alert-success">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <div>
            <strong>Backend Unavailable:</strong> {error}
            <div style={{ marginTop: '8px' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={onOpenStatusModal}
              >
                Inspect Connection Details
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="empty-state">
          <div className="empty-icon">&#8987;</div>
          <h3 className="empty-title">Loading Saved Plans...</h3>
          <p className="empty-desc">Querying SQLite database via Spring JDBC Template...</p>
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">&#128194;</div>
          <h3 className="empty-title">No Saved Diet Plans Found</h3>
          <p className="empty-desc">
            {searchTerm
              ? `No plans matching "${searchTerm}". Try a different search term.`
              : 'Your database currently has no saved profiles. Create a test profile to see it stored persistently.'}
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onStartNewPlan}
          >
            Create Your First Plan
          </button>
        </div>
      ) : (
        <div>
          {filteredPlans.map((plan) => (
            <div key={plan.id} className="saved-card">
              <div className="saved-info-main">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="saved-user-name">{plan.name}</span>
                  <span className="badge badge-saved">Plan #{plan.id}</span>
                  <span className="badge badge-goal">{plan.goal}</span>
                  <span className="badge badge-pref">{plan.dietPreference}</span>
                </div>
                <div className="saved-user-sub">
                  <span>{plan.email}</span> &bull;{' '}
                  <span>Weight: {plan.currentWeightKg}kg &rarr; {plan.targetWeightKg}kg</span> &bull;{' '}
                  {plan.targetCalories && <span><strong>{plan.targetCalories} kcal</strong> &bull; </span>}
                  <span>Saved: {plan.createdAt || 'N/A'}</span>
                </div>
              </div>

              <div className="saved-actions">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleOpenPlan(plan.id)}
                >
                  View Full Plan &rarr;
                </button>

                {deleteConfirmId === plan.id ? (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(plan.id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Confirm'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setDeleteConfirmId(null)}
                      disabled={isDeleting}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => setDeleteConfirmId(plan.id)}
                    title="Delete plan and user record from database"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
