package com.fitlife.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitlife.dto.DietPlanRequest;
import com.fitlife.dto.DietPlanResponse;
import com.fitlife.model.DietPlan;
import com.fitlife.model.User;
import com.fitlife.repository.DietPlanRepository;
import com.fitlife.repository.UserRepository;
import com.fitlife.service.DietPlanGeneratorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/api")
public class DietPlanController {

    private final DietPlanGeneratorService generatorService;
    private final UserRepository userRepository;
    private final DietPlanRepository dietPlanRepository;
    private final ObjectMapper objectMapper;
    private final JdbcTemplate jdbcTemplate;

    public DietPlanController(
            DietPlanGeneratorService generatorService,
            UserRepository userRepository,
            DietPlanRepository dietPlanRepository,
            ObjectMapper objectMapper,
            JdbcTemplate jdbcTemplate) {

        this.generatorService = generatorService;
        this.userRepository = userRepository;
        this.dietPlanRepository = dietPlanRepository;
        this.objectMapper = objectMapper;
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * GET /api/health
     * Checks backend status and actual MySQL database connectivity.
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getHealth() {
        Map<String, Object> response = new LinkedHashMap<>();

        response.put("application",
                "FitLife - Personalized Diet Transformation");
        response.put("database", "MySQL");

        try {
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);

            response.put("status", "UP");
            response.put("databaseConnected", true);
            response.put("serverTime", Instant.now().toString());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "DOWN");
            response.put("databaseConnected", false);
            response.put("databaseError", e.getMessage());

            return ResponseEntity
                    .status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(response);
        }
    }

    /**
     * POST /api/diet-plans
     * Generates a personalized diet plan and saves the profile and plan to MySQL.
     */
    @PostMapping("/diet-plans")
    public ResponseEntity<DietPlanResponse> createDietPlan(
            @Valid @RequestBody DietPlanRequest request) {

        DietPlanResponse planResponse =
                generatorService.generatePlan(request);

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setAge(request.getAge());
        user.setGender(request.getGender());
        user.setHeightCm(request.getHeightCm());
        user.setCurrentWeightKg(request.getCurrentWeightKg());
        user.setTargetWeightKg(request.getTargetWeightKg());
        user.setGoal(request.getGoal());
        user.setDietPreference(request.getDietPreference());
        user.setActivity(request.getActivity());
        user.setAllergies(request.getAllergies());
        user.setMealsPerDay(request.getMealsPerDay());

        Long userId = userRepository.save(user);

        String planJson;
        try {
            planJson = objectMapper.writeValueAsString(planResponse);
        } catch (JsonProcessingException e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to serialize diet plan data",
                    e);
        }

        Long planId = dietPlanRepository.save(userId, planJson);

        planResponse.setId(planId);
        planResponse.setUserId(userId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(planResponse);
    }

    /**
     * GET /api/diet-plans
     * Returns all saved diet plans, newest first.
     */
    @GetMapping("/diet-plans")
    public ResponseEntity<List<Map<String, Object>>> getAllDietPlans() {

        List<Map<String, Object>> rawRows =
                dietPlanRepository.findAllWithUserDetails();

        List<Map<String, Object>> resultList = new ArrayList<>();

        for (Map<String, Object> row : rawRows) {
            Map<String, Object> item = new LinkedHashMap<>();

            Long planId = ((Number) row.get("plan_id")).longValue();
            Long userId = ((Number) row.get("user_id")).longValue();
            String planJson = (String) row.get("plan_json");

            item.put("id", planId);
            item.put("userId", userId);
            item.put("name", row.get("user_name"));
            item.put("email", row.get("user_email"));
            item.put("goal", row.get("user_goal"));
            item.put("dietPreference", row.get("user_diet_preference"));
            item.put("currentWeightKg", row.get("current_weight_kg"));
            item.put("targetWeightKg", row.get("target_weight_kg"));
            item.put("mealsPerDay", row.get("meals_per_day"));
            item.put("createdAt", row.get("plan_created_at"));

            try {
                DietPlanResponse parsed =
                        objectMapper.readValue(
                                planJson, DietPlanResponse.class);

                item.put("targetCalories", parsed.getTargetCalories());
                item.put("proteinGrams", parsed.getProteinGrams());
                item.put("carbsGrams", parsed.getCarbsGrams());
                item.put("fatGrams", parsed.getFatGrams());
                item.put("tdee", parsed.getTdee());
                item.put("bmr", parsed.getBmr());

            } catch (Exception ignored) {
                // Ignore JSON parsing errors in the list preview.
            }

            resultList.add(item);
        }

        return ResponseEntity.ok(resultList);
    }

    /**
     * GET /api/diet-plans/{id}
     * Returns a saved diet plan by ID.
     */
    @GetMapping("/diet-plans/{id}")
    public ResponseEntity<DietPlanResponse> getDietPlanById(
            @PathVariable Long id) {

        DietPlan plan = dietPlanRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Diet plan with ID " + id + " was not found."));

        try {
            DietPlanResponse response =
                    objectMapper.readValue(
                            plan.getPlanJson(), DietPlanResponse.class);

            response.setId(plan.getId());
            response.setUserId(plan.getUserId());
            response.setCreatedAt(plan.getCreatedAt());

            return ResponseEntity.ok(response);

        } catch (JsonProcessingException e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error parsing diet plan stored JSON",
                    e);
        }
    }

    /**
     * DELETE /api/diet-plans/{id}
     * Deletes a diet plan and its associated user profile.
     */
    @DeleteMapping("/diet-plans/{id}")
    public ResponseEntity<Map<String, Object>> deleteDietPlan(
            @PathVariable Long id) {

        boolean deleted = dietPlanRepository.deleteById(id);

        if (!deleted) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Diet plan with ID " + id + " does not exist.");
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("message",
                "Diet plan #" + id
                        + " and its associated user profile were successfully deleted.");
        response.put("deletedId", id);

        return ResponseEntity.ok(response);
    }
}