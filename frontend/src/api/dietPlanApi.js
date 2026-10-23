/**
 * FitLife API Client
 *
 * Uses the native Fetch API to communicate with the Spring Boot REST API.
 * Configured via VITE_API_BASE_URL (defaults to http://localhost:8080).
 */

const API_BASE_URL = (import.meta.env && import.meta.env.VITE_API_BASE_URL)
  ? import.meta.env.VITE_API_BASE_URL
  : 'http://localhost:8080';

export { API_BASE_URL };

/**
 * Helper to handle fetch errors cleanly.
 */
async function handleResponse(response) {
  if (!response.ok) {
    let errorData = null;
    try {
      errorData = await response.json();
    } catch (e) {
      // response was not JSON
    }

    const error = new Error(
      (errorData && errorData.message)
        ? errorData.message
        : `Request failed with HTTP status ${response.status} (${response.statusText})`
    );
    error.status = response.status;
    error.data = errorData;
    throw error;
  }
  return response.json();
}

/**
 * Checks Spring Boot and SQLite health.
 * GET /api/health
 */
export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return await handleResponse(response);
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Connection timed out while reaching Spring Boot backend at ' + API_BASE_URL);
    }
    if (err instanceof TypeError && err.message.includes('fetch')) {
      throw new Error('Cannot connect to Spring Boot backend at ' + API_BASE_URL + '. Is the server running?');
    }
    throw err;
  }
}

/**
 * Generates and saves a new diet plan.
 * POST /api/diet-plans
 */
export async function createDietPlan(formData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/diet-plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    return await handleResponse(response);
  } catch (err) {
    if (err instanceof TypeError && err.message.includes('fetch')) {
      throw new Error('Cannot connect to Spring Boot backend at ' + API_BASE_URL + '. Please check that the Java server is running on port 8080.');
    }
    throw err;
  }
}

/**
 * Fetches all saved diet plans.
 * GET /api/diet-plans
 */
export async function getAllDietPlans() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/diet-plans`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    return await handleResponse(response);
  } catch (err) {
    if (err instanceof TypeError && err.message.includes('fetch')) {
      throw new Error('Backend is unreachable. Please start the Spring Boot server.');
    }
    throw err;
  }
}

/**
 * Fetches a single diet plan by ID.
 * GET /api/diet-plans/{id}
 */
export async function getDietPlanById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/diet-plans/${id}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    return await handleResponse(response);
  } catch (err) {
    if (err instanceof TypeError && err.message.includes('fetch')) {
      throw new Error('Backend is unreachable. Please start the Spring Boot server.');
    }
    throw err;
  }
}

/**
 * Deletes a diet plan by ID and its associated user profile.
 * DELETE /api/diet-plans/{id}
 */
export async function deleteDietPlan(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/diet-plans/${id}`, {
      method: 'DELETE',
      headers: { 'Accept': 'application/json' }
    });
    return await handleResponse(response);
  } catch (err) {
    if (err instanceof TypeError && err.message.includes('fetch')) {
      throw new Error('Backend is unreachable. Please start the Spring Boot server.');
    }
    throw err;
  }
}
