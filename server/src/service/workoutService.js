const generator = require('../engine/workoutPlanGenerationEngine.js');
const data = require('../data/workoutData.js');
const userData = require('../data/userData.js');
const constants = require('../constants.js');

const MULTIPLIER_STEPS = 0.025;
const MIN_MULTIPLIER = 0.2;

module.exports = {
    // Generates a workout plan via the algorithm, perists it to the database, and returns it to the caller
    generateWorkoutPlan: async function (userId, lengthMinutes, targetMuscleGroup, dbConfig) {
        // Collect required data from different parts of the database
        const user = await userData.getUserByUserId(userId, dbConfig);
        const userMultiplier = await data.getUserMultiplier(targetMuscleGroup, user.user_multiplier_id, dbConfig);
        const possibleExercises = await data.getExercisesByTargetMuscleGroups(targetMuscleGroup, dbConfig);
        const workoutPlanId = await data.createWorkoutPlanEntry(dbConfig);

        var workoutPlan = generator.generateWorkoutPlan(
            lengthMinutes, 
            possibleExercises, 
            userMultiplier, 
            workoutPlanId
        );

        data.updateWorkoutPlan(
            workoutPlan['workout_plan_id'],
            workoutPlan['est_length_sec'],
            targetMuscleGroup,
            workoutPlan['associated_multiplier'],
            workoutPlan['spottr_points'],
            dbConfig
        );
        data.createWorkoutExerciseEntries(workoutPlan, dbConfig);

        return workoutPlan;
    },

    // Changes a user's multiplier for a given muscle group by a given factor
    modifyWorkoutDifficulty: async function (userId, targetMuscleGroup, changeFactor, dbConfig) {
        // Collect current multiplier
        const user = await userData.getUserByUserId(userId, dbConfig);
        var userMultiplier = await data.getUserMultiplier(targetMuscleGroup, user.user_multiplier_id, dbConfig);

        // Generate new multiplier, upsert data, return success response
        userMultiplier += (MULTIPLIER_STEPS * changeFactor);
        if (userMultiplier < MIN_MULTIPLIER) userMultiplier = MIN_MULTIPLIER;

        await data.updateUserMultiplier(targetMuscleGroup, userMultiplier, user.user_multiplier_id, dbConfig);
        
        return constants.SUCCESS_RESPONSE;
    },

    completeWorkout: async function (userId, lengthOfWorkoutSec, workoutPlanId, dbConfig) {
        // TODO
    }
}
