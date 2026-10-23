import React, { useState } from 'react';
import { createDietPlan } from '../api/dietPlanApi.js';

const INITIAL_FORM = {
  name: '',
  email: '',
  age: '',
  gender: 'Male',
  heightCm: '',
  currentWeightKg: '',
  targetWeightKg: '',
  goal: 'Lose Weight',
  dietPreference: 'Vegetarian',
  activity: 'Moderately Active',
  allergies: '',
  mealsPerDay: 4
};

const COMMON_ALLERGIES = [
  'Peanuts',
  'Dairy',
  'Gluten',
  'Eggs',
  'Soy',
  'Shellfish'
];

/**
 * DietPlanForm Component
 * Collects and validates the 12 required user profile parameters before dispatching
 * to the Spring Boot REST endpoint.
 */
export default function DietPlanForm({ onPlanGenerated, onOpenStatusModal }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  // Quick preset loader for college demonstration
  const handleLoadSample = (type = 'lose') => {
    if (type === 'lose') {
      setFormData({
        name: 'Rahul Sharma',
        email: 'rahul.sharma@example.com',
        age: 22,
        gender: 'Male',
        heightCm: 175,
        currentWeightKg: 82,
        targetWeightKg: 74,
        goal: 'Lose Weight',
        dietPreference: 'Vegetarian',
        activity: 'Moderately Active',
        allergies: 'Peanuts',
        mealsPerDay: 4
      });
    } else {
      setFormData({
        name: 'Ananya Roy',
        email: 'ananya.roy@example.com',
        age: 21,
        gender: 'Female',
        heightCm: 164,
        currentWeightKg: 49,
        targetWeightKg: 55,
        goal: 'Gain Weight',
        dietPreference: 'Vegan',
        activity: 'Lightly Active',
        allergies: 'Gluten',
        mealsPerDay: 5
      });
    }
    setErrors({});
    setServerError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear individual field error on change
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  // Toggle quick allergy chip
  const handleToggleAllergy = (allergy) => {
    const current = formData.allergies ? formData.allergies.split(',').map((s) => s.trim()).filter(Boolean) : [];
    let updated;
    if (current.includes(allergy)) {
      updated = current.filter((item) => item !== allergy);
    } else {
      updated = [...current, allergy];
    }
    setFormData((prev) => ({
      ...prev,
      allergies: updated.join(', ')
    }));
  };

  // Client-side validation before sending request to Java
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Full name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address (e.g. name@example.com).';
    }

    const ageNum = parseInt(formData.age, 10);
    if (!formData.age || isNaN(ageNum) || ageNum < 14 || ageNum > 100) {
      newErrors.age = 'Age must be between 14 and 100 years.';
    }

    const heightNum = parseFloat(formData.heightCm);
    if (!formData.heightCm || isNaN(heightNum) || heightNum < 80 || heightNum > 250) {
      newErrors.heightCm = 'Height must be between 80 cm and 250 cm.';
    }

    const weightNum = parseFloat(formData.currentWeightKg);
    if (!formData.currentWeightKg || isNaN(weightNum) || weightNum < 30 || weightNum > 300) {
      newErrors.currentWeightKg = 'Current weight must be between 30 kg and 300 kg.';
    }

    const targetNum = parseFloat(formData.targetWeightKg);
    if (!formData.targetWeightKg || isNaN(targetNum) || targetNum < 30 || targetNum > 300) {
      newErrors.targetWeightKg = 'Target weight must be between 30 kg and 300 kg.';
    }

    if (!formData.goal) {
      newErrors.goal = 'Please select a fitness goal.';
    }

    if (!formData.dietPreference) {
      newErrors.dietPreference = 'Please select a dietary preference.';
    }

    if (!formData.activity) {
      newErrors.activity = 'Please select your activity level.';
    }

    const mealsNum = parseInt(formData.mealsPerDay, 10);
    if (!formData.mealsPerDay || ![3, 4, 5, 6].includes(mealsNum)) {
      newErrors.mealsPerDay = 'Please choose 3, 4, 5, or 6 meals per day.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    // 1. Check client validation first
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Prepare payload formatted with correct numeric types
    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      age: parseInt(formData.age, 10),
      gender: formData.gender,
      heightCm: parseFloat(formData.heightCm),
      currentWeightKg: parseFloat(formData.currentWeightKg),
      targetWeightKg: parseFloat(formData.targetWeightKg),
      goal: formData.goal,
      dietPreference: formData.dietPreference,
      activity: formData.activity,
      allergies: formData.allergies ? formData.allergies.trim() : '',
      mealsPerDay: parseInt(formData.mealsPerDay, 10)
    };

    try {
      // 2. Dispatch to Java Spring Boot REST API
      const result = await createDietPlan(payload);
      // 3. Hand off generated result
      onPlanGenerated(result);
    } catch (err) {
      console.error('Diet plan submission error:', err);
      // If server returned structured field errors (e.g. 400 Bad Request)
      if (err.data && err.data.fieldErrors) {
        setErrors(err.data.fieldErrors);
        setServerError('Server validation failed on highlighted fields.');
      } else {
        setServerError(err.message || 'Failed to communicate with Spring Boot backend.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setErrors({});
    setServerError(null);
  };

  return (
    <div className="form-card">
      <div className="form-header">
        <div>
          <h2 className="form-title">Create Your Personalized Diet Plan</h2>
          <p className="form-subtitle">Fill in your physical metrics and lifestyle preferences.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleLoadSample('lose')}
            title="Load sample weight loss student profile"
          >
            &#9889; Sample (Loss)
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleLoadSample('gain')}
            title="Load sample weight gain student profile"
          >
            &#9889; Sample (Gain)
          </button>
        </div>
      </div>

      {serverError && (
        <div className="alert alert-error">
          <div>
            <strong>Error:</strong> {serverError}
            {serverError.includes('Cannot connect') && (
              <div style={{ marginTop: '8px' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={onOpenStatusModal}
                >
                  View Backend Setup &amp; Start Commands
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          {/* 1. Full Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              <span>Full Name <span className="required-star">*</span></span>
              <span className="label-hint">Student / Client name</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={`form-input ${errors.name ? 'input-error' : ''}`}
              placeholder="e.g. Rahul Sharma"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          {/* 2. Email Address */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              <span>Email Address <span className="required-star">*</span></span>
              <span className="label-hint">For plan record</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${errors.email ? 'input-error' : ''}`}
              placeholder="e.g. rahul@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          {/* 3. Age */}
          <div className="form-group">
            <label className="form-label" htmlFor="age">
              <span>Age (Years) <span className="required-star">*</span></span>
              <span className="label-hint">14 - 100</span>
            </label>
            <input
              type="number"
              id="age"
              name="age"
              min="14"
              max="100"
              className={`form-input ${errors.age ? 'input-error' : ''}`}
              placeholder="e.g. 21"
              value={formData.age}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.age && <span className="field-error">{errors.age}</span>}
          </div>

          {/* 4. Gender (Optional) */}
          <div className="form-group">
            <label className="form-label" htmlFor="gender">
              <span>Gender</span>
              <span className="label-hint">BMR offset</span>
            </label>
            <select
              id="gender"
              name="gender"
              className="form-select"
              value={formData.gender}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="Male">Male (+5 offset)</option>
              <option value="Female">Female (-161 offset)</option>
              <option value="Other">Other / Non-Binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          {/* 5. Height in cm */}
          <div className="form-group">
            <label className="form-label" htmlFor="heightCm">
              <span>Height (cm) <span className="required-star">*</span></span>
              <span className="label-hint">80 - 250 cm</span>
            </label>
            <input
              type="number"
              id="heightCm"
              name="heightCm"
              step="0.5"
              min="80"
              max="250"
              className={`form-input ${errors.heightCm ? 'input-error' : ''}`}
              placeholder="e.g. 175"
              value={formData.heightCm}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.heightCm && <span className="field-error">{errors.heightCm}</span>}
          </div>

          {/* 6. Current Weight in kg */}
          <div className="form-group">
            <label className="form-label" htmlFor="currentWeightKg">
              <span>Current Weight (kg) <span className="required-star">*</span></span>
              <span className="label-hint">30 - 300 kg</span>
            </label>
            <input
              type="number"
              id="currentWeightKg"
              name="currentWeightKg"
              step="0.1"
              min="30"
              max="300"
              className={`form-input ${errors.currentWeightKg ? 'input-error' : ''}`}
              placeholder="e.g. 78.5"
              value={formData.currentWeightKg}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.currentWeightKg && <span className="field-error">{errors.currentWeightKg}</span>}
          </div>

          {/* 7. Target Weight in kg */}
          <div className="form-group">
            <label className="form-label" htmlFor="targetWeightKg">
              <span>Target Weight (kg) <span className="required-star">*</span></span>
              <span className="label-hint">Desired target</span>
            </label>
            <input
              type="number"
              id="targetWeightKg"
              name="targetWeightKg"
              step="0.1"
              min="30"
              max="300"
              className={`form-input ${errors.targetWeightKg ? 'input-error' : ''}`}
              placeholder="e.g. 72.0"
              value={formData.targetWeightKg}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.targetWeightKg && <span className="field-error">{errors.targetWeightKg}</span>}
          </div>

          {/* 8. Fitness Goal */}
          <div className="form-group">
            <label className="form-label" htmlFor="goal">
              <span>Primary Goal <span className="required-star">*</span></span>
              <span className="label-hint">Controls calorie offset</span>
            </label>
            <select
              id="goal"
              name="goal"
              className={`form-select ${errors.goal ? 'input-error' : ''}`}
              value={formData.goal}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="Lose Weight">Lose Weight (18% Deficit)</option>
              <option value="Maintain Weight">Maintain Weight (TDEE Balance)</option>
              <option value="Gain Weight">Gain Weight (15% Surplus)</option>
            </select>
            {errors.goal && <span className="field-error">{errors.goal}</span>}
          </div>

          {/* 9. Dietary Preference */}
          <div className="form-group">
            <label className="form-label" htmlFor="dietPreference">
              <span>Dietary Preference <span className="required-star">*</span></span>
              <span className="label-hint">Meal category</span>
            </label>
            <select
              id="dietPreference"
              name="dietPreference"
              className={`form-select ${errors.dietPreference ? 'input-error' : ''}`}
              value={formData.dietPreference}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="Vegetarian">Vegetarian (Includes dairy, no meat/fish)</option>
              <option value="Vegan">Vegan (100% plant-based, no dairy/eggs)</option>
              <option value="Eggetarian">Eggetarian (Vegetarian + Eggs)</option>
              <option value="Non-Vegetarian">Non-Vegetarian (Chicken, Fish, Eggs)</option>
            </select>
            {errors.dietPreference && <span className="field-error">{errors.dietPreference}</span>}
          </div>

          {/* 10. Activity Level */}
          <div className="form-group">
            <label className="form-label" htmlFor="activity">
              <span>Daily Activity Level <span className="required-star">*</span></span>
              <span className="label-hint">TDEE multiplier</span>
            </label>
            <select
              id="activity"
              name="activity"
              className={`form-select ${errors.activity ? 'input-error' : ''}`}
              value={formData.activity}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="Sedentary">Sedentary (Desk job, little exercise x1.2)</option>
              <option value="Lightly Active">Lightly Active (1-3 workout days/wk x1.375)</option>
              <option value="Moderately Active">Moderately Active (3-5 workout days/wk x1.55)</option>
              <option value="Very Active">Very Active (6-7 intense workout days/wk x1.725)</option>
            </select>
            {errors.activity && <span className="field-error">{errors.activity}</span>}
          </div>

          {/* 11. Food Allergies & Restrictions */}
          <div className="form-group full-width">
            <label className="form-label" htmlFor="allergies">
              <span>Food Allergies or Restrictions</span>
              <span className="label-hint">Excluded from suggestions</span>
            </label>
            <input
              type="text"
              id="allergies"
              name="allergies"
              className="form-input"
              placeholder="e.g. Peanuts, Dairy, Gluten (or click quick chips below)"
              value={formData.allergies}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {/* Quick chips */}
            <div className="chips-container">
              {COMMON_ALLERGIES.map((allergy) => {
                const isSelected = formData.allergies
                  ? formData.allergies.toLowerCase().includes(allergy.toLowerCase())
                  : false;
                return (
                  <button
                    key={allergy}
                    type="button"
                    className={`allergy-chip ${isSelected ? 'active' : ''}`}
                    onClick={() => handleToggleAllergy(allergy)}
                  >
                    {isSelected ? '✓ ' : '+ '} {allergy}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 12. Meals Per Day */}
          <div className="form-group full-width">
            <label className="form-label" htmlFor="mealsPerDay">
              <span>Number of Meals Per Day <span className="required-star">*</span></span>
              <span className="label-hint">3, 4, 5, or 6 meals</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {[3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  className={`btn ${
                    parseInt(formData.mealsPerDay, 10) === num
                      ? 'btn-primary'
                      : 'btn-secondary'
                  }`}
                  style={{ padding: '10px 0' }}
                  onClick={() => setFormData((prev) => ({ ...prev, mealsPerDay: num }))}
                  disabled={isSubmitting}
                >
                  {num} Meals
                </button>
              ))}
            </div>
            {errors.mealsPerDay && <span className="field-error">{errors.mealsPerDay}</span>}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={isSubmitting}
          >
            Reset Form
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Generating Plan via Spring Boot...' : 'Generate Personalized Plan &rarr;'}
          </button>
        </div>
      </form>
    </div>
  );
}
