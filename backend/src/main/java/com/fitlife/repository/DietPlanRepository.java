package com.fitlife.repository;

import com.fitlife.model.DietPlan;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class DietPlanRepository {

    private final JdbcTemplate jdbcTemplate;

    public DietPlanRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<DietPlan> dietPlanRowMapper = (rs, rowNum) -> {
        DietPlan plan = new DietPlan();
        plan.setId(rs.getLong("id"));
        plan.setUserId(rs.getLong("user_id"));
        plan.setPlanJson(rs.getString("plan_json"));
        plan.setCreatedAt(rs.getString("created_at"));
        return plan;
    };

    public Long save(Long userId, String planJson) {
        String sql = """
            INSERT INTO diet_plans (user_id, plan_json)
            VALUES (?, ?)
            """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                sql, Statement.RETURN_GENERATED_KEYS
            );
            ps.setLong(1, userId);
            ps.setString(2, planJson);
            return ps;
        }, keyHolder);

        Number generatedKey = keyHolder.getKey();

        if (generatedKey == null) {
            throw new IllegalStateException(
                "MySQL did not return the generated diet plan ID."
            );
        }

        return generatedKey.longValue();
    }

    public Optional<DietPlan> findById(Long id) {
        String sql = "SELECT * FROM diet_plans WHERE id = ?";

        try {
            DietPlan plan = jdbcTemplate.queryForObject(
                sql, dietPlanRowMapper, id
            );
            return Optional.ofNullable(plan);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public List<Map<String, Object>> findAllWithUserDetails() {
        String sql = """
            SELECT
                p.id AS plan_id,
                p.user_id,
                p.plan_json,
                p.created_at AS plan_created_at,
                u.name AS user_name,
                u.email AS user_email,
                u.goal AS user_goal,
                u.diet_preference AS user_diet_preference,
                u.current_weight_kg,
                u.target_weight_kg,
                u.meals_per_day
            FROM diet_plans p
            INNER JOIN users u ON p.user_id = u.id
            ORDER BY p.id DESC
            """;

        return jdbcTemplate.queryForList(sql);
    }

    public boolean deleteById(Long id) {
        String getUserIdSql =
            "SELECT user_id FROM diet_plans WHERE id = ?";

        Long userId;

        try {
            userId = jdbcTemplate.queryForObject(
                getUserIdSql, Long.class, id
            );
        } catch (EmptyResultDataAccessException e) {
            return false;
        }

        int planRows = jdbcTemplate.update(
            "DELETE FROM diet_plans WHERE id = ?", id
        );

        if (planRows > 0 && userId != null) {
            Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM diet_plans WHERE user_id = ?",
                Integer.class,
                userId
            );

            if (count != null && count == 0) {
                jdbcTemplate.update(
                    "DELETE FROM users WHERE id = ?", userId
                );
            }
        }

        return planRows > 0;
    }
}