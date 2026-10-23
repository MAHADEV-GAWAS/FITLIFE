package com.fitlife.dto;

import java.util.List;

/**
 * MealSuggestion represents one meal block in a personalized diet plan.
 */
public class MealSuggestion {
    private String mealName;
    private String timing;
    private String description;
    private int estimatedCalories;
    private int proteinGrams;
    private int carbsGrams;
    private int fatGrams;
    private List<String> items;
    private String tip;

    public MealSuggestion() {
    }

    public MealSuggestion(String mealName, String timing, String description,
                          int estimatedCalories, int proteinGrams, int carbsGrams,
                          int fatGrams, List<String> items, String tip) {
        this.mealName = mealName;
        this.timing = timing;
        this.description = description;
        this.estimatedCalories = estimatedCalories;
        this.proteinGrams = proteinGrams;
        this.carbsGrams = carbsGrams;
        this.fatGrams = fatGrams;
        this.items = items;
        this.tip = tip;
    }

    public String getMealName() {
        return mealName;
    }

    public void setMealName(String mealName) {
        this.mealName = mealName;
    }

    public String getTiming() {
        return timing;
    }

    public void setTiming(String timing) {
        this.timing = timing;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getEstimatedCalories() {
        return estimatedCalories;
    }

    public void setEstimatedCalories(int estimatedCalories) {
        this.estimatedCalories = estimatedCalories;
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

    public List<String> getItems() {
        return items;
    }

    public void setItems(List<String> items) {
        this.items = items;
    }

    public String getTip() {
        return tip;
    }

    public void setTip(String tip) {
        this.tip = tip;
    }
}
