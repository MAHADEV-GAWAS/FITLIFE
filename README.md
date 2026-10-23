# FitLife — Personalized Diet Transformation
> **A Complete, Full-Stack College Capstone Project**
> Built with **Java 21**, **Spring Boot 3**, **Spring JDBC**, **SQLite**, and **React (Vite)**.

---

## 1. Project Overview

**FitLife** is a full-stack, personalized diet transformation application designed for academic demonstrations and college viva examinations. It bridges a modern, responsive React frontend with a robust Java 21 Spring Boot REST API backed by an embedded SQLite database (`fitlife.db`).

Instead of relying on opaque AI models or expensive third-party APIs, FitLife employs a **transparent, rule-based nutrition generator** using the scientifically recognized **Mifflin-St Jeor** formula and straightforward if-else decision trees.

### Key Capabilities
- **12 Validated Input Metrics:** Full name, email, age, gender, height (cm), current weight (kg), target weight (kg), fitness goal, dietary preference, physical activity level, food allergies/restrictions, and meals per day.
- **Metabolic Analysis:** Automatic calculation of Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE).
- **Goal-Driven Calorie Strategy:** Safe 18% caloric deficit for fat loss (with safety floor) or 15% surplus for lean muscle gain.
- **Macronutrient Distribution:** Custom protein, carbohydrate, and healthy fat targets with gram measurements and visual percentage bars.
- **Allergen Filtration & Substitution:** Automatically excludes peanuts, dairy, gluten, eggs, soy, and shellfish, substituting safe, nutrient-dense alternatives.
- **Persistent SQLite Storage:** Persists submitted user profiles in the `users` table and generated plans in the `diet_plans` table using Spring JDBC (`JdbcTemplate`).
- **Full CRUD Support:** Create plans, view all saved plans, open specific plans by ID, and delete plans with confirmation.
- **Academic Disclaimers:** Explicitly states that recommendations are for educational demonstration and not clinical medical advice.

---

## 2. Technology Stack & Rationale

| Layer | Technology | Why This Technology Was Chosen |
|---|---|---|
| **Frontend UI** | React 18 / Vite | Component-based, fast reload, modular, predictable state handling with hooks (`useState`, `useEffect`). |
| **Frontend Styling** | CSS3 (Custom Variables) | Modern dark charcoal & emerald green theme with accessible contrast and responsive grid. No heavy CSS framework required. |
| **Client-Server Comm** | Native Fetch API | Browser-native, lightweight, promise-based HTTP client requiring zero external npm networking libraries. |
| **Backend Language** | Java 21 (LTS) | Industry-standard language taught in computer science curricula; provides type safety, strong tooling, and high performance. |
| **Backend Framework** | Spring Boot 3.3.4 | Provides an embedded Tomcat server on port 8080, automatic bean configuration, and clean separation of concerns. |
| **Database Access** | Spring JDBC (`JdbcTemplate`) | Transparent SQL queries with parameterized PreparedStatement execution to completely prevent SQL injection attacks. |
| **Validation** | Jakarta Bean Validation | Enforces strict input validation on the server side (`@NotBlank`, `@Email`, `@Min`, `@Max`). |
| **Database** | SQLite 3 | Serverless, zero-configuration, single-file database (`fitlife.db`) ideal for local evaluation and college viva defense. |
| **Build Tool** | Apache Maven | Declarative dependency management and standard project lifecycle. |

---

## 3. System Architecture Diagram

