/*eslint-env jest*/

const workoutData = require("../data/workoutData.js");
const userData = require("../data/userData.js");
const firebaseData = require("../data/firebaseData.js");
const tokenData = require("../data/tokenData.js");
const userMultiplerData = require("../data/userMultiplierData.js");
const connection = require("../connection.js");
const request = require("supertest");
const testData = require("../data/__mocks__/integrationTestData.js");
const util = require("../util.js");
const app = require("../../server");


//
// Overide the mocks located in the ```__mocks__``` files
//

jest.mock("../data/workoutData.js", () => ({
    getExercisesByTargetMuscleGroups: jest.fn(),
    getUserMultiplier: jest.fn(),
    createWorkoutPlanEntry: jest.fn(),
    updateWorkoutPlan: jest.fn(),
    createWorkoutExerciseEntries: jest.fn(),
    getWorkoutPlanById: jest.fn(),
    getWorkoutHistoryById: jest.fn(),
    createWorkoutHistoryEntry: jest.fn(),
    updateUserMultiplier: jest.fn()
}));
jest.mock("../data/userData.js", () => ({
    getUserByUserId: jest.fn(),
    getUsers: jest.fn(),
    createUser: jest.fn(),
    updateUserSpottrPoints: jest.fn(),
    upsertUserMultiplier: jest.fn()
}));
jest.mock("../data/tokenData.js", () => ({
    getUserByGoogleID: jest.fn(),
    verifyToken: jest.fn()
}));
jest.mock("../data/userMultiplierData.js", () => ({
    getUserByGoogleID: jest.fn(),
    verifyToken: jest.fn(),
}));
jest.mock("../data/userMultiplierData.js", () => ({
    createUserMultipler: jest.fn()
}));
jest.mock("../data/firebaseData.js", () => ({
    sendFirebaseMessages: jest.fn(),
    getAllFirebaseTokens: jest.fn()
}));

jest.unmock("../connection.js");


//
// Actually perform the tests
//

describe("POST /token (User Google Authentication)", function() {
    // Set up testing state and mock data
    afterAll(() => { app.close(); });

    beforeEach(() => {
        tokenData.verifyToken.mockResolvedValue(testData.mockTokenUser1);
        userData.createUser.mockResolvedValue(testData.mockUser1.id);
        userData.getUserByUserId.mockResolvedValue(testData.mockUser1);
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

        expect(res.body.email === testData.mockUser1.email);
        expect(res.body.google_user_id === testData.mockUser1.google_user_id);
        expect(res.body.id === testData.mockUser1.id);
        expect(res.body.name === testData.mockUser1.name);
        expect(res.body.spottr_points === testData.mockUser1.spottr_points);
        expect(res.body.user_multiplier_id === testData.mockUser1.user_multiplier_id);
    });

    it("expect existing user returned (user already exists)", async () => {
        tokenData.getUserByGoogleID.mockResolvedValue([testData.mockUser1]);

        const res = await request(app)
            .post("/token")
            .set({"Accept": "application/json", "authorization": "138123912"})
            .send();

        // Check response
        expect(res.statusCode).toEqual(200);

        expect(res.body.email === testData.mockUser1.email);
        expect(res.body.google_user_id === testData.mockUser1.google_user_id);
        expect(res.body.id === testData.mockUser1.id);
        expect(res.body.name === testData.mockUser1.name);
        expect(res.body.spottr_points === testData.mockUser1.spottr_points);
        expect(res.body.user_multiplier_id === testData.mockUser1.user_multiplier_id);
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
        mockUser = util.clone(testData.mockUser1);

        workoutData.getExercisesByTargetMuscleGroups.mockResolvedValue(util.clone(testData.mockPossibleExercises1));
        workoutData.getUserMultiplier.mockResolvedValue(util.clone(testData.mockUser1Multiplier));
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

        let path = "/users/" + testData.mockUser1.id + "/workout/generate-plan?length-minutes=" + workoutLength
            + "&target-muscle-group=" + workoutType;
        const res = await request(app)
            .get(path)
            .set("Accept", "application/json")
            .type("form")
            .send();

        // Check response
        expect(res.statusCode).toEqual(200);
        
        expect(mockCreateWorkoutPlan).toHaveBeenCalled();
        expect(mockUpdateWorkoutPlan).toHaveBeenCalled();
        expect(mockCreateWorkoutEntries).toHaveBeenCalled();

        // Check the generated data and "database" data to ensure accuracy
        expect(res.body.associated_multiplier === testData.mockUser1Multiplier);
        expect(res.body.associated_multiplier === addedWorkoutEntries.associated_multiplier);

        expect(res.body.breaks.length > 0);
        expect(res.body.breaks === addedWorkoutEntries.breaks);

        expect(res.body.exercises.length > 0);
        expect(res.body.exercises === addedWorkoutEntries.exercises);
        
        expect(workoutLength * 60 * 1.1) > res.body.est_length_sec && res.body.est_length_sec > (workoutLength * 60);
        expect(res.body.est_length_sec === addedWorkoutEntries.est_length_sec);

        expect(res.body.spottr_points > 0);
        expect(res.body.spottr_points === addedWorkoutEntries.spottr_points);
        
        expect(res.body.workout_plan_id === 1);
        expect(res.body.workout_plan_id === addedWorkoutEntries.workout_plan_id);
    });
});

