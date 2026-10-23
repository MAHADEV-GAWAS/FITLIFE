-- FitLife MySQL Database Schema
-- Database: fitlife

CREATE DATABASE IF NOT EXISTS fitlife;
USE fitlife;

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

CREATE INDEX idx_diet_plans_user_id
    ON diet_plans(user_id);