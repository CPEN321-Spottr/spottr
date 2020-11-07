const generator = require('../engine/workoutPlanGenerationEngine.js');
const data = require('../data/workoutData.js');
const userData = require('../data/userData.js');
const firebaseService = require('./firebaseService.js');
const constants = require('../constants.js');
const util = require('../util.js');
const e = require('express');

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

        return new Promise(function(resolve) {
            resolve(workoutPlan);
        });
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
        
        return new Promise(function(resolve) {
            resolve(constants.SUCCESS_RESPONSE);
        });
    },

    completeWorkout: async function (userId, lengthOfWorkoutSec, workoutPlanId, dbConfig) {
        // Generate new entry in the workout history table for completed workout
        const workoutPlan = await data.getWorkoutPlanById(workoutPlanId, dbConfig);
        const workoutHistoryId = await data.createWorkoutHistoryEntry(workoutPlan, lengthOfWorkoutSec, userId, dbConfig);
        const workoutHistory = await data.getWorkoutHistoryById(workoutHistoryId, dbConfig);

        // Increment the user's Spottr Points
        const user = await userData.getUserByUserId(userId, dbConfig);
        userData.updateUserSpottrPoints(userId, user.spottr_points + workoutPlan.spottr_points, dbConfig);

        // Send message to Firebase so other user's are notified in real-time
        firebaseService.sendWorkoutToFirebase(workoutHistory, user.name);

        // Adjust user's multiplier (if they were reasonably off the estimated workout time)
        var percentageDifference = lengthOfWorkoutSec / workoutPlan.est_length_sec;
        if (percentageDifference >= PERCENT_DIFF_RECALC_TRIGGER || percentageDifference <= (2 - PERCENT_DIFF_RECALC_TRIGGER)) {
            var userMultiplier = await data.getUserMultiplier(workoutPlan.major_muscle_group_id, user.user_multiplier_id, dbConfig);
            
            // Only trigger change if the workout they were doing was set at their level (ie not from "one upping" someone)
            if (userMultiplier == workoutPlan.associated_multiplier) {
                data.updateUserMultiplier(
                    workoutPlan.major_muscle_group_id, 
                    calculateNewMultiplier(percentageDifference, userMultiplier), 
                    user.user_multiplier_id, 
                    dbConfig
                );
            }
        }
        return new Promise(function(resolve) {
            resolve(1);
        });
    }, 

    getAllMuscleGroups: async function(dbConfig) {
        return new Promise(function(resolve) {
            resolve(data.getAllMuscleGroups(dbConfig));
        });
    },

    getWorkoutHistory: async function(dbConfig, numEntries, startId) {
        numEntries = Number(numEntries);
        startId = Number(startId);
        var maxWorkoutHistoryId = Number(await data.getMaxWorkoutHistoryId(dbConfig));
        return new Promise(function(resolve, reject) {
            if (typeof startId == 'undefined') {
                resolve(data.getRecentWorkoutHistory(dbConfig, maxWorkoutHistoryId-numEntries, maxWorkoutHistoryId));
            }
            else {
                if (startId > maxWorkoutHistoryId){
                    console.log("Error: startId is bigger than the number of entries in the workout_history table.")
                    reject(constants.ERROR_RESPONSE)
                }
                console.log(startId+numEntries);
                upperLimitId = startId+numEntries <= maxWorkoutHistoryId ? startId+numEntries-1 : maxWorkoutHistoryId;
                console.log(upperLimitId);
                resolve(data.getRecentWorkoutHistory(dbConfig, startId, upperLimitId));
            }
        });
    }
}


const DIFF_MULTIPLICATION_FACTOR = 0.33;
const MAX_SINGLE_CHANGE_PERCENT = 0.15;

// Either increases or decreases a user's multiplier depending on the amount of time they took to 
// complete a workout vs the estimated time for their current multiplier.
//
// The percentageDifference is "actual time / estimated time". This means percentageDifference > 1
// implies that the workout was too hard and the multiplier needs to be decreased.
//
// This can be made more complex in the future if it is required to enhance user experience.
function calculateNewMultiplier(percentageDifference, currentMultiplier) {
    var changeFactor = (percentageDifference - 1) * -1 * DIFF_MULTIPLICATION_FACTOR;
    
    var changeValue;
    if (changeFactor < 0) {
        changeValue = Math.max(-changeFactor, MAX_SINGLE_CHANGE_PERCENT) * currentMultiplier;
    } else {
        changeValue = Math.min(changeFactor, MAX_SINGLE_CHANGE_PERCENT) * currentMultiplier;
    }
    
    return new Promise(function(resolve) {
        resolve(util.roundToThree(currentMultiplier + changeValue));
    });
}