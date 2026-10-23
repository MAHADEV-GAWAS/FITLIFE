# FitLife — Spring Boot REST API & SQLite Backend

Welcome to the backend component of **FitLife — Personalized Diet Transformation**.
This backend is designed with clean, readable code and transparent architecture suitable for college demonstrations and viva examinations.

---

## 1. Technologies Used

- **Language:** Java 21 (LTS)
- **Framework:** Spring Boot 3.3.4
- **Web Layer:** Spring Web (`@RestController`, Jackson JSON)
- **Data Access:** Spring JDBC (`JdbcTemplate`, parameterized SQL)
- **Validation:** Jakarta Validation (`@Valid`, `@NotBlank`, `@Email`, etc.)
- **Database:** SQLite 3 (`org.xerial:sqlite-jdbc`)
- **Build Tool:** Apache Maven

---

## 2. Architecture Overview

The backend uses a standard Layered Architecture:

```
[ HTTP Requests from React / Curl ]
                │
                ▼
      DietPlanController (REST API)
                │
        ┌───────┴────────────────────────┐
        ▼                                ▼
DietPlanGeneratorService        UserRepository & DietPlanRepository
 (Rule-based if-else engine)             (Spring JdbcTemplate)
                                                 │
                                                 ▼
                                     SQLite Database (fitlife.db)
```

1. **Controller Layer (`DietPlanController`):** Accepts HTTP requests, triggers validation, coordinates service and repository calls, and returns JSON responses with proper HTTP status codes.
2. **Service Layer (`DietPlanGeneratorService`):** Contains the business rules for BMR, TDEE, caloric targets, macro distributions, allergen filtering, and meal scheduling.
3. **Data Access Layer (`UserRepository`, `DietPlanRepository`):** Uses Spring `JdbcTemplate` with parameterized queries (`?`) to execute safe SQL against SQLite.
4. **Database (`fitlife.db`):** An embedded single-file SQLite database created automatically at backend startup in the project root.

---

## 3. Database Schema

On startup, `DatabaseInitializer` automatically executes:

### Table: `users`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique user profile ID |
| `name` | TEXT | NOT NULL | User's full name |
| `email` | TEXT | NOT NULL | User's email address |
| `age` | INTEGER | NOT NULL | Age (14–100) |
| `gender` | TEXT | NULLABLE | Male / Female / Other |
| `height_cm` | REAL | NOT NULL | Height in centimetres |
| `current_weight_kg` | REAL | NOT NULL | Current weight in kg |
| `target_weight_kg` | REAL | NOT NULL | Desired target weight in kg |
| `goal` | TEXT | NOT NULL | Lose Weight / Maintain Weight / Gain Weight |
| `diet_preference` | TEXT | NOT NULL | Vegetarian / Vegan / Eggetarian / Non-Vegetarian |
| `activity` | TEXT | NOT NULL | Sedentary / Lightly Active / Moderately Active / Very Active |
| `allergies` | TEXT | NULLABLE | Food restrictions (e.g. Peanuts, Dairy, Gluten) |
| `meals_per_day` | INTEGER | NOT NULL | 3, 4, 5, or 6 |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Timestamp of creation |

### Table: `diet_plans`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique plan ID |
| `user_id` | INTEGER | NOT NULL, FK -> users(id) | Foreign key pointing to `users.id` |
| `plan_json` | TEXT | NOT NULL | Full JSON payload of generated plan |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Timestamp of plan generation |

---

## 4. REST API Endpoints

### 4.1 Health Check
- **Method:** `GET`
- **Path:** `/api/health`
- **Description:** Checks server status and verifies SQLite connectivity.
- **Example Response (200 OK):**
```json
{
  "status": "UP",
  "application": "FitLife - Personalized Diet Transformation",
  "database": "SQLite",
  "databaseConnected": true,
  "databasePath": "/path/to/fitlife.db",
  "databaseFileExists": true,
  "serverTime": "2026-10-16T19:00:00Z"
}
```

