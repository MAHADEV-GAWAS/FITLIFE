package com.fitlife.service;

import com.fitlife.dto.DietPlanRequest;
import com.fitlife.dto.DietPlanResponse;
import com.fitlife.dto.MealSuggestion;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * DietPlanGeneratorService
 *
 * Transparent, rule-based diet plan generation service using straightforward
 * if-else conditions and helper methods.
 *
 * Designed for first-year computer science students to easily explain
 * to professors during college project evaluation.
 */
@Service
public class DietPlanGeneratorService {

    private static final String DISCLAIMER =
            "EDUCATIONAL DISCLAIMER: This personalized diet plan is generated solely for academic, educational, and demonstrational purposes. " +
            "It uses standard nutritional formulas (Mifflin-St Jeor & TDEE multipliers) and general dietary guidelines. " +
            "It does NOT constitute professional medical advice, clinical diagnosis, or medical nutrition therapy. " +
            "Always consult a qualified healthcare provider or registered dietitian before making significant changes to your diet or exercise routine.";

    /**
     * Generates a complete DietPlanResponse from a validated DietPlanRequest.
     */
    public DietPlanResponse generatePlan(DietPlanRequest request) {
        request.sanitize();

        // 1. Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor equation
        int bmr = calculateBmr(request.getGender(), request.getCurrentWeightKg(), request.getHeightCm(), request.getAge());

        // 2. Calculate Total Daily Energy Expenditure (TDEE) based on activity level
        int tdee = calculateTdee(bmr, request.getActivity());

        // 3. Calculate target calories and calorie goal explanation based on user goal
        int targetCalories = calculateTargetCalories(tdee, request.getGoal(), request.getGender());
        String calorieExplanation = buildCalorieExplanation(request.getGoal(), tdee, targetCalories);

        // 4. Calculate macronutrient distribution (Protein, Carbs, Fats)
        int[] macroPercentages = determineMacroSplit(request.getGoal());
        int proteinPct = macroPercentages[0];
        int carbsPct = macroPercentages[1];
        int fatPct = macroPercentages[2];

        int proteinGrams = (int) Math.round((targetCalories * (proteinPct / 100.0)) / 4.0); // 4 kcal per gram of protein
        int carbsGrams = (int) Math.round((targetCalories * (carbsPct / 100.0)) / 4.0);   // 4 kcal per gram of carb
        int fatGrams = (int) Math.round((targetCalories * (fatPct / 100.0)) / 9.0);       // 9 kcal per gram of fat

        // 5. Calculate recommended daily water intake (litres)
        double hydrationLitres = calculateHydration(request.getCurrentWeightKg(), request.getActivity());

        // 6. Analyze allergen restrictions
        List<String> allergenNotes = analyzeAllergies(request.getAllergies());

        // 7. Generate meals based on mealsPerDay, diet preference, allergens, and target calories
        List<MealSuggestion> meals = buildMealList(
                request.getMealsPerDay(),
                request.getDietPreference(),
                request.getAllergies(),
                targetCalories,
                proteinGrams,
                carbsGrams,
                fatGrams
        );

        // 8. General nutritional and lifestyle tips
        List<String> tips = buildGeneralTips(request.getGoal(), request.getActivity(), request.getDietPreference());

        // 9. Assemble response DTO
        DietPlanResponse response = new DietPlanResponse();
        response.setName(request.getName());
        response.setEmail(request.getEmail());
        response.setAge(request.getAge());
        response.setGender(request.getGender() != null ? request.getGender() : "Not Specified");
        response.setHeightCm(request.getHeightCm());
        response.setCurrentWeightKg(request.getCurrentWeightKg());
        response.setTargetWeightKg(request.getTargetWeightKg());
        response.setGoal(request.getGoal());
        response.setDietPreference(request.getDietPreference());
        response.setActivity(request.getActivity());
        response.setAllergies(request.getAllergies() != null && !request.getAllergies().isBlank() ? request.getAllergies() : "None reported");
        response.setMealsPerDay(request.getMealsPerDay());

        response.setBmr(bmr);
        response.setTdee(tdee);
        response.setTargetCalories(targetCalories);
        response.setCalorieGoalSummary(calorieExplanation);

        response.setProteinGrams(proteinGrams);
        response.setCarbsGrams(carbsGrams);
        response.setFatGrams(fatGrams);
        response.setProteinPercentage(proteinPct);
        response.setCarbsPercentage(carbsPct);
        response.setFatPercentage(fatPct);

        response.setHydrationLitres(hydrationLitres);
        response.setAllergenNotes(allergenNotes);
        response.setMeals(meals);
        response.setNutritionalTips(tips);
        response.setEducationalDisclaimer(DISCLAIMER);
        response.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

        return response;
    }

