import React, { useState } from 'react';

const VIVA_QUESTIONS = [
  {
    q: '1. What is the role of Spring Boot in this project?',
    a: 'Spring Boot acts as our standalone Java backend application framework. It provides an embedded Tomcat web server on port 8080, handles incoming HTTP REST requests, coordinates business logic in services, and provides dependency injection to cleanly wire together controllers, services, and repositories.'
  },
  {
    q: '2. Why did you choose Spring JDBC over Hibernate or Spring Data JPA?',
    a: 'Spring JDBC with JdbcTemplate provides explicit, transparent control over SQL queries without the heavy overhead, hidden lazy-loading traps, and complex entity configurations of full ORMs like Hibernate. For college projects and SQLite databases, Spring JDBC demonstrates fundamental database concepts like parameterized statements and row mapping clearly.'
  },
  {
    q: '3. Where and how does SQLite store data?',
    a: 'SQLite is a serverless, embedded database engine that stores all tables, indices, and records in a single local disk file (fitlife.db). Unlike MySQL or PostgreSQL, SQLite requires no background service or separate database server process, making it zero-configuration, portable, and reliable for local execution.'
  },
  {
    q: '4. What is the difference between BMR and TDEE in your calculations?',
    a: 'BMR (Basal Metabolic Rate) is the minimum energy required to keep vital organs functioning at complete physical rest, calculated using the Mifflin-St Jeor formula based on weight, height, age, and gender. TDEE (Total Daily Energy Expenditure) multiplies BMR by an activity factor (from 1.2 for sedentary up to 1.725 for very active) to estimate total daily calories burned.'
  },
  {
    q: '5. How does the if-else diet generator determine the target calories?',
    a: 'The generator applies a goal-oriented multiplier to the user\'s TDEE: For "Lose Weight", it creates an 18% caloric deficit while enforcing a minimum healthy safety floor (1250-1500 kcal). For "Gain Weight", it applies a 15% caloric surplus to support lean tissue hypertrophy. For "Maintain Weight", it matches TDEE.'
  },
  {
    q: '6. Why is validation implemented on BOTH React frontend and Spring Boot backend?',
    a: 'Client-side validation provides immediate, friendly visual feedback to the user before form submission. However, client-side validation can be bypassed by malicious actors or API testing tools like curl or Postman. Server-side validation using Jakarta Bean Validation (@NotBlank, @Min, @Email) is mandatory to guarantee database integrity and security.'
  },
  {
    q: '7. How do you prevent SQL Injection attacks?',
    a: 'We use Spring JdbcTemplate with parameterized queries (e.g., INSERT INTO users (...) VALUES (?, ?, ...)). User input values are passed as separate bind parameters to a PreparedStatement. The SQL engine never treats user inputs as executable SQL commands, completely neutralizing SQL injection vulnerabilities.'
  },
  {
    q: '8. What REST endpoints does your Spring Boot API expose?',
    a: 'We implemented 5 REST endpoints: GET /api/health (system status & SQLite connection), POST /api/diet-plans (validation, rule generation, persistence), GET /api/diet-plans (list all saved plans), GET /api/diet-plans/{id} (single plan retrieval), and DELETE /api/diet-plans/{id} (delete plan and associated profile).'
  },
  {
    q: '9. How does CORS work between React and Spring Boot?',
    a: 'Since the React frontend runs on port 5173 (or 3000) and the backend runs on port 8080, browsers enforce the Same-Origin Policy. We configured WebMvcConfigurer in CorsConfig.java to explicitly permit HTTP requests (GET, POST, DELETE, etc.) only from authorized local development origins.'
  },
  {
    q: '10. How are food allergies and dietary restrictions handled?',
    a: 'The service scans user-reported allergies against known allergens (nuts, peanuts, dairy, gluten, eggs, soy, shellfish). It actively substitutes safe ingredients (e.g. pumpkin seeds for peanuts; tofu or oat milk for dairy; quinoa/rice for gluten). If an unknown allergy is entered, an explicit safety warning is appended advising manual verification.'
  },
  {
    q: '11. What is the role of DTOs (Data Transfer Objects)?',
    a: 'DietPlanRequest and DietPlanResponse decouple our internal database models from the external API contract. This prevents over-posting attacks, allows custom validation annotations on incoming requests, and allows formatting calculated fields (BMR, macros, allergen notes) specifically for client rendering.'
  },
  {
    q: '12. What is the purpose of GlobalExceptionHandler with @RestControllerAdvice?',
    a: 'It acts as an interceptor for all exceptions thrown across any controller in the application. It catches MethodArgumentNotValidException and formats clean JSON error payloads containing exact field names and user-friendly error messages with proper HTTP 400 Bad Request status codes.'
  },
  {
    q: '13. How does foreign key cascading work in your SQLite tables?',
    a: 'In SQLite, we execute "PRAGMA foreign_keys = ON;". The diet_plans table declares "FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE". When a user or plan is deleted via the API, database constraints ensure referential integrity is preserved.'
  },
  {
    q: '14. Why did you use React functional components with hooks instead of class components?',
    a: 'React functional components with useState and useEffect are the modern standard in React development. They avoid complex "this" binding, keep state logic localized and readable, and enable clean side-effect management when fetching data from the backend.'
  },
  {
    q: '15. Is this diet plan considered certified medical advice?',
    a: 'No. The application explicitly includes an educational disclaimer stating that all recommendations are academic simulations based on general nutritional equations. It does not replace clinical consultation with licensed dietitians or medical doctors.'
  }
];

