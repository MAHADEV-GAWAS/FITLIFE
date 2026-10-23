package com.fitlife;

import com.fitlife.dto.DietPlanRequest;
import com.fitlife.dto.DietPlanResponse;
import com.fitlife.service.DietPlanGeneratorService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for DietPlanGeneratorService
 * Tests the rule-based calculation of BMR, TDEE, calories, macros, and allergen exclusion.
 */
public class DietPlanGeneratorServiceTest {

    private DietPlanGeneratorService generatorService;

    @BeforeEach
    void setUp() {
        generatorService = new DietPlanGeneratorService();
    }

    @Test
    @DisplayName("Should generate valid diet plan with caloric deficit for weight loss")
    void testWeightLossGeneration() {
        DietPlanRequest request = new DietPlanRequest();
        request.setName("Rahul Sharma");
        request.setEmail("rahul@example.com");
        request.setAge(22);
        request.setGender("Male");
        request.setHeightCm(175.0);
        request.setCurrentWeightKg(80.0);
        request.setTargetWeightKg(72.0);
        request.setGoal("Lose Weight");
        request.setDietPreference("Vegetarian");
        request.setActivity("Moderately Active");
        request.setAllergies("Peanuts");
        request.setMealsPerDay(4);

        DietPlanResponse response = generatorService.generatePlan(request);

        assertNotNull(response);
        assertEquals("Rahul Sharma", response.getName());
        assertTrue(response.getBmr() > 1500, "BMR should be calculated above 1500");
        assertTrue(response.getTdee() > response.getTargetCalories(), "Weight loss target should be below TDEE");
        assertEquals(4, response.getMeals().size(), "Should have 4 meals as requested");
        assertTrue(response.getAllergenNotes().get(0).toLowerCase().contains("nut"), "Should detect nut allergy");
        assertNotNull(response.getEducationalDisclaimer());
    }

    @Test
    @DisplayName("Should generate caloric surplus for weight gain")
    void testWeightGainGeneration() {
        DietPlanRequest request = new DietPlanRequest();
        request.setName("Priya Patel");
        request.setEmail("priya@example.com");
        request.setAge(20);
        request.setGender("Female");
        request.setHeightCm(162.0);
        request.setCurrentWeightKg(48.0);
        request.setTargetWeightKg(55.0);
        request.setGoal("Gain Weight");
        request.setDietPreference("Vegan");
        request.setActivity("Lightly Active");
        request.setAllergies("None");
        request.setMealsPerDay(5);

        DietPlanResponse response = generatorService.generatePlan(request);

        assertNotNull(response);
        assertTrue(response.getTargetCalories() > response.getTdee(), "Weight gain target should be above TDEE");
        assertEquals(5, response.getMeals().size());
    }
}
