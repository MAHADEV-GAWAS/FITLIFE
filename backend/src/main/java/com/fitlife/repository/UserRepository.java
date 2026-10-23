package com.fitlife.repository;

import com.fitlife.model.User;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.Optional;

/**
 * UserRepository provides persistent data access for the 'users' table in SQLite.
 * Employs Spring JDBC Template with parameterized queries to prevent SQL injection.
 */
@Repository
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<User> userRowMapper = (rs, rowNum) -> {
        User user = new User();
        user.setId(rs.getLong("id"));
        user.setName(rs.getString("name"));
        user.setEmail(rs.getString("email"));
        user.setAge(rs.getInt("age"));
        user.setGender(rs.getString("gender"));
        user.setHeightCm(rs.getDouble("height_cm"));
        user.setCurrentWeightKg(rs.getDouble("current_weight_kg"));
        user.setTargetWeightKg(rs.getDouble("target_weight_kg"));
        user.setGoal(rs.getString("goal"));
        user.setDietPreference(rs.getString("diet_preference"));
        user.setActivity(rs.getString("activity"));
        user.setAllergies(rs.getString("allergies"));
        user.setMealsPerDay(rs.getInt("meals_per_day"));
        user.setCreatedAt(rs.getString("created_at"));
        return user;
    };

    /**
     * Inserts a new user record using a parameterized PreparedStatement.
     * Returns the generated SQLite primary key ID.
     */
    public Long save(User user) {
        String sql = """
            INSERT INTO users (
                name, email, age, gender, height_cm, current_weight_kg,
                target_weight_kg, goal, diet_preference, activity, allergies, meals_per_day
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, user.getName());
            ps.setString(2, user.getEmail());
            ps.setInt(3, user.getAge());
            ps.setString(4, user.getGender());
            ps.setDouble(5, user.getHeightCm());
            ps.setDouble(6, user.getCurrentWeightKg());
            ps.setDouble(7, user.getTargetWeightKg());
            ps.setString(8, user.getGoal());
            ps.setString(9, user.getDietPreference());
            ps.setString(10, user.getActivity());
            ps.setString(11, user.getAllergies());
            ps.setInt(12, user.getMealsPerDay());
            return ps;
        }, keyHolder);

        Number generatedKey = keyHolder.getKey();
        if (generatedKey != null) {
            return generatedKey.longValue();
        }

        // Fallback for SQLite drivers where getKey() might not return directly
        return jdbcTemplate.queryForObject("SELECT last_insert_rowid()", Long.class);
    }

    /**
     * Finds a user by ID using parameterized query.
     */
    public Optional<User> findById(Long id) {
        String sql = "SELECT * FROM users WHERE id = ?";
        try {
            User user = jdbcTemplate.queryForObject(sql, userRowMapper, id);
            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    /**
     * Finds a user by email address using parameterized query.
     */
    public Optional<User> findByEmail(String email) {
        String sql = "SELECT * FROM users WHERE email = ? ORDER BY id DESC LIMIT 1";
        try {
            User user = jdbcTemplate.queryForObject(sql, userRowMapper, email);
            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    /**
     * Deletes a user by ID.
     */
    public boolean deleteById(Long id) {
        String sql = "DELETE FROM users WHERE id = ?";
        int rows = jdbcTemplate.update(sql, id);
        return rows > 0;
    }
}