    /**
     * Calculates Basal Metabolic Rate using Mifflin-St Jeor formula.
     * BMR = (10 * weight in kg) + (6.25 * height in cm) - (5 * age) + s
     * where s = +5 for males, -161 for females, -78 for unspecified
     */
    private int calculateBmr(String gender, double weightKg, double heightCm, int age) {
        double base = (10.0 * weightKg) + (6.25 * heightCm) - (5.0 * age);
        double s;

        if (gender != null && gender.equalsIgnoreCase("Male")) {
            s = 5.0;
        } else if (gender != null && gender.equalsIgnoreCase("Female")) {
            s = -161.0;
        } else {
            // Average gender neutral offset
            s = -78.0;
        }

        return (int) Math.round(base + s);
    }

    /**
     * Multiplies BMR by physical activity multiplier to determine TDEE.
     */
    private int calculateTdee(int bmr, String activity) {
        double multiplier;

        if ("Sedentary".equalsIgnoreCase(activity)) {
            multiplier = 1.2;
        } else if ("Lightly Active".equalsIgnoreCase(activity)) {
            multiplier = 1.375;
        } else if ("Moderately Active".equalsIgnoreCase(activity)) {
            multiplier = 1.55;
        } else if ("Very Active".equalsIgnoreCase(activity)) {
            multiplier = 1.725;
        } else {
            multiplier = 1.2;
        }

        return (int) Math.round(bmr * multiplier);
    }

    /**
     * Determines daily target calories based on goal.
     * Enforces healthy minimum boundaries (no extreme crash diets).
     */
    private int calculateTargetCalories(int tdee, String goal, String gender) {
        int target;

        if ("Lose Weight".equalsIgnoreCase(goal)) {
            // Safe, sustainable 18% caloric deficit
            target = (int) Math.round(tdee * 0.82);
            // Healthy safe floor check
            int minFloor = (gender != null && gender.equalsIgnoreCase("Male")) ? 1500 : 1250;
            if (target < minFloor) {
                target = minFloor;
            }
        } else if ("Gain Weight".equalsIgnoreCase(goal)) {
            // Safe, lean 15% caloric surplus
            target = (int) Math.round(tdee * 1.15);
        } else {
            // Maintain Weight
            target = tdee;
        }

        return target;
    }

    /**
     * Human-readable explanation of why the calorie target was chosen.
     */
    private String buildCalorieExplanation(String goal, int tdee, int target) {
        if ("Lose Weight".equalsIgnoreCase(goal)) {
            int deficit = tdee - target;
            return "Caloric Deficit: Targeting ~" + target + " kcal/day (~" + deficit + " kcal below your estimated maintenance of " + tdee + " kcal) for steady, sustainable fat loss without extreme deprivation.";
        } else if ("Gain Weight".equalsIgnoreCase(goal)) {
            int surplus = target - tdee;
            return "Caloric Surplus: Targeting ~" + target + " kcal/day (~" + surplus + " kcal above your estimated maintenance of " + tdee + " kcal) to support healthy muscle growth and energy recovery.";
        } else {
            return "Caloric Balance: Targeting ~" + target + " kcal/day to maintain your current body weight while optimizing energy levels and daily vitality.";
        }
    }

