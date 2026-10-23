package com.fitlife.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements ApplicationRunner {

    private static final Logger logger =
            LoggerFactory.getLogger(DatabaseInitializer.class);

    private final JdbcTemplate jdbcTemplate;

    public DatabaseInitializer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(ApplicationArguments args) {
        logger.info("Initializing FitLife MySQL database...");

        try {
            String createUsersTableSql = """
                CREATE TABLE IF NOT EXISTS users (
                    id BIGINT PRIMARY KEY AUTO_INCREMENT,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    age INT NOT NULL,
                    gender VARCHAR(50),
                    height_cm DOUBLE NOT NULL,
                    current_weight_kg DOUBLE NOT NULL,
                    target_weight_kg DOUBLE NOT NULL,
                    goal VARCHAR(255) NOT NULL,
                    diet_preference VARCHAR(255) NOT NULL,
                    activity VARCHAR(255) NOT NULL,
                    allergies TEXT,
                    meals_per_day INT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB;
            """;

            jdbcTemplate.execute(createUsersTableSql);
            logger.info("Table 'users' verified / created.");

            String createDietPlansTableSql = """
                CREATE TABLE IF NOT EXISTS diet_plans (
                    id BIGINT PRIMARY KEY AUTO_INCREMENT,
                    user_id BIGINT NOT NULL,
                    plan_json LONGTEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    CONSTRAINT fk_diet_plans_users
                        FOREIGN KEY (user_id)
                        REFERENCES users(id)
                        ON DELETE CASCADE
                ) ENGINE=InnoDB;
            """;

            jdbcTemplate.execute(createDietPlansTableSql);
            logger.info("Table 'diet_plans' verified / created.");

            jdbcTemplate.execute("""
                CREATE INDEX idx_diet_plans_user_id
                ON diet_plans(user_id);
            """);

            logger.info("FitLife MySQL database initialized successfully.");

        } catch (Exception e) {
            logger.error("Failed to initialize FitLife MySQL database.", e);
            throw new RuntimeException("MySQL initialization failed", e);
        }
    }
}