```
+-------------------------------------------------------------------------+
|                           CLIENT TIER (BROWSER)                         |
|                                                                         |
|  [ React UI (Vite) on http://localhost:5173 or port 3000 ]              |
|   ├── Navbar.jsx (Status indicator, routing tabs)                       |
|   ├── Hero.jsx (Project introduction & workflow cards)                  |
|   ├── DietPlanForm.jsx (12 validated input fields + quick allergy chips)|
|   ├── DietPlanResult.jsx (BMR, TDEE, Macros bar, Meal cards, Disclaimer)|
|   ├── SavedPlansList.jsx (List, filter, view, and delete saved plans)   |
|   └── AboutSection.jsx (Architecture & 15 Viva Questions/Answers)       |
+-------------------------------------------------------------------------+
                                    │
                                    │ HTTP / JSON (REST API)
                                    │ CORS Allowed: 5173, 3000
                                    ▼
+-------------------------------------------------------------------------+
|                        APPLICATION TIER (JAVA)                          |
|                                                                         |
|  [ Spring Boot 3 REST API on http://localhost:8080 ]                    |
|   ├── DietPlanController.java                                           |
|   │     ├── GET    /api/health                                          |
|   │     ├── POST   /api/diet-plans                                      |
|   │     ├── GET    /api/diet-plans                                      |
|   │     ├── GET    /api/diet-plans/{id}                                 |
|   │     └── DELETE /api/diet-plans/{id}                                 |
|   ├── GlobalExceptionHandler.java (Formats 400/404/500 JSON responses)  |
|   ├── DietPlanGeneratorService.java (Mifflin-St Jeor rule engine)       |
|   └── UserRepository.java & DietPlanRepository.java (Spring JDBC)      |
+-------------------------------------------------------------------------+
                                    │
                                    │ Parameterized SQL (PreparedStatement)
                                    │ PRAGMA foreign_keys = ON;
                                    ▼
+-------------------------------------------------------------------------+
|                          DATABASE TIER (SQLITE)                         |
|                                                                         |
|  [ Local Database File: fitlife.db ]                                    |
|   ├── Table: users (Demographics, metrics, preferences, timestamps)     |
|   └── Table: diet_plans (Foreign key to users.id ON DELETE CASCADE)     |
+-------------------------------------------------------------------------+
```

---

## 4. Understanding Key Concepts (For First-Year Students)

### 4.1 What is an API Endpoint?
An **API (Application Programming Interface) endpoint** is a specific URL on the server where client applications (like our React frontend) send requests to perform actions or fetch data.
- For example, `POST /api/diet-plans` tells Spring Boot: *"Take the user profile data in the request body, generate a diet plan, save it, and return the result."*

### 4.2 How React Communicates with Spring Boot
When a user clicks **"Generate Personalized Plan"**:
1. React's `DietPlanForm` validates the form fields.
2. React calls `fetch('http://localhost:8080/api/diet-plans', { method: 'POST', body: JSON.stringify(formData) })`.
3. Spring Boot receives the JSON, validates it via `@Valid`, runs the rule engine, saves the data to SQLite, and returns HTTP status `201 Created` with the JSON plan.
4. React receives the JSON response via `await response.json()` and renders the `DietPlanResult` component.

### 4.3 What is Spring JDBC and Why Parameterized Queries?
Spring JDBC provides a helper class named `JdbcTemplate`. Instead of writing raw JDBC code with tedious `ResultSet` parsing and manual connection pooling, `JdbcTemplate` simplifies database calls while keeping SQL visible.
- **Parameterized queries** use question marks (`?`) as placeholders:
  ```java
  String sql = "INSERT INTO users (name, email) VALUES (?, ?)";
  jdbcTemplate.update(sql, user.getName(), user.getEmail());
  ```
  The database engine treats the parameters strictly as data, **never as executable SQL**. This prevents attackers from injecting harmful SQL commands (e.g. `' OR '1'='1`).

---

## 5. Database Schema

When the Spring Boot application boots up, `DatabaseInitializer.java` executes `schema.sql` automatically:

### 5.1 `users` Table
```sql
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT,
    height_cm REAL NOT NULL,
    current_weight_kg REAL NOT NULL,
    target_weight_kg REAL NOT NULL,
    goal TEXT NOT NULL,
    diet_preference TEXT NOT NULL,
    activity TEXT NOT NULL,
    allergies TEXT,
    meals_per_day INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 5.2 `diet_plans` Table
```sql
CREATE TABLE IF NOT EXISTS diet_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    plan_json TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Where is the database file stored?**
The database is created as `fitlife.db` in the working directory where the backend is started. You can inspect it using the SQLite CLI:
```bash
sqlite3 fitlife.db
sqlite> SELECT id, name, goal, current_weight_kg FROM users;
sqlite> SELECT id, user_id, created_at FROM diet_plans;
sqlite> .quit
```

---

## 6. How the Rule-Based Diet Generator Works

The generator in `DietPlanGeneratorService.java` executes the following transparent rules:

