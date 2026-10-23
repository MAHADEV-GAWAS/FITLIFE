package com.fitlife;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * FitLife - Personalized Diet Transformation
 * Main Spring Boot Application Entry Point
 *
 * This class boots the embedded Tomcat server on port 8080,
 * loads the Spring Application Context, and initializes Spring JDBC and REST controllers.
 */
@SpringBootApplication
public class FitLifeApplication {

    public static void main(String[] args) {
        SpringApplication.run(FitLifeApplication.class, args);
        System.out.println("==========================================================");
        System.out.println("  FitLife Backend is RUNNING on http://localhost:8080");
        System.out.println("  Health check: http://localhost:8080/api/health");
        System.out.println("  Diet plans API: http://localhost:8080/api/diet-plans");
        System.out.println("==========================================================");
    }
}