describe("POST /users/:userId/workout/complete/ (Complete Workout)", function() {
    // Set up testing state and mock data
    afterAll(() => { 
        jest.restoreAllMocks();
        app.close(); 
    });

    let mockUpdateUserSpottrPoints;
    let mockUpdateUserMultiplier;
    let mockUser;
    let mockMultiplier;

    beforeEach(() => {
        mockUser = util.clone(testData.mockUser1);
        mockMultiplier = util.clone(testData.mockUser1Multiplier);

        workoutData.getWorkoutPlanById.mockResolvedValue(testData.mockWorkoutPlan1);
        workoutData.getWorkoutHistoryById.mockResolvedValue(testData.mockWorkoutHistory1);
        workoutData.createWorkoutHistoryEntry.mockResolvedValue(testData.mockWorkoutHistory1.id);
        workoutData.getUserMultiplier.mockResolvedValue(testData.mockMultiplier);
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
    });

    afterEach(() => {
        mockUpdateUserSpottrPoints.mockRestore();
        mockUpdateUserMultiplier.mockRestore();
    });

    // Execute tests
    it("expect workout to be successfully completed (firebase token valid)", async () => {
        // Set-up firebase API call to succeed
        firebaseData.sendFirebaseMessages.mockReturnValue([]);

        let path = "/users/" + testData.mockUser1.id + "/workout/complete";
        const res = await request(app)
            .post(path)
            .set("Accept", "application/json")
            .type("form")
            .send({
                "length-seconds": testData.mockWorkoutHistory1.actual_length_sec,
                "workout-plan-id": testData.mockWorkoutPlan1.workout_plan_id
            });

        // Check response
        expect(res.statusCode).toEqual(200);

        // Check points were updated as expected
        let newExpectedPoints = parseInt(testData.mockUser1.spottr_points, 10) + parseInt(testData.mockWorkoutPlan1.spottr_points, 10);
        expect(mockUpdateUserSpottrPoints)
            .toHaveBeenCalledWith(
                testData.mockUser1.id,
                newExpectedPoints,
                connection.getDbConfig()
            );
        expect(mockUser.spottr_points === newExpectedPoints);

        // Since workout was completed within margin of current skill, multiplier should remain the same
        expect(mockMultiplier === testData.mockUser1Multiplier);
    });

    it("expect failed request (firebase token invalid)", async () => {
        // Set-up firebase API call to fail
        firebaseData.sendFirebaseMessages.mockReturnValue([1234, 123]);

        let path = "/users/" + testData.mockUser1.id + "/workout/complete";
        const res = await request(app)
            .post(path)
            .set("Accept", "application/json")
            .type("form")
            .send({
                "length-seconds": testData.mockWorkoutHistory1.actual_length_sec,
                "workout-plan-id": testData.mockWorkoutPlan1.workout_plan_id
            });

        // Check response
        expect(res.statusCode).toEqual(500);
    });
});

describe("GET /users (Retrieve All Users)", function() {
    afterAll(() => { 
        jest.restoreAllMocks();
        app.close(); 
    });

    // Execute tests
    it("expect valid response", function(done) {
        userData.getUsers.mockResolvedValue({1: testData.mockUser1});

        const res = request(app)
            .get("/users")
            .set("Accept", "application/json")
            .expect(200, done);

        // Check response
        expect(res.body === testData.mockUser1);
    });

    it("should fail with status code 500 (db error)", async function() {
        userData.getUsers.mockImplementationOnce(() => {
            throw "Error occured";
        });

        const res = await request(app)
            .get("/users")
            .set("Accept", "application/json")
            .send();

        // Check response
        expect(res.statusCode).toEqual(500);
        expect(res.body === "Error occured");
    });
});
