package com.fitlife.model;

/**
 * DietPlan model representing a record in the 'diet_plans' SQLite table.
 */
public class DietPlan {
    private Long id;
    private Long userId;
    private String planJson;
    private String createdAt;

    public DietPlan() {
    }

    public DietPlan(Long id, Long userId, String planJson, String createdAt) {
        this.id = id;
        this.userId = userId;
        this.planJson = planJson;
        this.createdAt = createdAt;
    }

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

    public String getPlanJson() {
        return planJson;
    }

    public void setPlanJson(String planJson) {
        this.planJson = planJson;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