### Step 1: Basal Metabolic Rate (BMR)
Uses the clinical Mifflin-St Jeor formula:
- **Male:** `BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + 5`
- **Female:** `BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) - 161`
- **Other / Unspecified:** `BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) - 78`

### Step 2: Total Daily Energy Expenditure (TDEE)
Multiplies BMR by the physical activity multiplier:
- **Sedentary:** `TDEE = BMR × 1.200`
- **Lightly Active:** `TDEE = BMR × 1.375`
- **Moderately Active:** `TDEE = BMR × 1.550`
- **Very Active:** `TDEE = BMR × 1.725`

### Step 3: Caloric Adjustment
- **Lose Weight:** `Target = TDEE × 0.82` (18% deficit, with healthy minimum bounds: 1500 kcal for men, 1250 kcal for women).
- **Gain Weight:** `Target = TDEE × 1.15` (15% surplus for hypertrophy).
- **Maintain Weight:** `Target = TDEE`.

### Step 4: Macronutrient Breakdown
- **Lose Weight:** 30% Protein (4 kcal/g), 40% Carbs (4 kcal/g), 30% Healthy Fats (9 kcal/g).
- **Gain Weight:** 25% Protein, 50% Carbs, 25% Fats.
- **Maintain Weight:** 20% Protein, 50% Carbs, 30% Fats.

### Step 5: Allergen Exclusion & Substitution
Scans reported allergies against standard food allergens:
- **Peanuts / Tree Nuts:** Replaces peanut butter/nuts with pumpkin and sunflower seeds.
- **Dairy / Lactose:** Replaces cow's milk and paneer with fortified soy/oat milk and firm tofu.
- **Gluten / Wheat:** Replaces wheat rotis and whole wheat bread with gluten-free rolled oats, quinoa, brown rice, or millet.
- **Eggs:** Replaces scrambled eggs/omelettes with spiced tofu bhurji or chickpea chillas.
- **Soy:** Replaces tofu/edamame with lentils and chickpeas.
- **Shellfish / Seafood:** Replaces fish with lean chicken breast or legumes.
- **Custom Allergies:** Adds an explicit advisory to manually inspect ingredient labels.

### Step 6: Meal Schedule Distribution
Divides target calories and macros evenly across requested meals (3, 4, 5, or 6):
- 3 Meals: Breakfast (30%), Lunch (40%), Dinner (30%)
- 4 Meals: Breakfast (25%), Lunch (35%), Evening Snack (15%), Dinner (25%)
- 5 Meals: Breakfast (25%), Mid-Morning Snack (10%), Lunch (35%), Evening Snack (10%), Dinner (20%)
- 6 Meals: Breakfast (20%), Mid-Morning (10%), Lunch (30%), Afternoon (10%), Dinner (20%), Night Recovery (10%)

---

## 7. Run and Test Instructions (macOS Terminal)

Follow these exact steps on your Mac:

### Step 1: Install Prerequisites (Terminal)
```bash
# Check if Homebrew is installed
brew --version

# Install Java 21 and Maven
brew install openjdk@21 maven

# Verify versions
java -version
mvn -version
```

### Step 2: Start the Java Spring Boot Backend (Terminal Window 1)
```bash
cd fitlife/backend
mvn spring-boot:run
```
Expected output:
```
  FitLife Backend is RUNNING on http://localhost:8080
  Health check: http://localhost:8080/api/health
  Diet plans API: http://localhost:8080/api/diet-plans
  Table 'users' verified / created.
  Table 'diet_plans' verified / created.
```

### Step 3: Start the React Frontend (Terminal Window 2)
```bash
cd fitlife/frontend
npm install
npm run dev
```
Expected output:
```
  VITE v5.4.2  ready in 220 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 4: Open in Your Browser
Visit `http://localhost:5173` (or `http://localhost:3000` in AI Studio).
1. The **Status Pill** in the top right will turn green: **Spring Boot Online**.
2. Click **Create Diet Plan**.
3. Click the **⚡ Sample (Loss)** button to auto-fill the form with realistic test data.
4. Click **Generate Personalized Plan**.
5. Observe the calculated BMR, TDEE, macronutrient bar, and meal breakdown.
6. Refresh the page, navigate to **My Plans**, and verify that the plan remains stored from SQLite!

