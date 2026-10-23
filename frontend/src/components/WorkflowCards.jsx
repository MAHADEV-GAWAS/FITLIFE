import React from 'react';

/**
 * WorkflowCards Component
 * Shows how user profile inputs move through Java rule evaluation into a structured diet schedule.
 */
export default function WorkflowCards() {
  return (
    <section className="workflow-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">How FitLife Works</h2>
          <p className="section-subtitle">
            A simple 3-stage pipeline connecting your browser directly to the Java REST API.
          </p>
        </div>

        <div className="workflow-steps">
          <div className="step-card">
            <span className="step-number">01</span>
            <div className="feature-icon-box">&#128221;</div>
            <h3 className="step-title">Enter Body Metrics</h3>
            <p className="step-desc">
              Provide your height, current and target weight, age, activity level, and diet preference.
              Validated thoroughly on both frontend and Spring Boot server.
            </p>
          </div>

          <div className="step-card">
            <span className="step-number">02</span>
            <div className="feature-icon-box">&#9881;</div>
            <h3 className="step-title">Spring Boot Rule Engine</h3>
            <p className="step-desc">
              Java calculates BMR and TDEE, applies safe caloric adjustment (deficit for weight loss,
              surplus for gain), and filters meal items against your reported allergies.
            </p>
          </div>

          <div className="step-card">
            <span className="step-number">03</span>
            <div className="feature-icon-box">&#127822;</div>
            <h3 className="step-title">Persistent SQLite Plan</h3>
            <p className="step-desc">
              Your profile is stored in the <code>users</code> table, and your custom meal plan is
              saved in the <code>diet_plans</code> table. You can inspect or delete it anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
