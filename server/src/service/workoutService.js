const generator = require("../engine/workoutPlanGenerationEngine.js");
const data = require("../data/workoutData.js");
const userData = require("../data/userData.js");
const firebaseService = require("./firebaseService.js");
const constants = require("../constants.js");
const util = require("../util.js");
const e = require("express");

const MULTIPLIER_STEPS = 0.025;
const MIN_MULTIPLIER = 0.2;

const PERCENT_DIFF_RECALC_TRIGGER = 1.15;

const BREAK_ID = 20;

const DIFF_MULTIPLICATION_FACTOR = 0.33;
const MAX_SINGLE_CHANGE_PERCENT = 0.15;

const DEFAULT_WORKOUT_HISTORY_ENTRIES = 20;

// Either increases or decreases a user"s multiplier depending on the amount of time they took to
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
        changeValue = Math.max(changeFactor, -MAX_SINGLE_CHANGE_PERCENT) * currentMultiplier;
    } else {
        changeValue = Math.min(changeFactor, MAX_SINGLE_CHANGE_PERCENT) * currentMultiplier;
    }

    return new Promise(function(resolve) {
        resolve(util.roundToThree(currentMultiplier + changeValue));
    });
}

// Using data that can be collected from the database tables, this function reconstructs a workout
// plan and reproduces the same format which the FE expects from the generateNewWorkoutPlan API
function reassembleWorkoutPlan(oldWorkoutPlan, oldWorkoutExercises, exerciseData) {
    var relevantExercise;

    var reassembledPlan = {
        workout_plan_id: oldWorkoutPlan.id,
        exercises: [],
        breaks: []
    };

    // Combine the breaks and exercise lists (like the usual plan generation)
    for (let i = 0; i < oldWorkoutExercises.length; i++) {
        let exercise = oldWorkoutExercises[parseInt(i, 10)];

        if (exercise.exercise_id === BREAK_ID) {
            var reassembledBreak = {
                name: "Rest",
                exercise_id: BREAK_ID,
                duration_sec: exercise.num_reps,
                workout_order_num: exercise.workout_order_num
            };

            reassembledPlan.breaks.push(reassembledBreak);
        } else {
            relevantExercise = exerciseData.find((obj) => {
              return obj.id === exercise.exercise_id;
            });

            if (typeof relevantExercise === "undefined") {
              throw "Required exercise data is missing for plan reconstruction! At a minimum, missing exercise id #" + exercise.exercise_id;
            }

            var reassembledExercise = {
                name: relevantExercise.name,
                exercise_id: relevantExercise.id,
                description: relevantExercise.description,
                major_muscle_group_id: relevantExercise.major_muscle_group_id,
                sets: exercise.num_sets,
                reps: exercise.num_reps,
                workout_order_num: exercise.workout_order_num
            };

            reassembledPlan.exercises.push(reassembledExercise);
        }
    }

    // Ensure data is in the correct order within the exercise and break lists
    reassembledPlan.exercises.sort((a,b) => a.workout_order_num - b.workout_order_num);
    reassembledPlan.breaks.sort((a,b) => a.workout_order_num - b.workout_order_num);

    // Add final additional data
    reassembledPlan.est_length_sec = oldWorkoutPlan.est_length_sec;
    reassembledPlan.associated_multiplier = oldWorkoutPlan.associated_multiplier;
    reassembledPlan.spottr_points = oldWorkoutPlan.spottr_points;

    return reassembledPlan;
}

async function adjustMultiplier(lengthOfWorkoutSec, workoutPlan, user, dbConfig) {
    var percentageDifference = lengthOfWorkoutSec / workoutPlan.est_length_sec;
    if (percentageDifference >= PERCENT_DIFF_RECALC_TRIGGER || percentageDifference <= (2 - PERCENT_DIFF_RECALC_TRIGGER)) {
        var userMultiplier = await data.getUserMultiplier(workoutPlan.major_muscle_group_id, user.user_multiplier_id, dbConfig);

        // Only trigger change if the workout they were doing was set at their level (ie not from "one upping" someone)
        if (userMultiplier === workoutPlan.associated_multiplier) {
            data.updateUserMultiplier(
                workoutPlan.major_muscle_group_id,
                await calculateNewMultiplier(percentageDifference, userMultiplier),
                user.user_multiplier_id,
                dbConfig
            );
        }
    }
}