    /**
     * Macro distribution (Protein %, Carbs %, Fat %) based on fitness goal.
     */
    private int[] determineMacroSplit(String goal) {
        if ("Lose Weight".equalsIgnoreCase(goal)) {
            // Higher protein to spare lean muscle during a deficit
            return new int[]{30, 40, 30};
        } else if ("Gain Weight".equalsIgnoreCase(goal)) {
            // Adequate carbs to fuel workouts and moderate protein for hypertrophy
            return new int[]{25, 50, 25};
        } else {
            // Balanced maintenance
            return new int[]{20, 50, 30};
        }
    }

    /**
     * Calculates recommended hydration in litres (approx 35ml per kg + activity boost).
     */
    private double calculateHydration(double weightKg, String activity) {
        double base = weightKg * 0.035; // 35 ml per kg
        if ("Moderately Active".equalsIgnoreCase(activity)) {
            base += 0.5;
        } else if ("Very Active".equalsIgnoreCase(activity)) {
            base += 0.8;
        }
        return Math.round(base * 10.0) / 10.0;
    }

    /**
     * Checks allergies and formats exclusion statements.
     */
    private List<String> analyzeAllergies(String allergiesStr) {
        List<String> notes = new ArrayList<>();
        if (allergiesStr == null || allergiesStr.trim().isEmpty() || allergiesStr.equalsIgnoreCase("none")) {
            notes.add("No food allergies reported. Standard ingredient substitutions are available.");
            return notes;
        }

        String lower = allergiesStr.toLowerCase();
        boolean knownFound = false;

        if (lower.contains("peanut") || lower.contains("tree nut") || lower.contains("nut")) {
            notes.add("Nut / Peanut Allergy detected: All whole nuts, peanut butter, and almond milk are excluded. Pumpkin seeds and sunflower seeds substituted.");
            knownFound = true;
        }
        if (lower.contains("dairy") || lower.contains("milk") || lower.contains("lactose") || lower.contains("cheese") || lower.contains("paneer")) {
            notes.add("Dairy Allergy / Lactose restriction detected: Cow's milk, paneer, Greek yogurt, and whey are excluded. Fortified oat/soy milk, tofu, and plant yogurts substituted.");
            knownFound = true;
        }
        if (lower.contains("gluten") || lower.contains("wheat") || lower.contains("celiac")) {
            notes.add("Gluten / Wheat Allergy detected: Whole wheat bread and standard rotis are excluded. Certified gluten-free rolled oats, brown rice, quinoa, and millet flatbreads substituted.");
            knownFound = true;
        }
        if (lower.contains("egg")) {
            notes.add("Egg Allergy detected: Whole eggs, omelettes, and egg-based noodles are excluded. Plant-based scrambles (tofu bhurji) and legumes substituted.");
            knownFound = true;
        }
        if (lower.contains("soy") || lower.contains("soya")) {
            notes.add("Soy Allergy detected: Tofu, edamame, and soy milk are excluded. Chickpeas, lentils, and seed-based alternatives substituted.");
            knownFound = true;
        }
        if (lower.contains("fish") || lower.contains("seafood") || lower.contains("shellfish")) {
            notes.add("Seafood / Shellfish Allergy detected: Fish fillets and shrimp are excluded. Chicken breast, eggs, or legume proteins substituted.");
            knownFound = true;
        }

        if (!knownFound) {
            notes.add("Custom restriction reported ('" + allergiesStr + "'): Please manually verify all suggested grocery labels and restaurant preparations before consumption.");
        }

        return notes;
    }

