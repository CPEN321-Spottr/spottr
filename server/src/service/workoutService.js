const generator = require('../engine/workoutPlanGenerationEngine.js');
const data = require('../data/workoutData.js');
const userData = require('../data/userData.js');
const firebaseService = require('./firebaseService.js');
const constants = require('../constants.js');

const MULTIPLIER_STEPS = 0.025;
const MIN_MULTIPLIER = 0.2;

const PERCENT_DIFF_RECALC_TRIGGER = 1.15;

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
        // Generate new entry in the workout history table for completed workout
        const workoutPlan = await data.getWorkoutPlanById(workoutPlanId, dbConfig);
        const workoutHistoryId = await data.createWorkoutHistoryEntry(workoutPlan, lengthOfWorkoutSec, userId, dbConfig);
        const workoutHistory = await data.getWorkoutHistoryById(workoutHistoryId, dbConfig);

        // Send message to Firebase so other user's are notified in real-time
        firebaseService.sendWorkoutToFirebase(workoutHistory);                      // TODO: NEED TO IMPLEMENT STILL

        // Increment the user's Spottr Points
        const user = await userData.getUserByUserId(userId, dbConfig);
        userData.updateUserSpottrPoints(userId, user.spottr_points + workoutPlan.spottr_points, dbConfig);

        // Adjust user's multiplier (if they were reasonably off the estimated workout time)
        var percentageDifference = lengthOfWorkoutSec / workoutPlan.est_length_sec;
        if (percentageDifference >= PERCENT_DIFF_RECALC_TRIGGER || percentageDifference <= (2 - PERCENT_DIFF_RECALC_TRIGGER)) {
            var userMultiplier = await data.getUserMultiplier(workoutPlan.major_muscle_group_id, user.user_multiplier_id, dbConfig);
            
            // Only trigger change if the workout they were doing was set at their level (ie not from "one upping" someone)
            if (userMultiplier == workoutPlan.associated_multiplier) {
                await data.updateUserMultiplier(
                workoutPlan.major_muscle_group_id, 
                calculateNewMultiplier(lengthOfWorkoutSec, workoutPlan.est_length_sec, userMultiplier), 
                user.user_multiplier_id, 
                dbConfig
            );
            }
        }

        return 1;
    }
}


// Either increases or decreases a user's multiplier depending on the amount of time they took to 
// complete a workout vs the estimated time for their current multiplier
function calculateNewMultiplier(actualLengthSeconds, estLengthSeconds, currentMultiplier) {
    //
    // TODO: NEED TO IMPLEMENT STILL
    //
    return currentMultiplier;
}