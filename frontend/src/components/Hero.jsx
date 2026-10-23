import React from 'react';

/**
 * Hero Component
 * Introduces the FitLife application, core purpose, and quick CTA buttons.
 */
export default function Hero({ onStartPlan, onViewPlans }) {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-badge">
          <span>College Capstone Project</span> &bull; <span>Java 21 Spring Boot + React</span>
        </div>

        <h1 className="hero-title">
          Personalized Diet <span>Transformation</span>
        </h1>

        <p className="hero-subtitle">
          Generate realistic, rule-based nutrition and meal schedules tailored to your body metrics,
          fitness targets, dietary preferences, and allergen restrictions. Powered by a transparent
          Spring Boot Java backend with local SQLite persistence.
        </p>

        <div className="hero-cta">
          <button type="button" className="btn btn-primary" onClick={onStartPlan}>
            Create Your Diet Plan &rarr;
          </button>
          <button type="button" className="btn btn-secondary" onClick={onViewPlans}>
            Browse Saved Plans
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-box">&#9878;</div>
            <h3 className="feature-title">Transparent Rule Engine</h3>
            <p className="feature-desc">
              Uses scientifically validated Mifflin-St Jeor BMR formulas and clear if-else logic.
              No black-box models or third-party AI dependencies.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box">&#129382;</div>
            <h3 className="feature-title">Allergen Protection</h3>
            <p className="feature-desc">
              Automatically filters out peanuts, dairy, gluten, eggs, and shellfish, substituting safe,
              nutrient-dense alternatives with explicit warnings.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box">&#128190;</div>
            <h3 className="feature-title">Local SQLite Storage</h3>
            <p className="feature-desc">
              Saves every submitted user profile and generated meal schedule persistently into a local
              <code>fitlife.db</code> file using Spring JDBC with zero cloud cost.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
