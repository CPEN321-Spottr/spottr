const workoutData = require("../data/workoutData.js");
const userData = require("../data/userData.js");
const firebaseService = require("../service/firebaseService.js");
const tokenData = require("../data/tokenData.js");
const userMultiplerData = require("../data/userMultiplierData.js");
const request = require("supertest");
const util = require("../util.js");
const app = require("../../server");

// Mock data
const mockTokenUser1 = {
    "sub": 12312321312312,
    "email": "test.user@gmail.com",
    "name": "Jim Bob Joe John Jake"
};
const mockUser1 = {
    "id": 37,
    "name": mockTokenUser1.name,
    "email": mockTokenUser1.email,
    "user_multiplier_id": 23,
    "google_user_id": "12131231231221233",
    "spottr_points": 940
};
const mockUser1Multiplier = 1.200;
const mockWorkoutPlan1 = {
    "workout_plan_id": 93,
    "exercises": [], // not needed 
    "breaks": [], // not needed
    "est_length_sec": 1184,
    "associated_multiplier": 0.875,
    "spottr_points": 235
};
const mockWorkoutHistory1 = {
    "id": 1,
    "user_profile_id": mockUser1.id,
    "workout_plan_id": mockWorkoutPlan1.workout_plan_id,
    "actual_length_sec": 1100,
    "major_muscle_group_id": 1,
    "spottr_points": 235,
    "date_time_utc": "2020-10-29T08:42:10.000Z"
};
const mockPossibleExercises1 = [
    {
        "id": 1,
        "name": "Plank Tap",
        "description": "description",
        "std_reps": 20,
        "std_reps_time_sec": 45,
        "major_muscle_group_id": 1,
        "std_sets": 3
    },
    {
        "id": 2,
        "name": "Push Ups",
        "description": "description",
        "std_reps": 10,
        "std_reps_time_sec": 30,
        "major_muscle_group_id": 1,
        "std_sets": 3
    },
    {
        "id": 3,
        "name": "Arm Circles",
        "description": "description",
        "std_reps": 20,
        "std_reps_time_sec": 20,
        "major_muscle_group_id": 1,
        "std_sets": 4
    }
];

jest.mock("../data/workoutData.js");
jest.mock("../data/userData.js");
jest.mock("../data/tokenData.js");
jest.mock("../data/userMultiplierData.js");

describe("POST /token (User Google Authentication)", function() {
    // Set up testing state and mock data
    afterAll(() => { app.close(); });

    beforeEach(() => {
        tokenData.verifyToken.mockResolvedValue(mockTokenUser1);
        userData.createUser.mockResolvedValue(mockUser1.id);
        userData.getUserByUserId.mockResolvedValue(mockUser1);
    });

    // Execute tests
    it("expect new user generated and returned (existing id not found)", async () => {
        tokenData.getUserByGoogleID.mockResolvedValue([]);

        const res = await request(app)
            .post("/token")
            .set({"Accept": "application/json", "authorization": "138123912"})
            .send();

        // Check response
        expect(res.statusCode).toEqual(200);

        expect(res.body.email === mockUser1.email);
        expect(res.body.google_user_id === mockUser1.google_user_id);
        expect(res.body.id === mockUser1.id);
        expect(res.body.name === mockUser1.name);
        expect(res.body.spottr_points === mockUser1.spottr_points);
        expect(res.body.user_multiplier_id === mockUser1.user_multiplier_id);
    });

    it("expect existing user returned (user already exists)", async () => {
        tokenData.getUserByGoogleID.mockResolvedValue([mockUser1]);

        const res = await request(app)
            .post("/token")
            .set({"Accept": "application/json", "authorization": "138123912"})
            .send();

        // Check response
        expect(res.statusCode).toEqual(200);

        expect(res.body.email === mockUser1.email);
        expect(res.body.google_user_id === mockUser1.google_user_id);
        expect(res.body.id === mockUser1.id);
        expect(res.body.name === mockUser1.name);
        expect(res.body.spottr_points === mockUser1.spottr_points);
        expect(res.body.user_multiplier_id === mockUser1.user_multiplier_id);
    });
});

