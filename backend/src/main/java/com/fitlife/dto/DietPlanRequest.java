package com.fitlife.dto;

import jakarta.validation.constraints.*;

/**
 * DietPlanRequest contains user input submitted from the frontend form.
 * Includes server-side validation to ensure clean, reliable data.
 */
public class DietPlanRequest {

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Email address is required")
    @Email(message = "Please provide a valid email address (e.g. user@example.com)")
    private String email;

    @NotNull(message = "Age is required")
    @Min(value = 14, message = "Age must be at least 14 years")
    @Max(value = 100, message = "Age must be under 100 years")
    private Integer age;

    // Optional gender field
    private String gender;

    @NotNull(message = "Height is required")
    @DecimalMin(value = "80.0", message = "Height must be at least 80 cm")
    @DecimalMax(value = "250.0", message = "Height must be under 250 cm")
    private Double heightCm;

    @NotNull(message = "Current weight is required")
    @DecimalMin(value = "30.0", message = "Current weight must be at least 30 kg")
    @DecimalMax(value = "300.0", message = "Current weight must be under 300 kg")
    private Double currentWeightKg;

    @NotNull(message = "Target weight is required")
    @DecimalMin(value = "30.0", message = "Target weight must be at least 30 kg")
    @DecimalMax(value = "300.0", message = "Target weight must be under 300 kg")
    private Double targetWeightKg;

    @NotBlank(message = "Goal is required")
    @Pattern(regexp = "^(Lose Weight|Maintain Weight|Gain Weight)$",
            message = "Goal must be 'Lose Weight', 'Maintain Weight', or 'Gain Weight'")
    private String goal;

    @NotBlank(message = "Diet preference is required")
    @Pattern(regexp = "^(Vegetarian|Vegan|Eggetarian|Non-Vegetarian)$",
            message = "Diet preference must be 'Vegetarian', 'Vegan', 'Eggetarian', or 'Non-Vegetarian'")
    private String dietPreference;

    @NotBlank(message = "Activity level is required")
    @Pattern(regexp = "^(Sedentary|Lightly Active|Moderately Active|Very Active)$",
            message = "Activity level must be 'Sedentary', 'Lightly Active', 'Moderately Active', or 'Very Active'")
    private String activity;

    // Optional allergies or restrictions
    private String allergies;

    @NotNull(message = "Meals per day is required")
    @Min(value = 3, message = "Meals per day must be at least 3")
    @Max(value = 6, message = "Meals per day must be at most 6")
    private Integer mealsPerDay;

    public DietPlanRequest() {
    }

    // Helper to sanitize inputs
    public void sanitize() {
        if (this.name != null) this.name = this.name.trim();
        if (this.email != null) this.email = this.email.trim().toLowerCase();
        if (this.gender != null) this.gender = this.gender.trim();
        if (this.goal != null) this.goal = this.goal.trim();
        if (this.dietPreference != null) this.dietPreference = this.dietPreference.trim();
        if (this.activity != null) this.activity = this.activity.trim();
        if (this.allergies != null) this.allergies = this.allergies.trim();
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Double getHeightCm() {
        return heightCm;
    }

    public void setHeightCm(Double heightCm) {
        this.heightCm = heightCm;
    }

    public Double getCurrentWeightKg() {
        return currentWeightKg;
    }

    public void setCurrentWeightKg(Double currentWeightKg) {
        this.currentWeightKg = currentWeightKg;
    }

    public Double getTargetWeightKg() {
        return targetWeightKg;
    }

    public void setTargetWeightKg(Double targetWeightKg) {
        this.targetWeightKg = targetWeightKg;
    }

    public String getGoal() {
        return goal;
    }

    public void setGoal(String goal) {
        this.goal = goal;
    }

    public String getDietPreference() {
        return dietPreference;
    }

    public void setDietPreference(String dietPreference) {
        this.dietPreference = dietPreference;
    }

    public String getActivity() {
        return activity;
    }

    public void setActivity(String activity) {
        this.activity = activity;
    }

    public String getAllergies() {
        return allergies;
    }

    public void setAllergies(String allergies) {
        this.allergies = allergies;
    }

    public Integer getMealsPerDay() {
        return mealsPerDay;
    }

    public void setMealsPerDay(Integer mealsPerDay) {
        this.mealsPerDay = mealsPerDay;
    }
}
