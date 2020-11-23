
const exercises = [{
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
}];

const breaks = [{
    "name": "Rest",
    "exercise_id": "20",
    "duration_sec": 17,
    "workout_order_num": 1
}];

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
    "associated_multiplier": 1,
    "spottr_points": 1225
};

module.exports = {
    async getUserMultiplier(targetMuscleGroup, multiplierId, dbConfig) {
        return 1;
    },
    async getExercisesByTargetMuscleGroups(targetMuscleGroup, dbConfig) {
        return exercises;
    },
    async createWorkoutPlanEntry(dbConfig) {
        return 1;
    },
    async updateWorkoutPlan(workoutPlanId, estLenSec, majorMuscleGroupId, associatedMultiplier, spottrPoints, dbConfig) {

    },
    async createWorkoutExerciseEntries(workoutPlan, dbConfig){

    },
    async getWorkoutPlanById(workoutPlanId, dbConfig) {
        if (workoutPlanId === 1) {
            return workoutPlan;
        }
        else {
            return {};
        }
    },
    async getWorkoutExercisesByWorkoutPlanId(workoutPlanId, dbConfig) {
        if(workoutPlanId === 1){
            return exercises;
        }
        else {
            return {};
        }
    },
    async updateUserMultiplier(targetMuscleGroup, newMultiplier, userMultiplierId, dbConfig) {

    },
    async createWorkoutHistoryEntry(workoutPlan, lengthOfWorkoutSec, userId, dbConfig) {
        return 1;
    },
    async getWorkoutHistoryById(workoutHistoryId, dbConfig) {
        return {};
    },
    async getAllMuscleGroups(dbConfig) {
        return [{"id":1,"name":"Arms"},{"id":3,"name":"Rest"}];
    },
    async getRecentWorkoutHistory(dbConfig, numEntries){
        return "workoutHistory";
    }

};