describe("GET /users/:userId/workout/generate-plan/ (Generate Suggested Workout)", function() {
    // Set up testing state and mock data
    afterAll(() => { app.close(); });

    let mockUser;
    let addedWorkoutPlan;
    let addedWorkoutEntries;

    let mockCreateWorkoutPlan;
    let mockCreateWorkoutEntries;
    let mockUpdateWorkoutPlan;

    beforeEach(() => {
        mockUser = util.clone(mockUser1);

        workoutData.getExercisesByTargetMuscleGroups.mockResolvedValue(util.clone(mockPossibleExercises1));
        workoutData.getUserMultiplier.mockResolvedValue(util.clone(mockUser1Multiplier));
        userData.getUserByUserId.mockResolvedValue(mockUser);

        mockCreateWorkoutPlan = jest
            .spyOn(workoutData, "createWorkoutPlanEntry")
            .mockImplementation((dbConfig) => {
                addedWorkoutPlan = {id:1};
                return addedWorkoutPlan.id;
            });
        
        mockUpdateWorkoutPlan = jest
            .spyOn(workoutData, "updateWorkoutPlan")
            .mockImplementation((workoutPlanId, estLenSec, majorMuscleGroupId, associatedMultiplier, spottrPoints, dbConfig) => {
                addedWorkoutPlan.workoutPlanId = workoutPlanId;
                addedWorkoutPlan.estLenSec = estLenSec;
                addedWorkoutPlan.majorMuscleGroupId = majorMuscleGroupId;
                addedWorkoutPlan.associatedMultiplier = associatedMultiplier;
                addedWorkoutPlan.spottrPoints = spottrPoints;    
            });

        mockCreateWorkoutEntries = jest
            .spyOn(workoutData, "createWorkoutExerciseEntries")
            .mockImplementation((workoutPlan, dbConfig) => {
                addedWorkoutEntries = workoutPlan;
            });
    });

    afterEach(() => {
        mockCreateWorkoutEntries.mockRestore();
        mockUpdateWorkoutPlan.mockRestore();
        mockCreateWorkoutPlan.mockRestore();
    });

    // Execute tests
    it("expect plan to be generated successfully", async () => {
        let workoutLength = 30;
        let workoutType = 1;

        let path = "/users/" + mockUser1.id + "/workout/generate-plan/" + workoutLength + "&" + workoutType;
        const res = await request(app)
            .get(path)
            .set("Accept", "application/json")
            .send();

        // Check response
        expect(res.statusCode).toEqual(200);
        
        expect(mockCreateWorkoutPlan).toHaveBeenCalled();
        expect(mockUpdateWorkoutPlan).toHaveBeenCalled();
        expect(mockCreateWorkoutEntries).toHaveBeenCalled();

        // Check the generated data and "database" data to ensure accuracy
        expect(res.body.associated_multiplier === mockUser1Multiplier 
            && res.body.associated_multiplier === addedWorkoutEntries.associated_multiplier);
        expect(res.body.breaks.length > 0 && res.body.breaks === addedWorkoutEntries.breaks);
        expect(res.body.exercises.length > 0 && res.body.exercises === addedWorkoutEntries.exercises);
        expect((workoutLength * 60 * 1.1) > res.body.est_length_sec && res.body.est_length_sec > (workoutLength * 60)
            && res.body.est_length_sec === addedWorkoutEntries.est_length_sec);
        expect(res.body.spottr_points > 0 && res.body.spottr_points === addedWorkoutEntries.spottr_points);
        expect(res.body.workout_plan_id === 1 && res.body.workout_plan_id === addedWorkoutEntries.workout_plan_id);
    });
});

describe("POST /users/:userId/workout/complete/ (Complete Workout)", function() {
    // Set up testing state and mock data
    afterAll(() => { app.close(); });

    let mockUpdateUserSpottrPoints;
    let mockUpdateUserMultiplier;
    let mockUser;
    let mockMultiplier;

    beforeEach(() => {
        mockUser = util.clone(mockUser1);
        mockMultiplier = util.clone(mockUser1Multiplier);

        workoutData.getWorkoutPlanById.mockResolvedValue(mockWorkoutPlan1);
        workoutData.getWorkoutHistoryById.mockResolvedValue(mockWorkoutHistory1);
        workoutData.createWorkoutHistoryEntry.mockResolvedValue(mockWorkoutHistory1.id);
        workoutData.getUserMultiplier.mockResolvedValue(mockMultiplier);
        userData.getUserByUserId.mockResolvedValue(mockUser);

        mockUpdateUserSpottrPoints = jest
            .spyOn(userData, "updateUserSpottrPoints")
            .mockImplementation((userId, newAmount, dbConfig) => {
                mockUser.spottr_points = newAmount;
            });
        
        mockUpdateUserMultiplier = jest
            .spyOn(workoutData, "updateUserMultiplier")
            .mockImplementation((targetMuscleGroup, newMultiplier, userMultiplierId, dbConfig) => {
                mockMultiplier = newMultiplier;
            });

        // Only mock the firebase message API calls, leave the rest of the service alone
        firebaseService.sendFirebaseMessage = jest.fn();
    });

    afterEach(() => {
        mockUpdateUserSpottrPoints.mockRestore();
        mockUpdateUserMultiplier.mockRestore();
    });

    // Execute tests
    it("expect workout to be successfully completed (firebase token valid)", async () => {
        // Set-up firebase API call to succeed
        firebaseService.sendFirebaseMessage.mockResolvedValue(1);

        let path = "/users/" + mockUser1.id + "/workout/complete/" + mockWorkoutHistory1.actual_length_sec + "&" + mockWorkoutPlan1.workout_plan_id;
        const res = await request(app)
            .post(path)
            .set("Accept", "application/json")
            .send();

        // Check response
        expect(res.statusCode).toEqual(200);

        // Check points were updated as expected
        let newExpectedPoints = parseInt(mockUser1.spottr_points, 10) + parseInt(mockWorkoutPlan1.spottr_points, 10);
        expect(mockUpdateUserSpottrPoints)
            .toHaveBeenCalledWith(
                mockUser1.id,
                newExpectedPoints,
                {}
            );
        expect(mockUser.spottr_points === newExpectedPoints);

        // Since workout was completed within margin of current skill, multiplier should remain the same
        expect(mockMultiplier === mockUser1Multiplier);
    });

    it("expect failed request (firebase token invalid)", async () => {
        // Set-up firebase API call to fail
        firebaseService.sendFirebaseMessage.mockResolvedValue(0);

        let path = "/users/" + mockUser1.id + "/workout/complete/" + mockWorkoutHistory1.actual_length_sec + "&" + mockWorkoutPlan1.workout_plan_id;
        const res = await request(app)
            .post(path)
            .set("Accept", "application/json")
            .send();

        // Check response
        expect(res.statusCode).toEqual(500);
    });
});

describe("GET /users (Retrieve All Users)", function() {
    // Set up test state
    afterAll(() => { app.close(); });

    // Set up database mocks
    userData.getUsers.mockResolvedValue({1: mockUser1});

    // Execute tests
    it("expect valid json response", function(done) {
      request(app)
        .get("/users")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200, done);
    });
});