    /**
     * Builds structured meal list tailored to diet preference, allergies, and number of meals.
     */
    private List<MealSuggestion> buildMealList(int mealsCount, String dietPref, String allergies,
                                               int totalCalories, int totalProtein, int totalCarbs, int totalFat) {
        List<MealSuggestion> meals = new ArrayList<>();
        String allergyText = (allergies != null) ? allergies.toLowerCase() : "";

        boolean hasNuts = allergyText.contains("nut") || allergyText.contains("peanut");
        boolean hasDairy = allergyText.contains("dairy") || allergyText.contains("milk") || allergyText.contains("lactose") || allergyText.contains("paneer");
        boolean hasGluten = allergyText.contains("gluten") || allergyText.contains("wheat");
        boolean hasEggs = allergyText.contains("egg");

        // Percentage distributions based on meals count
        double[] calorieShares;
        String[] timings;
        String[] mealNames;

        if (mealsCount == 3) {
            calorieShares = new double[]{0.30, 0.40, 0.30};
            mealNames = new String[]{"Breakfast", "Lunch", "Dinner"};
            timings = new String[]{"08:00 AM - 09:00 AM", "01:00 PM - 02:00 PM", "07:30 PM - 08:30 PM"};
        } else if (mealsCount == 4) {
            calorieShares = new double[]{0.25, 0.35, 0.15, 0.25};
            mealNames = new String[]{"Breakfast", "Lunch", "Evening Snack", "Dinner"};
            timings = new String[]{"08:00 AM - 09:00 AM", "01:00 PM - 02:00 PM", "05:00 PM - 05:30 PM", "08:00 PM - 09:00 PM"};
        } else if (mealsCount == 5) {
            calorieShares = new double[]{0.25, 0.10, 0.35, 0.10, 0.20};
            mealNames = new String[]{"Breakfast", "Mid-Morning Snack", "Lunch", "Evening Snack", "Dinner"};
            timings = new String[]{"08:00 AM - 08:30 AM", "11:00 AM - 11:30 AM", "01:00 PM - 02:00 PM", "05:00 PM - 05:30 PM", "08:00 PM - 09:00 PM"};
        } else { // 6 meals
            calorieShares = new double[]{0.20, 0.10, 0.30, 0.10, 0.20, 0.10};
            mealNames = new String[]{"Breakfast", "Mid-Morning Snack", "Lunch", "Afternoon Energy Snack", "Dinner", "Night Recovery Snack"};
            timings = new String[]{"07:30 AM - 08:00 AM", "10:30 AM - 11:00 AM", "01:00 PM - 01:30 PM", "04:30 PM - 05:00 PM", "07:30 PM - 08:00 PM", "09:45 PM - 10:15 PM"};
        }

        for (int i = 0; i < mealsCount; i++) {
            double share = calorieShares[i];
            int mealCal = (int) Math.round(totalCalories * share);
            int mealProt = (int) Math.round(totalProtein * share);
            int mealCarb = (int) Math.round(totalCarbs * share);
            int mealFat = (int) Math.round(totalFat * share);

            String name = mealNames[i];
            String time = timings[i];

            List<String> items = selectMealItems(name, dietPref, hasNuts, hasDairy, hasGluten, hasEggs);
            String desc = generateMealDescription(name, dietPref, items.get(0));
            String tip = generateMealTip(name);

            meals.add(new MealSuggestion(name, time, desc, mealCal, mealProt, mealCarb, mealFat, items, tip));
        }

        return meals;
    }