---

## 8. Testing the API with curl

You can test every endpoint directly from the macOS Terminal without opening the browser:

### Test 1: Health Check
```bash
curl -i -X GET http://localhost:8080/api/health
```
Expected HTTP status: `200 OK`.

### Test 2: Create a New Diet Plan
```bash
curl -i -X POST http://localhost:8080/api/diet-plans \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Kavita Rao",
    "email": "kavita@example.com",
    "age": 23,
    "gender": "Female",
    "heightCm": 168.0,
    "currentWeightKg": 65.0,
    "targetWeightKg": 59.0,
    "goal": "Lose Weight",
    "dietPreference": "Vegetarian",
    "activity": "Moderately Active",
    "allergies": "Dairy",
    "mealsPerDay": 4
  }'
```
Expected HTTP status: `201 Created`.

### Test 3: List All Saved Plans
```bash
curl -i -X GET http://localhost:8080/api/diet-plans
```

### Test 4: Retrieve Single Plan by ID
```bash
curl -i -X GET http://localhost:8080/api/diet-plans/1
```

### Test 5: Test Server-Side Validation (Invalid Age)
```bash
curl -i -X POST http://localhost:8080/api/diet-plans \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "invalid-email",
    "age": 10,
    "heightCm": 50,
    "currentWeightKg": 20,
    "targetWeightKg": 20,
    "goal": "Unknown",
    "dietPreference": "None",
    "activity": "None",
    "mealsPerDay": 8
  }'
```
Expected HTTP status: `400 Bad Request` with structured JSON error details.

### Test 6: Delete a Plan
```bash
curl -i -X DELETE http://localhost:8080/api/diet-plans/1
```
Expected HTTP status: `200 OK` with confirmation message.

---

## 9. Troubleshooting Common Issues

| Issue / Error | Cause | Solution |
|---|---|---|
| `Cannot connect to Spring Boot backend at http://localhost:8080` | The backend is not running or running on a different port. | Run `cd fitlife/backend && mvn spring-boot:run` in a separate terminal. |
| `Port 8080 is already in use` | Another program or previous Java process is bound to 8080. | Run `lsof -i :8080` then `kill -9 <PID>` to free the port. |
| `java: command not found` | Java is not installed or not in macOS PATH. | Run `brew install openjdk@21` and add it to your `.zshrc`. |
| `mvn: command not found` | Maven is not installed. | Run `brew install maven`. |
| `CORS Error in Browser Console` | Frontend origin is not permitted by backend. | Verify `CorsConfig.java` has your origin (e.g. `http://localhost:5173` or `http://localhost:3000`). |
| `SQLite Database Locked` | Multiple write operations opened simultaneous unclosed locks. | Spring Boot uses a single shared connection pool; restart the backend. |

---

## 10. College Viva Questions & Answers (Top 15)

1. **Q: What is Spring Boot?**
   *A:* Spring Boot is an opinionated, convention-over-configuration framework built on top of the Spring framework. It packages an embedded web server (Tomcat), manages dependency versions, and configures beans automatically so we can create production-ready microservices rapidly.

2. **Q: Why did you use Spring JDBC instead of Hibernate / JPA?**
   *A:* Spring JDBC with `JdbcTemplate` provides direct, transparent control over SQL queries with no hidden lazy-loading or entity-caching complexities. It is lightweight, beginner-friendly, and demonstrates fundamental relational database concepts like parameterized statements and row mapping.

3. **Q: Where is data saved, and how does SQLite differ from MySQL?**
   *A:* Data is saved locally in `fitlife.db`. MySQL requires a dedicated background database server process running on a network port, whereas SQLite is serverless and embedded directly inside the Java runtime via the `sqlite-jdbc` driver.

4. **Q: What is the difference between BMR and TDEE?**
   *A:* BMR (Basal Metabolic Rate) is the baseline energy expenditure needed to stay alive at rest. TDEE (Total Daily Energy Expenditure) multiplies BMR by physical activity multipliers (1.2 to 1.725) to account for daily movement and workouts.

