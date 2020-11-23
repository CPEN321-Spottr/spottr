const constants = require("../constants.js");
const workoutService = require("../service/workoutService");

jest.mock("../data/workoutData.js");
jest.mock("../data/userData.js");
jest.mock("../data/userMultiplierData.js");
jest.mock("../service/firebaseService.js");

const dbConfig = {};

var userId = 1;

var workoutPlanResponse = {
    "associated_multiplier": 1, 
    "breaks": [], 
    "est_length_sec": NaN, 
    "exercises":[
        {
            "description": "Perform a burpee with a push-up.",
            "major_muscle_group_id": 1,
            "name": "Burpee With Push-up",
            "reps": null,
            "sets": NaN,
            "workout_order_num": 0,
        },
    ],
    "spottr_points": NaN, 
    "workout_plan_id": 1
};

var oneUpWorkoutPlanResponse = {
    "associated_multiplier": 1.1,
    "breaks": [],
    "est_length_sec": 3605,
    "exercises": [
        {
            "description": "Sit on the floor with your knees bent and hands at your sides, directly underneath your shoulders. Hoist your hips off the floor, like a crab. Next, bend your elbows and lower yourself toward the floor (without touching it), then straighten your arms.",
            "major_muscle_group_id": 1,
            "name": "Floor Dips",
            "reps": NaN,
            "workout_order_num": 0,
        },
        {
            "description": "Sit on the floor with your knees bent and hands at your sides, directly underneath your shoulders. Hoist your hips off the floor, like a crab. Next, bend your elbows and lower yourself toward the floor (without touching it), then straighten your arms.",
            "major_muscle_group_id": 1,
            "name": "Floor Dips",
            "reps": NaN,
            "workout_order_num": 52,
        },
        {
            "description": "Sit on the floor with your knees bent and hands at your sides, directly underneath your shoulders. Hoist your hips off the floor, like a crab. Next, bend your elbows and lower yourself toward the floor (without touching it), then straighten your arms.",
            "major_muscle_group_id": 1,
            "name": "Floor Dips",
            "reps": NaN,
            "workout_order_num": 54,
        },
    ],
    "spottr_points": 1100,
    "workout_plan_id": 1,
};

const workoutPlanById = {
    "associated_multiplier": 1, 
    "breaks": [], 
    "est_length_sec": 3605, 
    "exercises": [
        {
            "description": "Sit on the floor with your knees bent and hands at your sides, directly underneath your shoulders. Hoist your hips off the floor, like a crab. Next, bend your elbows and lower yourself toward the floor (without touching it), then straighten your arms.", 
            "exercise_id": undefined, 
            "major_muscle_group_id": 1, 
            "name": "Floor Dips", 
            "reps": undefined, 
            "sets": undefined, 
            "workout_order_num": 0
        }, 
        {
            "description": "Sit on the floor with your knees bent and hands at your sides, directly underneath your shoulders. Hoist your hips off the floor, like a crab. Next, bend your elbows and lower yourself toward the floor (without touching it), then straighten your arms.", 
            "exercise_id": undefined, 
            "major_muscle_group_id": 1, 
            "name": "Floor Dips", 
            "reps": undefined, 
            "sets": undefined, 
            "workout_order_num": 52
        }, 
        {
            "description": "Sit on the floor with your knees bent and hands at your sides, directly underneath your shoulders. Hoist your hips off the floor, like a crab. Next, bend your elbows and lower yourself toward the floor (without touching it), then straighten your arms.", 
            "exercise_id": undefined, 
            "major_muscle_group_id": 1, 
            "name": "Floor Dips", 
            "reps": undefined, 
            "sets": undefined, 
            "workout_order_num": 54
        }
    ], 
    "spottr_points": 1225, 
    "workout_plan_id": undefined
};

describe("Generate Workout Plan Tests", () => {
    it("generate workout plan with valid parameters - check multiplier", () => {
        return workoutService.generateWorkoutPlan(userId, 20, 1, dbConfig)
            .then((data) => expect(data.associated_multiplier).toEqual(workoutPlanResponse.associated_multiplier));
    });
    it("generate workout plan with valid parameters - check spottr points", () => {
        return workoutService.generateWorkoutPlan(userId, 20, 1, dbConfig)
            .then((data) => expect(data.spottr_points).toEqual(workoutPlanResponse.spottr_points));
    });
});

describe("Generate One Up Workout Plan Tests", () => {
    it("generate one up workout plan with valid parameters", () => {
        return workoutService.generateOneUpWorkoutPlan(userId, 1, dbConfig)
            .then((data) => expect(data).toEqual(oneUpWorkoutPlanResponse));
    });
});

describe("Modify Workout Difficulty Tests", () => {
    it("modify workout difficulty with valid parameters", () => {
        return workoutService.modifyWorkoutDifficulty(userId, 1, -1000, dbConfig)
            .then((data) => expect(data).toEqual(constants.SUCCESS_RESPONSE));
    });
});

describe("Complete Workout Tests", () => {
    it("complete workout with valid parameters", () => {
        return workoutService.completeWorkout(userId, 20, 1, dbConfig)
            .then((data) => expect(data).toEqual(1));
    });
});

describe("Get all Muscle Groups Test", () => {
    it("get all muscle groups with valid parameters", () => {
        return workoutService.getAllMuscleGroups(dbConfig)
            .then((data) => expect(data).toEqual([{"id":1,"name":"Arms"},{"id":3,"name":"Rest"}]));
    });
});

describe("Get Workout History Tests", () => {
    it("get workout history with valid num entries", () => {
        return workoutService.getWorkoutHistory(dbConfig, 3)
            .then((data) => expect(data).toEqual("workoutHistory"));
    });
    it("get workout history with invalid num entries", () => {
        return workoutService.getWorkoutHistory(dbConfig, "notANumber")
            .then((data) => expect(data).toEqual("workoutHistory"));
    });
});

describe("Get workout plan by ID Tests", () => {
    it("get workout plan by id with valid parameters", () => {
        return workoutService.getWorkoutPlanById (dbConfig, 1)
            .then((data) => expect(data).toEqual(workoutPlanById));
    });
});

