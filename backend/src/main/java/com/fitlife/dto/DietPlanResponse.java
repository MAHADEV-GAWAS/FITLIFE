package com.fitlife.dto;

import java.util.List;

/**
 * DietPlanResponse represents the complete diet plan payload returned to the frontend.
 * It contains calculated metabolic metrics, macronutrient splits, meal breakdowns,
 * allergen handling details, and safety disclaimers.
 */
public class DietPlanResponse {
    private Long id;
    private Long userId;
    private String name;
    private String email;
    private Integer age;
    private String gender;
    private Double heightCm;
    private Double currentWeightKg;
    private Double targetWeightKg;
    private String goal;
    private String dietPreference;
    private String activity;
    private String allergies;
    private Integer mealsPerDay;

    // Metabolic calculations
    private int bmr;
    private int tdee;
    private int targetCalories;
    private String calorieGoalSummary;

    // Macronutrients
    private int proteinGrams;
    private int carbsGrams;
    private int fatGrams;
    private int proteinPercentage;
    private int carbsPercentage;
    private int fatPercentage;

    // Hydration & Safety
    private double hydrationLitres;
    private List<String> allergenNotes;
    private List<MealSuggestion> meals;
    private List<String> nutritionalTips;
    private String educationalDisclaimer;
    private String createdAt;

    public DietPlanResponse() {
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

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

    public int getBmr() {
        return bmr;
    }

    public void setBmr(int bmr) {
        this.bmr = bmr;
    }

    public int getTdee() {
        return tdee;
    }

    public void setTdee(int tdee) {
        this.tdee = tdee;
    }

    public int getTargetCalories() {
        return targetCalories;
    }

    public void setTargetCalories(int targetCalories) {
        this.targetCalories = targetCalories;
    }

    public String getCalorieGoalSummary() {
        return calorieGoalSummary;
    }

    public void setCalorieGoalSummary(String calorieGoalSummary) {
        this.calorieGoalSummary = calorieGoalSummary;
    }

    public int getProteinGrams() {
        return proteinGrams;
    }

    public void setProteinGrams(int proteinGrams) {
        this.proteinGrams = proteinGrams;
    }

    public int getCarbsGrams() {
        return carbsGrams;
    }

    public void setCarbsGrams(int carbsGrams) {
        this.carbsGrams = carbsGrams;
    }

    public int getFatGrams() {
        return fatGrams;
    }

    public void setFatGrams(int fatGrams) {
        this.fatGrams = fatGrams;
    }

    public int getProteinPercentage() {
        return proteinPercentage;
    }

    public void setProteinPercentage(int proteinPercentage) {
        this.proteinPercentage = proteinPercentage;
    }

    public int getCarbsPercentage() {
        return carbsPercentage;
    }

    public void setCarbsPercentage(int carbsPercentage) {
        this.carbsPercentage = carbsPercentage;
    }

    public int getFatPercentage() {
        return fatPercentage;
    }

    public void setFatPercentage(int fatPercentage) {
        this.fatPercentage = fatPercentage;
    }

    public double getHydrationLitres() {
        return hydrationLitres;
    }

    public void setHydrationLitres(double hydrationLitres) {
        this.hydrationLitres = hydrationLitres;
    }

    public List<String> getAllergenNotes() {
        return allergenNotes;
    }

    public void setAllergenNotes(List<String> allergenNotes) {
        this.allergenNotes = allergenNotes;
    }

    public List<MealSuggestion> getMeals() {
        return meals;
    }

    public void setMeals(List<MealSuggestion> meals) {
        this.meals = meals;
    }

    public List<String> getNutritionalTips() {
        return nutritionalTips;
    }

    public void setNutritionalTips(List<String> nutritionalTips) {
        this.nutritionalTips = nutritionalTips;
    }

    public String getEducationalDisclaimer() {
        return educationalDisclaimer;
    }

    public void setEducationalDisclaimer(String educationalDisclaimer) {
        this.educationalDisclaimer = educationalDisclaimer;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