5. **Q: How does the diet plan generator work without AI?**
   *A:* It uses deterministic, rule-based algorithmic programming with Mifflin-St Jeor formulas and if-else branches. Based on user inputs (goal, preference, allergies), it calculates caloric requirements and maps meals from a curated, allergen-safe ingredient registry.

6. **Q: Why perform validation on both frontend and backend?**
   *A:* Frontend validation improves UX by providing immediate feedback. Backend validation is mandatory for security because frontend checks can be bypassed by tools like curl, Postman, or disabled JavaScript.

7. **Q: How do you prevent SQL injection?**
   *A:* By using parameterized SQL queries with `JdbcTemplate`. Values are bound separately as parameters to a compiled PreparedStatement, ensuring they are treated solely as literal values and never as executable SQL.

8. **Q: What are the REST HTTP methods used?**
   *A:* `GET` for safe retrieval of data (health status, plans list, single plan), `POST` for creating new records and generating plans, and `DELETE` for removing saved records.

9. **Q: What is CORS and how is it handled?**
   *A:* Cross-Origin Resource Sharing is a browser security mechanism blocking requests between different ports/domains. We configured `CorsConfig.java` using `WebMvcConfigurer` to explicitly allow requests from our React Vite origin.

10. **Q: How are allergens handled safely?**
    *A:* The service checks the user's allergy string against known allergens and replaces offending items with safe substitutes (e.g. pumpkin seeds for peanuts, tofu for dairy). It also flags custom allergens with a disclaimer.

11. **Q: What is a DTO and why do you use it?**
    *A:* A Data Transfer Object encapsulates incoming and outgoing data, decoupling the internal database entity from the external HTTP API contract.

12. **Q: What is `@RestControllerAdvice`?**
    *A:* It is a global exception handling mechanism in Spring that intercepts exceptions thrown by `@RestController` classes and maps them to consistent JSON error bodies.

13. **Q: How does SQLite handle foreign key cascading?**
    *A:* By running `PRAGMA foreign_keys = ON;` at startup and setting `ON DELETE CASCADE` in the `diet_plans` table, deleting a user automatically removes all corresponding plan records.

14. **Q: Why use React hooks (`useState`, `useEffect`)?**
    *A:* Hooks allow functional components to manage local state and trigger lifecycle side-effects (like fetching data on mount) without the verbosity and complexity of class components.

15. **Q: Is this plan certified medical advice?**
    *A:* No. The system displays a prominent academic disclaimer stating that all figures are educational approximations and should not substitute for medical or dietitian consultations.

---

## 11. Project Directory Structure

```
fitlife/
├── backend/
│   ├── pom.xml
│   ├── mvnw
│   ├── .mvn/wrapper/maven-wrapper.properties
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/fitlife/
│   │   │   │   ├── FitLifeApplication.java
│   │   │   │   ├── config/
│   │   │   │   │   ├── CorsConfig.java
│   │   │   │   │   └── DatabaseInitializer.java
│   │   │   │   ├── controller/
│   │   │   │   │   ├── DietPlanController.java
│   │   │   │   │   └── GlobalExceptionHandler.java
│   │   │   │   ├── dto/
│   │   │   │   │   ├── DietPlanRequest.java
│   │   │   │   │   ├── DietPlanResponse.java
│   │   │   │   │   └── MealSuggestion.java
│   │   │   │   ├── model/
│   │   │   │   │   ├── DietPlan.java
│   │   │   │   │   └── User.java
│   │   │   │   ├── repository/
│   │   │   │   │   ├── DietPlanRepository.java
│   │   │   │   │   └── UserRepository.java
│   │   │   │   └── service/
│   │   │   │       └── DietPlanGeneratorService.java
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── schema.sql
│   │   └── test/
│   │       └── java/com/fitlife/
│   │           └── DietPlanGeneratorServiceTest.java
│   └── README.md
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── api/
│       │   └── dietPlanApi.js
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Hero.jsx
│       │   ├── WorkflowCards.jsx
│       │   ├── DietPlanForm.jsx
│       │   ├── DietPlanResult.jsx
│       │   ├── SavedPlansList.jsx
│       │   ├── AboutSection.jsx
│       │   └── BackendStatusModal.jsx
│       └── styles/
│           └── index.css
└── README.md
```