    /**
     * Selects safe food items based on meal type, dietary preference, and active allergens.
     */
    private List<String> selectMealItems(String mealName, String dietPref, boolean hasNuts, boolean hasDairy, boolean hasGluten, boolean hasEggs) {
        List<String> items = new ArrayList<>();

        if ("Breakfast".equalsIgnoreCase(mealName)) {
            if ("Vegan".equalsIgnoreCase(dietPref)) {
                items.add(hasGluten ? "Quinoa porridge cooked in fortified soy milk" : "Steel-cut oatmeal made with warm oat milk");
                items.add(hasNuts ? "Topped with chia seeds and sunflower seeds" : "Topped with crushed walnuts and chia seeds");
                items.add("Fresh sliced berries or 1 medium banana");
            } else if ("Vegetarian".equalsIgnoreCase(dietPref)) {
                if (hasDairy) {
                    items.add(hasGluten ? "Buckwheat pancakes with maple syrup" : "Whole-grain vegetable upma or oats bowl");
                    items.add("Tofu scramble with spinach, bell peppers, and turmeric");
                } else {
                    items.add(hasGluten ? "Gluten-free toast with mashed avocado" : "2 slices toasted whole grain bread with mashed avocado");
                    items.add("Low-fat Greek yogurt cup topped with pomegranate");
                }
            } else if ("Eggetarian".equalsIgnoreCase(dietPref)) {
                if (hasEggs) {
                    items.add("Tofu and chickpea flour savory pancake (Chilla) with mint chutney");
                } else {
                    items.add("2-3 whole egg omelette or scrambled eggs with baby spinach and mushrooms");
                    items.add(hasGluten ? "Steamed sweet potato cubes" : "1 slice whole wheat toast");
                }
                items.add("1 cup fresh unsweetened green tea or black coffee");
            } else { // Non-Vegetarian
                if (hasEggs) {
                    items.add("Grilled chicken breast strips with sautéed bell peppers");
                } else {
                    items.add("3 egg-white scramble with 1 whole egg, diced tomatoes, and spinach");
                    items.add(hasGluten ? "Baked sweet potato hash" : "1 slice sprouted multigrain bread");
                }
                items.add("1 glass warm lemon water or green tea");
            }
        } else if ("Lunch".equalsIgnoreCase(mealName)) {
            if ("Vegan".equalsIgnoreCase(dietPref)) {
                items.add("Warm spiced chickpea and vegetable stew");
                items.add(hasGluten ? "Steamed brown basmati rice or quinoa" : "Steamed brown rice or 2 whole wheat rotis");
                items.add("Fresh garden cucumber, tomato, and carrot salad with lime dressing");
            } else if ("Vegetarian".equalsIgnoreCase(dietPref)) {
                if (hasDairy) {
                    items.add("Spiced yellow lentil dal with roasted seasonal vegetables");
                    items.add("Pan-seared firm tofu steak with coriander chutney");
                } else {
                    items.add("Spiced yellow lentil dal (tadka) or black bean bowl");
                    items.add("Grilled low-fat paneer (100g) with stir-fried bell peppers");
                }
                items.add(hasGluten ? "1 cup cooked quinoa or wild rice" : "2 small multigrain rotis or brown rice");
                items.add("Mixed shredded cabbage and radish kachumber");
            } else if ("Eggetarian".equalsIgnoreCase(dietPref)) {
                if (hasEggs) {
                    items.add("Mixed red kidney beans (Rajma) curry");
                } else {
                    items.add("Boiled egg curry (2 eggs) in onion-tomato gravy");
                }
                items.add(hasGluten ? "Brown rice bowl" : "Steamed brown rice or 2 phulkas");
                items.add("Steamed broccoli florets with olive oil drizzle");
            } else { // Non-Vegetarian
                items.add("Herb-marinated grilled chicken breast (150g) or steamed fish fillet");
                items.add(hasGluten ? "Roasted sweet potato wedges with rosemary" : "1 cup cooked brown rice or quinoa");
                items.add("Generous bowl of steamed asparagus and sautéed zucchini");
            }
        } else if (mealName.toLowerCase().contains("snack")) {
            if ("Vegan".equalsIgnoreCase(dietPref)) {
                items.add(hasNuts ? "Roasted spiced chickpeas (Chana) and pumpkin seeds" : "A handful of raw almonds and walnuts");
                items.add("1 medium green apple or seasonal citrus fruit");
            } else if ("Vegetarian".equalsIgnoreCase(dietPref) || "Eggetarian".equalsIgnoreCase(dietPref)) {
                if (hasDairy) {
                    items.add("Roasted makhana (fox nuts) roasted with light olive oil and sea salt");
                    items.add("Fresh orange or apple wedges");
                } else {
                    items.add("1 cup low-fat Greek yogurt or cottage cheese with a pinch of cinnamon");
                    items.add(hasNuts ? "Pumpkin seeds" : "5-6 almonds");
                }
            } else { // Non-Vegetarian
                items.add(hasDairy ? "2 boiled egg whites with cracked black pepper" : "Cottage cheese cubes with black pepper and cucumber slices");
                items.add("Handful of roasted pumpkin and sunflower seeds");
            }
        } else { // Dinner
            if ("Vegan".equalsIgnoreCase(dietPref)) {
                items.add("Sautéed edamame or firm tofu stir-fry with broccoli and bok choy");
                items.add(hasGluten ? "Warm quinoa bowl with olive oil" : "Whole wheat wrap or quinoa bowl");
                items.add("Clear vegetable and ginger broth soup");
            } else if ("Vegetarian".equalsIgnoreCase(dietPref)) {
                if (hasDairy) {
                    items.add("Tofu and mixed vegetable stir-fry with ginger-garlic dressing");
                } else {
                    items.add("Light paneer bhurji or sautéed paneer cubes (75g) with bell peppers");
                }
                items.add("Hearty bowl of mixed vegetable soup or moong dal soup");
                items.add(hasGluten ? "Small portion of steamed millet" : "1 small multigrain roti");
            } else if ("Eggetarian".equalsIgnoreCase(dietPref)) {
                if (hasEggs) {
                    items.add("Yellow lentil soup with steamed vegetable medley");
                } else {
                    items.add("Fluffy egg-white vegetable frittata with tomatoes and herbs");
                }
                items.add("Steamed green beans and carrots with sea salt");
            } else { // Non-Vegetarian
                items.add("Baked salmon fillet or lemon-herb chicken breast (120g)");
                items.add("Steamed baby spinach, sautéed green beans, and roasted carrots");
                items.add("Light clear vegetable broth");
            }
        }

        return items;
    }

