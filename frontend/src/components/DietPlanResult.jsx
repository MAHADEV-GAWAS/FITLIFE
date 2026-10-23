import React from 'react';

/**
 * DietPlanResult Component
 * Renders the full structured diet plan returned from the Java backend,
 * including metabolic numbers, macros, meal slots, allergen safety, and disclaimer.
 */
export default function DietPlanResult({ plan, onReset, onViewSavedPlans }) {
  if (!plan) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="results-wrapper">
      {/* Success banner indicating persistent SQLite storage */}
      <div className="alert alert-success">
        <div>
          <strong>Plan Saved Successfully in SQLite!</strong>
          <div style={{ fontSize: '0.82rem', marginTop: '3px' }}>
            Database Record ID: <strong>#{plan.id}</strong> &bull; User Profile ID: <strong>#{plan.userId}</strong> &bull; Created: {plan.createdAt || 'Just now'}
          </div>
        </div>
      </div>

      {/* Main Plan Header Card */}
      <div className="plan-header-card">
        <div className="plan-header-top">
          <div>
            <h2 className="plan-user-name">{plan.name}'s Transformation Plan</h2>
            <div className="plan-meta-row">
              <span className="badge badge-goal">{plan.goal}</span>
              <span className="badge badge-pref">{plan.dietPreference}</span>
              <span className="badge badge-saved">{plan.mealsPerDay} Meals / Day</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handlePrint}>
              &#128438; Print Plan
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={onReset}>
              + Create Another
            </button>
          </div>
        </div>

        {/* Metabolic Summary Cards */}
        <div className="metrics-grid">
          <div className="metric-box">
            <div className="metric-label">Target Daily Calories</div>
            <div className="metric-value metric-highlight">{plan.targetCalories}</div>
            <div className="metric-unit">kcal / day</div>
          </div>

          <div className="metric-box">
            <div className="metric-label">Estimated TDEE (Maintenance)</div>
            <div className="metric-value">{plan.tdee}</div>
            <div className="metric-unit">kcal / day</div>
          </div>

          <div className="metric-box">
            <div className="metric-label">Basal Metabolic Rate (BMR)</div>
            <div className="metric-value">{plan.bmr}</div>
            <div className="metric-unit">kcal / day</div>
          </div>

          <div className="metric-box">
            <div className="metric-label">Recommended Water</div>
            <div className="metric-value">{plan.hydrationLitres}</div>
            <div className="metric-unit">Litres / day</div>
          </div>
        </div>

        {/* Calorie Goal Summary Description */}
        {plan.calorieGoalSummary && (
          <div style={{ marginTop: '14px', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
            <strong>Strategy:</strong> {plan.calorieGoalSummary}
          </div>
        )}

        {/* Macronutrient Distribution Bar */}
        <div className="macro-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: '700' }}>
            <span>Target Macronutrient Distribution</span>
            <span>{plan.proteinGrams + plan.carbsGrams + plan.fatGrams}g Total Daily Macros</span>
          </div>

          <div className="macro-bar-wrapper">
            <div
              className="macro-bar-segment protein"
              style={{ width: `${plan.proteinPercentage || 30}%` }}
              title={`Protein: ${plan.proteinPercentage}%`}
            />
            <div
              className="macro-bar-segment carbs"
              style={{ width: `${plan.carbsPercentage || 40}%` }}
              title={`Carbohydrates: ${plan.carbsPercentage}%`}
            />
            <div
              className="macro-bar-segment fat"
              style={{ width: `${plan.fatPercentage || 30}%` }}
              title={`Healthy Fats: ${plan.fatPercentage}%`}
            />
          </div>

          <div className="macro-legend">
            <div className="legend-item">
              <span className="legend-dot protein" />
              <span><strong>Protein:</strong> {plan.proteinGrams}g ({plan.proteinPercentage}%)</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot carbs" />
              <span><strong>Carbs:</strong> {plan.carbsGrams}g ({plan.carbsPercentage}%)</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot fat" />
              <span><strong>Fats:</strong> {plan.fatGrams}g ({plan.fatPercentage}%)</span>
            </div>
          </div>
        </div>

        {/* Allergen & Dietary Safety Banner */}
        {plan.allergenNotes && plan.allergenNotes.length > 0 && (
          <div className="allergen-banner">
            <div className="allergen-title">&#9888; Allergen &amp; Restriction Adaptations</div>
            <ul className="allergen-list">
              {plan.allergenNotes.map((note, idx) => (
                <li key={idx}>&bull; {note}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Structured Meals Schedule */}
      <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '16px', color: '#ffffff' }}>
        Daily Meal Schedule ({plan.meals ? plan.meals.length : 0} Meals)
      </h3>

      <div className="meals-container">
        {plan.meals && plan.meals.map((meal, idx) => (
          <div key={idx} className="meal-card">
            <div className="meal-header">
              <div className="meal-name-row">
                <span className="meal-name">{meal.mealName}</span>
                <span className="meal-time">&#128344; {meal.timing}</span>
              </div>
              <div className="meal-cals-pill">
                ~{meal.estimatedCalories} kcal &bull; {meal.proteinGrams}g P | {meal.carbsGrams}g C | {meal.fatGrams}g F
              </div>
            </div>

            <p className="meal-description">{meal.description}</p>

            <ul className="meal-items-list">
              {meal.items && meal.items.map((item, itemIdx) => (
                <li key={itemIdx} className="meal-item">
                  <span className="item-check">&#10003;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {meal.tip && (
              <div className="meal-tip-box">
                <strong>Digestive Tip:</strong> {meal.tip}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* General Lifestyle & Nutrition Tips */}
      {plan.nutritionalTips && plan.nutritionalTips.length > 0 && (
        <div className="plan-header-card" style={{ marginTop: '24px' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '12px', color: '#ffffff' }}>
            Key Nutritional Guidelines
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {plan.nutritionalTips.map((tip, idx) => (
              <li key={idx} style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--primary)' }}>&bull;</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Educational & Medical Disclaimer */}
      <div className="disclaimer-card">
        <strong>Academic Notice:</strong> {plan.educationalDisclaimer || 'This plan is generated for educational demonstration purposes based on standard if-else rules. It does not replace advice from certified clinical nutritionists or doctors.'}
      </div>

      {/* Bottom Navigation Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <button type="button" className="btn btn-secondary" onClick={onReset}>
          &larr; Create Another Plan
        </button>
        <button type="button" className="btn btn-primary" onClick={onViewSavedPlans}>
          View All Saved Plans in Database &rarr;
        </button>
      </div>
    </div>
  );
}