### 4.2 Generate and Save Diet Plan
- **Method:** `POST`
- **Path:** `/api/diet-plans`
- **Headers:** `Content-Type: application/json`
- **Request Body Example:**
```json
{
  "name": "Aarav Sharma",
  "email": "aarav@example.com",
  "age": 22,
  "gender": "Male",
  "heightCm": 178.0,
  "currentWeightKg": 82.5,
  "targetWeightKg": 75.0,
  "goal": "Lose Weight",
  "dietPreference": "Vegetarian",
  "activity": "Moderately Active",
  "allergies": "Peanuts",
  "mealsPerDay": 4
}
```
- **Response (201 Created):** Returns the full generated plan with metabolic metrics, macros, meal slots, allergen notes, and SQLite record IDs (`id`, `userId`).

### 4.3 Get All Saved Plans
- **Method:** `GET`
- **Path:** `/api/diet-plans`
- **Description:** Returns list of all plans, newest first.

### 4.4 Get Single Plan by ID
- **Method:** `GET`
- **Path:** `/api/diet-plans/{id}`
- **Description:** Returns a single plan by ID. Returns 404 if not found.

### 4.5 Delete Plan by ID
- **Method:** `DELETE`
- **Path:** `/api/diet-plans/{id}`
- **Description:** Deletes the plan and its associated user profile. Returns 404 if not found.

---

## 5. Prerequisites & Running on macOS

### Step 1: Install Java 21 and Maven
Open Terminal on your Mac:
```bash
# Using Homebrew (recommended)
brew install openjdk@21 maven

# Verify installations
java -version
mvn -version
```

### Step 2: Navigate to backend folder
```bash
cd fitlife/backend
```

### Step 3: Run Spring Boot
```bash
mvn spring-boot:run
```

The server will start on port `8080`.
You will see console output:
```
FitLife Backend is RUNNING on http://localhost:8080
Table 'users' verified / created.
Table 'diet_plans' verified / created.
```

---

## 6. Testing with curl

### Test 1: Health check
```bash
curl -X GET http://localhost:8080/api/health
```

### Test 2: Create a plan
```bash
curl -X POST http://localhost:8080/api/diet-plans \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pooja Verma",
    "email": "pooja@example.com",
    "age": 21,
    "gender": "Female",
    "heightCm": 165.0,
    "currentWeightKg": 54.0,
    "targetWeightKg": 58.0,
    "goal": "Gain Weight",
    "dietPreference": "Vegan",
    "activity": "Lightly Active",
    "allergies": "None",
    "mealsPerDay": 5
  }'
```

### Test 3: List all plans
```bash
curl -X GET http://localhost:8080/api/diet-plans
```

### Test 4: Delete a plan (e.g. ID 1)
```bash
curl -X DELETE http://localhost:8080/api/diet-plans/1
```

---

## 7. How the Rule-Based Diet Generator Works

1. **BMR (Basal Metabolic Rate):** Uses Mifflin-St Jeor equation:
   - Male: `(10 * weight) + (6.25 * height) - (5 * age) + 5`
   - Female: `(10 * weight) + (6.25 * height) - (5 * age) - 161`
2. **TDEE (Total Daily Energy Expenditure):**
   - Sedentary: `BMR * 1.2`
   - Lightly Active: `BMR * 1.375`
   - Moderately Active: `BMR * 1.55`
   - Very Active: `BMR * 1.725`
3. **Caloric Adjustment:**
   - Lose Weight: 18% deficit with safe lower limits.
   - Gain Weight: 15% surplus.
   - Maintain Weight: Equal to TDEE.
4. **Macronutrient Split:**
   - Weight Loss: 30% Protein, 40% Carbs, 30% Fat
   - Weight Gain: 25% Protein, 50% Carbs, 25% Fat
   - Maintenance: 20% Protein, 55% Carbs, 25% Fat
5. **Allergen Exclusions:** Analyzes user input and replaces allergenic foods with safe alternatives (e.g. pumpkin seeds for peanuts; tofu for dairy/eggs; rice/quinoa for gluten).