    private String generateMealDescription(String mealName, String dietPref, String primaryItem) {
        return mealName + " designed for a " + dietPref + " lifestyle, centered around " + primaryItem.toLowerCase() + " to balance energy and amino acid intake.";
    }

    private String generateMealTip(String mealName) {
        if ("Breakfast".equalsIgnoreCase(mealName)) {
            return "Eat within 60-90 minutes of waking to jumpstart your metabolic rate and stabilize morning cortisol.";
        } else if ("Lunch".equalsIgnoreCase(mealName)) {
            return "Take at least 20 minutes to chew slowly; avoid large sips of ice water directly with the meal.";
        } else if (mealName.toLowerCase().contains("snack")) {
            return "Pair protein with fiber to prevent mid-afternoon blood sugar crashes.";
        } else {
            return "Aim to finish dinner at least 2 to 3 hours before sleeping to promote restorative deep sleep.";
        }
    }

    private List<String> buildGeneralTips(String goal, String activity, String dietPref) {
        List<String> tips = new ArrayList<>();
        tips.add("Consistency is key: Prioritize whole, minimally processed ingredients 80% of the time.");
        tips.add("Hydration: Sip water consistently throughout the day rather than chugging large amounts at once.");

        if ("Lose Weight".equalsIgnoreCase(goal)) {
            tips.add("Weight Loss Strategy: Consume your vegetables and protein first during each meal to maximize satiety hormones.");
            tips.add("Mindful Eating: Avoid eating while distracted by phone or TV screens to prevent inadvertent overeating.");
        } else if ("Gain Weight".equalsIgnoreCase(goal)) {
            tips.add("Weight Gain Strategy: Include calorie-dense nutrient-rich foods such as avocados, seeds, and healthy nut butters.");
            tips.add("Post-Workout: Prioritize a protein-and-carb rich recovery meal within 45 minutes after strength training.");
        } else {
            tips.add("Maintenance Strategy: Keep an eye on your energy levels and adjust portion sizes slightly if daily activity fluctuates.");
        }

        if ("Vegan".equalsIgnoreCase(dietPref) || "Vegetarian".equalsIgnoreCase(dietPref)) {
            tips.add("Plant Protein Tip: Combine complementary protein sources (e.g., lentils with grains) to ensure complete amino acid profiles.");
        }

        return tips;
    }
}