module.exports = {
    // Generates a workout plan via the algorithm, perists it to the database, and returns it to the caller
    async generateWorkoutPlan(userId, lengthMinutes, targetMuscleGroup, dbConfig) {
        // Collect required data from different parts of the database
        const user = await userData.getUserByUserId(userId, dbConfig);
        const userMultiplier = await data.getUserMultiplier(targetMuscleGroup, user.user_multiplier_id, dbConfig);
        const possibleExercises = await data.getExercisesByTargetMuscleGroups(targetMuscleGroup, dbConfig);
        const workoutPlanId = await data.createWorkoutPlanEntry(dbConfig);

        var workoutPlan = generator.generateNewWorkoutPlan(
            lengthMinutes,
            possibleExercises,
            userMultiplier,
            workoutPlanId
        );

        data.updateWorkoutPlan(
            workoutPlan["workout_plan_id"],
            workoutPlan["est_length_sec"],
            targetMuscleGroup,
            workoutPlan["associated_multiplier"],
            workoutPlan["spottr_points"],
            dbConfig
        );
        data.createWorkoutExerciseEntries(workoutPlan, dbConfig);

        return new Promise(function(resolve) {
            resolve(workoutPlan);
        });
    },


    // Generates a workout plan which is slightly more difficult than another workout plan that
    // is passed as a parameter.
    //
    // The exercises in the new plan are the same, all that is changed is the number of reps per set.
    // As well, the difficulty added to the workout is also dependent on the user"s multiplier for
    // the given muscle group.
    async generateOneUpWorkoutPlan(userId, workoutPlanId, dbConfig) {
        // Collect data from given user and existing workout plan id and reassemble accordingly
        const oldWorkoutPlan = await data.getWorkoutPlanById(workoutPlanId, dbConfig);
        const exercisesInPlan = await data.getWorkoutExercisesByWorkoutPlanId(workoutPlanId, dbConfig);

        const user = await userData.getUserByUserId(userId, dbConfig);
        const userMultiplier = await data.getUserMultiplier(oldWorkoutPlan.major_muscle_group_id, user.user_multiplier_id, dbConfig);

        const exerciseData = await data.getExercisesByTargetMuscleGroups(oldWorkoutPlan.major_muscle_group_id, dbConfig);
        const reassembledWorkoutPlan = reassembleWorkoutPlan(oldWorkoutPlan, exercisesInPlan, exerciseData);

        // Create new workout plan entry for the "one-up" plan
        const newWorkoutPlanId = await data.createWorkoutPlanEntry(dbConfig);

        // Create the new plan, and record the generated data in the database
        var workoutPlan = generator.generateOneUpWorkoutPlan(
            reassembledWorkoutPlan,
            userMultiplier,
            newWorkoutPlanId
        );

        data.updateWorkoutPlan(
            workoutPlan["workout_plan_id"],
            workoutPlan["est_length_sec"],
            oldWorkoutPlan["major_muscle_group_id"],
            workoutPlan["associated_multiplier"],
            workoutPlan["spottr_points"],
            dbConfig
        );
        data.createWorkoutExerciseEntries(workoutPlan, dbConfig);

        return workoutPlan;
    },


    // Changes a user"s multiplier for a given muscle group by a given factor
    async modifyWorkoutDifficulty(userId, targetMuscleGroup, changeFactor, dbConfig) {
        // Collect current multiplier
        const user = await userData.getUserByUserId(userId, dbConfig);
        var userMultiplier = await data.getUserMultiplier(targetMuscleGroup, user.user_multiplier_id, dbConfig);

        // Generate new multiplier, upsert data, return success response
        userMultiplier += (MULTIPLIER_STEPS * changeFactor);
        if (userMultiplier < MIN_MULTIPLIER) {
          userMultiplier = MIN_MULTIPLIER;
        }

        await data.updateUserMultiplier(targetMuscleGroup, userMultiplier, user.user_multiplier_id, dbConfig);

        return new Promise(function(resolve) {
            resolve(constants.SUCCESS_RESPONSE);
        });
    },


    // Records a workout as complete for a given user. As a result, the user"s multiplier may be updated, a Firebase
    // notification is sent to other users, and associated data is added to the database to record the workout as complete.
    async completeWorkout(userId, lengthOfWorkoutSec, workoutPlanId, dbConfig) {
        // Generate new entry in the workout history table for completed workout
        const workoutPlan = await data.getWorkoutPlanById(workoutPlanId, dbConfig);
        const workoutHistoryId = await data.createWorkoutHistoryEntry(workoutPlan, lengthOfWorkoutSec, userId, dbConfig);
        const workoutHistory = await data.getWorkoutHistoryById(workoutHistoryId, dbConfig);

        // Increment the user"s Spottr Points
        const user = await userData.getUserByUserId(userId, dbConfig);
        userData.updateUserSpottrPoints(userId, user.spottr_points + workoutPlan.spottr_points, dbConfig);

        // Send message to Firebase so other user"s are notified in real-time
        let firebaseErr = null;
        try { await firebaseService.sendWorkoutToFirebase(workoutHistory, user.name, user.google_profile_image, dbConfig); }
        catch(err) { firebaseErr = err; }
        
        // Adjust user's multiplier (if they were reasonably off the estimated workout time)
        await adjustMultiplier(lengthOfWorkoutSec, workoutPlan, user, dbConfig);

        if (firebaseErr !== null) {
            throw ("Workout was completed successfully, however, an error was encountered while sending the messages to firebase. Message: " + firebaseErr);
        }
        return new Promise (function (resolve) {
            resolve(1);
        });
    },

    async getAllMuscleGroups(dbConfig) {
        let res = await data.getAllMuscleGroups(dbConfig);
        return new Promise(async (resolve) => resolve(res));
    },

    // Returns a given number of entries, formatted in a list of the same objects as the
    // firebase notification data
    async getWorkoutHistory(dbConfig, numEntries) {
        if (typeof numEntries == "undefined" || isNaN(numEntries)) {
            numEntries = DEFAULT_WORKOUT_HISTORY_ENTRIES;
        }

        let workoutHistory = await data.getRecentWorkoutHistory(dbConfig, numEntries);
        let ret = [];
        
        for (let i = 0; i < workoutHistory.length; i++) {
            ret.push(firebaseService.generateWorkoutHistoryMessage(
                workoutHistory[parseInt(i, 10)]["name"],
                workoutHistory[parseInt(i, 10)]["google_profile_image"],
                workoutHistory[parseInt(i, 10)]["user_profile_id"].toString(),
                new Date(workoutHistory[parseInt(i, 10)]["date_time_utc"]).toUTCString(),
                workoutHistory[parseInt(i, 10)]["actual_length_sec"].toString(),
                workoutHistory[parseInt(i, 10)]["major_muscle_group_id"].toString(),
                workoutHistory[parseInt(i, 10)]["spottr_points"].toString(),
                workoutHistory[parseInt(i, 10)]["workout_plan_id"].toString()
            ));
        }

        return new Promise(function(resolve) {
            resolve(ret);
        });
    },

    async getWorkoutPlanById (dbConfig, workoutPlanId) {
        var oldWorkoutPlan = await data.getWorkoutPlanById(workoutPlanId, dbConfig);
        var oldWorkoutExercises = await data.getWorkoutExercisesByWorkoutPlanId(workoutPlanId);
        var exerciseData = await data.getExercisesByTargetMuscleGroups(oldWorkoutPlan.major_muscle_group_id, dbConfig);

        return new Promise(async function(resolve) {
            resolve(reassembleWorkoutPlan(oldWorkoutPlan, oldWorkoutExercises, exerciseData));
        });
    }
};
