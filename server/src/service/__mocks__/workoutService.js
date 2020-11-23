const constants = require("../../constants.js");
const util = require("../../util.js");

const workoutPlan = {
    "workout_plan_id": 101,
    "exercises": [{
        "name": "Floor Dips",
        "description": "Sit on the floor with your knees bent and hands at your sides, directly underneath your shoulders. Hoist your hips off the floor, like a crab. Next, bend your elbows and lower yourself toward the floor (without touching it), then straighten your arms.",
        "major_muscle_group_id": 1,
        "exercise_id": 6,
        "sets": 3,
        "reps": 18,
        "workout_order_num": 0
    }, {
        "name": "Burpee With Push-up",
        "description": "Perform a burpee with a push-up.",
        "major_muscle_group_id": 1,
        "exercise_id": 5,
        "sets": 2,
        "reps": 12,
        "workout_order_num": 52
    }, {
        "name": "Floor Dips",
        "description": "Sit on the floor with your knees bent and hands at your sides, directly underneath your shoulders. Hoist your hips off the floor, like a crab. Next, bend your elbows and lower yourself toward the floor (without touching it), then straighten your arms.",
        "major_muscle_group_id": 1,
        "exercise_id": 6,
        "sets": 2,
        "reps": 18,
        "workout_order_num": 54
    }],
    "breaks": [{
        "name": "Rest",
        "exercise_id": "20",
        "duration_sec": 17,
        "workout_order_num": 1
    }],
    "est_length_sec": 3605,
    "associated_multiplier": 1.225,
    "spottr_points": 1225
};

module.exports = {
    async generateWorkoutPlan(userId, lengthMinutes, targetMuscleGroup, dbConfig) {
        return new Promise(function(resolve, reject) {
            if (userId === 1 || userId === 2){
                resolve(workoutPlan);
            }
            else {
                reject(constants.ERROR_RESPONSE);
            }
        });
    },

    async generateOneUpWorkoutPlan(userId, workoutPlanId, dbConfig) {
        return new Promise(function(resolve, reject) {
            util.roundToThree(10);
            if(userId === 1 || userId === 2){
                resolve(workoutPlan);
            }
            else{
                reject(constants.ERROR_RESPONSE);
            }
        });
    },

    async modifyWorkoutDifficulty(userId, targetMuscleGroup, changeFactor, dbConfig) {
        return new Promise(function(resolve, reject) {
            if (userId === 1 || userId === 2) {
                resolve(constants.SUCCESS_RESPONSE);
            }
            else {
                reject(constants.ERROR_RESPONSE);
            }
        });
    },

    async completeWorkout(userId, lengthOfWorkoutSec, workoutPlanId, dbConfig) {
        return new Promise(function(resolve, reject) {
            if(userId === 1 || userId === 2) {
                resolve(1);
            }
            else {
                reject(constants.ERROR_RESPONSE);
            }
        });
    },

    async getAllMuscleGroups(dbConfig) {
        return new Promise(function(resolve) {
            resolve([{"id":1,"name":"Arms"},{"id":3,"name":"Rest"}]);
        });
    },

    async getWorkoutHistory(dbConfig, numEntries) {
        return new Promise(function(resolve, reject) {
            if(numEntries >= 0){
                resolve([
                    {"id":1,"user_profile_id":37,"workout_plan_id":93,"actual_length_sec":1100,"major_muscle_group_id":1,"spottr_points":235,"date_time_utc":"2020-10-29T08:42:10.000Z"},
                    {"id":2,"user_profile_id":37,"workout_plan_id":93,"actual_length_sec":1100,"major_muscle_group_id":1,"spottr_points":235,"date_time_utc":"2020-10-29T09:15:46.000Z"}
                ]);
            }
            else {
                reject(constants.ERROR_RESPONSE);
            }
        });
    },

    async getWorkoutPlanById (dbConfig, workoutPlanId){
        return new Promise(function(resolve, reject) {
            if (parseInt(workoutPlanId,10) === parseInt(1,10) || parseInt(workoutPlanId, 10) === parseInt(2, 10)) {
                resolve(workoutPlan);
            }
            else {
                reject(constants.ERROR_RESPONSE);
            }
        });
    }
};