/**
 * AboutSection Component
 * Project description, architecture diagram, and college viva preparation guide.
 */
export default function AboutSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleQuestion = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="container" style={{ maxWidth: '960px', paddingBottom: '60px' }}>
      {/* College Project Overview */}
      <div className="section-header" style={{ textAlign: 'left', marginBottom: '28px' }}>
        <h2 className="section-title">Project Overview &amp; College Guide</h2>
        <p className="section-subtitle">
          Everything you need to demonstrate, explain, and defend FitLife in your college viva.
        </p>
      </div>

      {/* Architecture Overview Card */}
      <div className="plan-header-card" style={{ marginBottom: '28px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '12px', color: '#ffffff' }}>
          Layered System Architecture
        </h3>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          FitLife adheres strictly to a clean separation of concerns between presentation, business rules, and persistent storage:
        </p>

        <div className="terminal-box">
{`+-------------------------------------------------------------+
|                      REACT FRONTEND                         |
|   HTML5 + Semantic CSS3 + Vanilla Fetch API + React Hooks   |
|   (Runs on Vite development server at localhost:5173/3000)  |
+-------------------------------------------------------------+
                              |
                     HTTP JSON (REST API)
                     CORS Configured
                              v
+-------------------------------------------------------------+
|                JAVA 21 SPRING BOOT BACKEND                  |
|  DietPlanController (Exposes /api/health, /api/diet-plans)  |
|  DietPlanGeneratorService (Mifflin-St Jeor + Rules Engine)  |
|  UserRepository & DietPlanRepository (Spring JdbcTemplate)  |
|  GlobalExceptionHandler (@RestControllerAdvice validation)  |
+-------------------------------------------------------------+
                              |
               Spring JDBC Parameterized SQL
                              v
+-------------------------------------------------------------+
|                   SQLITE DATABASE (fitlife.db)              |
|  Table: users (user profiles, demographics, goals)          |
|  Table: diet_plans (persisted meal plans, foreign keys)     |
+-------------------------------------------------------------+`}
        </div>
      </div>

      {/* Tech Stack Summary Cards */}
      <div className="features-grid" style={{ marginBottom: '36px' }}>
        <div className="feature-card">
          <h4 style={{ color: 'var(--primary)', marginBottom: '6px' }}>Frontend</h4>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            <strong>React + Vite:</strong> Component-based UI with pure CSS3 variables. No external CSS frameworks or paid libraries.
          </p>
        </div>
        <div className="feature-card">
          <h4 style={{ color: 'var(--accent-blue)', marginBottom: '6px' }}>Backend</h4>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            <strong>Java 21 + Spring Boot 3:</strong> Layered architecture, Jakarta Bean Validation, Spring Web REST API, and Jackson JSON.
          </p>
        </div>
        <div className="feature-card">
          <h4 style={{ color: 'var(--accent-amber)', marginBottom: '6px' }}>Database</h4>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            <strong>SQLite + Spring JDBC:</strong> Embedded file-based storage in <code>fitlife.db</code> with parameterized queries for SQL injection safety.
          </p>
        </div>
      </div>

      {/* College Viva Questions Section */}
      <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '16px', color: '#ffffff' }}>
        College Viva &amp; Examination Questions (15 Key Questions)
      </h3>
      <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
        Click any question to view the comprehensive explanation you can present to your college evaluator:
      </p>

      <div>
        {VIVA_QUESTIONS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="viva-item">
              <button
                type="button"
                className="viva-question"
                onClick={() => toggleQuestion(idx)}
              >
                <span>{item.q}</span>
                <span style={{ color: 'var(--primary)', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              {isOpen && (
                <div className="viva-answer">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
