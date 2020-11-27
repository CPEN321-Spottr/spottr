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
    updateUserMultiplier: jest.fn(),
    getWorkoutExercisesByWorkoutPlanId: jest.fn(),
    getAllMuscleGroups: jest.fn(),
    getRecentWorkoutHistory: jest.fn()
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
    getAllFirebaseTokens: jest.fn(),
    createFirebaseTokenEntry: jest.fn()
}));
jest.mock("../connection.js", () => ({
    initializeFirebaseApp: jest.fn(),
    getGoogleAuthClientID: jest.fn(),
    getDbConfig: jest.fn()
}));


//
// Actually perform the tests
//

describe("GET /users (Retrieve All Users)", function() {
    afterAll(() => { 
        jest.restoreAllMocks();
        app.close(); 
    });

    // Execute tests
    it("expect valid response", async function() {
        userData.getUsers.mockResolvedValue({1: testData.mockUser1});

        const res = await request(app)
            .get("/users")
            .set("Accept", "application/json")
            .send();

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
        expect(res.text).toEqual("Error occured");
    });
});


describe("GET /users/:userId (Retrieve User By Id)", function() {
    afterAll(() => { 
        jest.restoreAllMocks();
        app.close(); 
    });

    // Execute tests
    it("expect valid response", async function() {
        userData.getUserByUserId.mockResolvedValue({1: testData.mockUser1});

        const res = await request(app)
            .get("/users/1")
            .set("Accept", "application/json")
            .send();

        // Check response
        expect(res.body).toEqual({"1": testData.mockUser1});
    });

    it("should fail with status code 500 (db error)", async function() {
        userData.getUserByUserId.mockImplementationOnce(() => {
            throw "Error occured";
        });

        const res = await request(app)
            .get("/users/1")
            .set("Accept", "application/json")
            .send();

        // Check response
        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual("Error occured");
    });
});


describe("POST /token (User Google Authentication)", function() {
    // Set up testing state and mock data
    afterAll(() => { 
        app.close();
        jest.restoreAllMocks(); 
    });

    beforeEach(() => {
        tokenData.verifyToken.mockResolvedValue(testData.mockTokenUser1);
        userData.createUser.mockResolvedValue(testData.mockUser1.id);
        userData.getUserByUserId.mockResolvedValue(testData.mockUser1);
    });

    // Execute tests
    it("expect new user generated and returned (existing id not found)", async () => {
        tokenData.getUserByGoogleID.mockResolvedValue({});

        const res = await request(app)
            .post("/token")
            .set({"Accept": "application/json", "authorization": "138123912"})
            .send();

        // Check response
        expect(res.statusCode).toEqual(200);

        expect(res.body.email).toEqual(testData.mockUser1.email);
        expect(res.body.google_user_id === testData.mockUser1.google_user_id).toBeTruthy();
        expect(res.body.id === testData.mockUser1.id).toBeTruthy();
        expect(res.body.name === testData.mockUser1.name).toBeTruthy();
        expect(res.body.spottr_points === testData.mockUser1.spottr_points).toBeTruthy();
        expect(res.body.user_multiplier_id === testData.mockUser1.user_multiplier_id).toBeTruthy();
    });

    it("expect existing user returned (user already exists)", async () => {
        tokenData.getUserByGoogleID.mockResolvedValue(testData.mockUser1);

        const res = await request(app)
            .post("/token")
            .set({"Accept": "application/json", "authorization": "138123912"})
            .send();

        // Check response
        expect(res.statusCode).toEqual(200);

        expect(res.body.email).toEqual(testData.mockUser1.email);
        expect(res.body.google_user_id === testData.mockUser1.google_user_id).toBeTruthy();
        expect(res.body.id === testData.mockUser1.id).toBeTruthy();
        expect(res.body.name === testData.mockUser1.name).toBeTruthy();
        expect(res.body.spottr_points === testData.mockUser1.spottr_points).toBeTruthy();
        expect(res.body.user_multiplier_id === testData.mockUser1.user_multiplier_id).toBeTruthy();
    });

    it("should fail with status code 500 (token verification error)", async function() {
        tokenData.verifyToken.mockImplementationOnce(() => {
            throw "Invalid token";
        });

        const res = await request(app)
            .post("/token")
            .set({"Accept": "application/json", "authorization": "138123912"})
            .send();

        // Check response
        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual("Invalid token");
    });

    it("should fail with status code 500 (db error)", async function() {
        tokenData.getUserByGoogleID.mockImplementationOnce(() => {
            throw "Error obtaining user by Google Id";
        });

        const res = await request(app)
            .post("/token")
            .set({"Accept": "application/json", "authorization": "138123912"})
            .send();

        // Check response
        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual("Error obtaining user by Google Id");
    });

    it("should fail with status code 500 (missing 'authorization' in header)", async function() {
        const res = await request(app)
            .post("/token")
            .set({"Accept": "application/json"})
            .send();

        // Check response
        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual("'authorization' is expected in the header but was not found!");
    });
});


describe("POST /firebase-token (Record User Firebase Token)", function() {
    // Set up testing state and mock data
    afterAll(() => { app.close(); });

    it("expect data added successfully (OK response)", async () => {
        const res = await request(app)
            .post("/firebase-token")
            .type("form")
            .send({
                "firebase-token": "12312312asdasd12312"
            });

        // Check response
        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual("OK");
    });

    it("should fail with status code 500 (db error)", async function() {
        firebaseData.createFirebaseTokenEntry.mockImplementationOnce(() => {
            throw "Error occured";
        });

        const res = await request(app)
            .post("/firebase-token")
            .type("form")
            .send({
                "firebase-token": "12312312asdasd12312"
            });

        // Check response
        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual("Error occured");
    });

    it("should fail with status code 500 (missing 'firebase-token' in body)", async function() {
        const res = await request(app)
            .post("/firebase-token")
            .type("form")
            .send();

        // Check response
        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual("Expected the parameters: [firebase-token] but found 0 parameters in the body");
    });

    it("should fail with status code 500 (missing value for 'firebase-token' in body)", async function() {
        const res = await request(app)
            .post("/firebase-token")
            .type("form")
            .send({
                "firebase-token": ""
            });

        // Check response
        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual("'firebase-token' was present, but had no value. A value must be provided");
    });
});


describe("GET /users/:userId/workout/generate-plan/ (Generate Suggested Workout)", function() {
    // Set up testing state and mock data
    afterAll(() => { 
        app.close();
        jest.restoreAllMocks(); 
    });

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
    it("expect plan to be generated successfully, multiplier above 1", async () => {
        let workoutLength = 33;
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
        expect(res.body.associated_multiplier === testData.mockUser1Multiplier).toBeTruthy();
        expect(res.body.associated_multiplier === addedWorkoutEntries.associated_multiplier).toBeTruthy();

        expect(res.body.breaks.length > 0).toBeTruthy();
        expect(res.body.breaks).toMatchObject(addedWorkoutEntries.breaks);

        expect(res.body.exercises.length > 0).toBeTruthy();
        expect(res.body.exercises).toMatchObject(addedWorkoutEntries.exercises);
        
        expect(workoutLength * 60 * 1.1) > res.body.est_length_sec && res.body.est_length_sec > (workoutLength * 60).toBeTruthy();
        expect(res.body.est_length_sec === addedWorkoutEntries.est_length_sec).toBeTruthy();

        expect(res.body.spottr_points > 0).toBeTruthy();
        expect(res.body.spottr_points === addedWorkoutEntries.spottr_points).toBeTruthy();
        
        expect(res.body.workout_plan_id === 1).toBeTruthy();
        expect(res.body.workout_plan_id === addedWorkoutEntries.workout_plan_id).toBeTruthy();
    });

    it("expect plan to be generated successfully, multiplier below 1", async () => {
        workoutData.getUserMultiplier.mockResolvedValue(0.4);
        
        let workoutLength = 49;
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
        expect(res.body.associated_multiplier === 0.4).toBeTruthy();
        expect(res.body.associated_multiplier === addedWorkoutEntries.associated_multiplier).toBeTruthy();

        expect(res.body.breaks.length > 0).toBeTruthy();
        expect(res.body.breaks).toMatchObject(addedWorkoutEntries.breaks);

        expect(res.body.exercises.length > 0);
        expect(res.body.exercises).toMatchObject(addedWorkoutEntries.exercises);
        
        expect(workoutLength * 60 * 1.1) > res.body.est_length_sec && res.body.est_length_sec > (workoutLength * 60).toBeTruthy();
        expect(res.body.est_length_sec === addedWorkoutEntries.est_length_sec).toBeTruthy();

        expect(res.body.spottr_points > 0).toBeTruthy();
        expect(res.body.spottr_points === addedWorkoutEntries.spottr_points).toBeTruthy();
        
        expect(res.body.workout_plan_id === 1).toBeTruthy();
        expect(res.body.workout_plan_id === addedWorkoutEntries.workout_plan_id).toBeTruthy();
    });

    it("should fail with status code 500 (missing 'target-muscle-group' in query)", async () => {
        let path = "/users/1/workout/generate-plan?length-minutes=60";
        const res = await request(app)
            .get(path)
            .set("Accept", "application/json")
            .type("form")
            .send();

        // Check response
        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual("'target-muscle-group' is expected in the query but was not found!");
    });

    it("should fail with status code 500 (missing 'length-minutes' in query)", async () => {
        let path = "/users/1/workout/generate-plan?target-muscle-group=1";
        const res = await request(app)
            .get(path)
            .set("Accept", "application/json")
            .type("form")
            .send();

        // Check response
        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual("'length-minutes' is expected in the query but was not found!");
    });

    it("should fail with status code 500 (missing all expected param in query)", async () => {
        let path = "/users/1/workout/generate-plan";
        const res = await request(app)
            .get(path)
            .set("Accept", "application/json")
            .type("form")
            .send();

        // Check response
        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual("Expected the parameters: [length-minutes,target-muscle-group] but found 0 parameters in the query");
    });

    it("should fail with status code 500 (unexpected non-int in query)", async () => {
        let path = "/users/1/workout/generate-plan?target-muscle-group=1&length-minutes='asdasdaqsd'";
        const res = await request(app)
            .get(path)
            .set("Accept", "application/json")
            .type("form")
            .send();

        // Check response
        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual("Expected 'length-minutes' to be an int, but was not!");
    });
});


describe("GET /users/:userId/workout/one-up/:workoutPlanId (Generate One-Up Workout)", function () {
    // Set up testing state and mock data
    afterAll(() => { 
        app.close(); 
        jest.restoreAllMocks();
    });

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
        workoutData.getWorkoutPlanById.mockResolvedValue(util.clone(testData.mockWorkoutPlan1DatebaseVersion));
        workoutData.getWorkoutExercisesByWorkoutPlanId.mockResolvedValue(util.clone(testData.mockWorkoutPlan1DatebaseVersion.exercises));

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
        let path = "/users/" + testData.mockUser1.id + "/workout/one-up/" + testData.mockWorkoutPlan1.workout_plan_id;
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
        expect(res.body.associated_multiplier > testData.mockWorkoutPlan1.associated_multiplier).toBeTruthy();
        expect(res.body.associated_multiplier === addedWorkoutEntries.associated_multiplier).toBeTruthy();

        expect(res.body.breaks.length > 0).toBeTruthy();
        expect(res.body.breaks).toMatchObject(addedWorkoutEntries.breaks);

        expect(res.body.exercises.length > 0).toBeTruthy();
        expect(res.body.exercises).toMatchObject(addedWorkoutEntries.exercises);
        
        expect(testData.mockWorkoutPlan1.est_length_sec === res.body.est_length_sec).toBeTruthy();
        expect(res.body.est_length_sec === addedWorkoutEntries.est_length_sec).toBeTruthy();

        expect(res.body.spottr_points > 0).toBeTruthy();
        expect(res.body.spottr_points === addedWorkoutEntries.spottr_points).toBeTruthy();
        expect(addedWorkoutEntries.spottr_points > testData.mockWorkoutPlan1.spottr_points).toBeTruthy();
        
        expect(res.body.workout_plan_id === 1).toBeTruthy();
        expect(res.body.workout_plan_id === addedWorkoutEntries.workout_plan_id).toBeTruthy();
    });

    it("should fail with status code 500 (db error)", async function() {
        workoutData.getWorkoutPlanById.mockImplementationOnce(() => {
            throw "Error obtaining workout plan";
        });
        
        let path = "/users/" + testData.mockUser1.id + "/workout/one-up/" + testData.mockWorkoutPlan1.workout_plan_id;
        const res = await request(app)
            .get(path)
            .set("Accept", "application/json")
            .type("form")
            .send();

        // Check response
        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual("Error obtaining workout plan");
    });

    it("should fail with status code 500 (missing expected db data)", async function() {
        workoutData.getExercisesByTargetMuscleGroups.mockResolvedValue([{}]);
        
        let path = "/users/" + testData.mockUser1.id + "/workout/one-up/" + testData.mockWorkoutPlan1.workout_plan_id;
        const res = await request(app)
            .get(path)
            .set("Accept", "application/json")
            .type("form")
            .send();

        // Check response
        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual("Required exercise data is missing for plan reconstruction! At a minimum, missing exercise id #2");
    });
});


describe("PUT /users/:userId/workout/change-difficulty (Change User Workout Difficulty)", function() {
    // Set up testing state and mock data
    afterAll(() => { 
        app.close();
        jest.restoreAllMocks(); 
    });

    let multiplier;

    beforeEach(() => {
        multiplier = util.clone(testData.mockUser1Multiplier);

        workoutData.getUserMultiplier.mockResolvedValue(multiplier);
        userData.getUserByUserId.mockResolvedValue(util.clone(testData.mockUser1));

        jest.spyOn(workoutData, "updateUserMultiplier")
            .mockImplementation((targetMuscleGroup, newMultiplier, userMultiplierId, dbConfig) => {
                expect(targetMuscleGroup === 1);
                expect(userMultiplierId === testData.mockUser1.id);
                multiplier = newMultiplier;
            });
    });

    it("expect difficulty successfully changed, increment normal amount (OK response)", async () => {
        const res = await request(app)
            .put("/users/37/workout/change-difficulty")
            .type("form")
            .send({
                "factor": 1,
                "target-muscle-group": 1
            });

        // Check response
        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual("OK");

        // Check data manipulations
        expect(multiplier > testData.mockUser1Multiplier).toBeTruthy();
    });

    it("expect difficulty successfully changed, decrement past minimum amount (OK response)", async () => {
        const MIN_MULTIPLIER = 0.2; // This should match the value in workoutService.js
        
        const res = await request(app)
            .put("/users/37/workout/change-difficulty")
            .type("form")
            .send({
                "factor": -1000,
                "target-muscle-group": 1
            });

        // Check response
        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual("OK");

        // Check data manipulations
        expect(multiplier === MIN_MULTIPLIER && multiplier < testData.mockUser1Multiplier).toBeTruthy();
    });

    it("should fail with status code 500 (db error)", async function() {
        userData.getUserByUserId.mockImplementationOnce(() => {
            throw "Error occured getting user from database";
        });

        const res = await request(app)
            .put("/users/37/workout/change-difficulty")
            .type("form")
            .send({
                "factor": 1,
                "target-muscle-group": 1
            });

        // Check response
        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual("Error occured getting user from database");

        // Ensure data has not been changed
        expect(multiplier === testData.mockUser1Multiplier).toBeTruthy();
    });

    it("should fail with status code 500 (missing 'factor' in body)", async function() {
        const res = await request(app)
            .put("/users/37/workout/change-difficulty")
            .type("form")
            .send({
                "target-muscle-group": 1
            });

        // Check response
        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual("'factor' is expected in the body but was not found!");

        // Ensure data has not been changed
        expect(multiplier === testData.mockUser1Multiplier).toBeTruthy();
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

        workoutData.getWorkoutPlanById.mockResolvedValue(testData.mockWorkoutPlan1DatebaseVersion);
        workoutData.getWorkoutHistoryById.mockResolvedValue(testData.mockWorkoutHistory1);
        workoutData.createWorkoutHistoryEntry.mockResolvedValue(testData.mockWorkoutHistory1.id);
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
    it("expect workout to be successfully completed, no multiplier change", async () => {
        // Set-up firebase API call to succeed
        firebaseData.sendFirebaseMessages.mockReturnValue([]);
        mockMultiplier = util.clone(testData.mockWorkoutPlan1.associated_multiplier);
        workoutData.getUserMultiplier.mockResolvedValue(mockMultiplier);

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
        expect(mockUser.spottr_points === newExpectedPoints).toBeTruthy();

        // Since workout was completed within margin of current skill, multiplier should remain the same
        expect(mockMultiplier).toEqual(testData.mockWorkoutPlan1.associated_multiplier);
    });

    it("expect workout to be successfully completed, multiplier decrease", async () => {
        // Set-up firebase API call to succeed
        firebaseData.sendFirebaseMessages.mockReturnValue([]);
        mockMultiplier = util.clone(testData.mockWorkoutPlan1.associated_multiplier);
        workoutData.getUserMultiplier.mockResolvedValue(mockMultiplier);

        let path = "/users/" + testData.mockUser1.id + "/workout/complete";
        const res = await request(app)
            .post(path)
            .set("Accept", "application/json")
            .type("form")
            .send({
                "length-seconds": testData.mockWorkoutHistory1.actual_length_sec + 1000,
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
        expect(mockUser.spottr_points === newExpectedPoints).toBeTruthy();

        // Since workout was too difficult for the user's current skill, multiplier should decrease
        expect(mockMultiplier < testData.mockWorkoutPlan1.associated_multiplier).toBeTruthy();
    });

    it("expect workout to be successfully completed, multiplier decrease", async () => {
        // Set-up firebase API call to succeed
        firebaseData.sendFirebaseMessages.mockReturnValue([]);
        mockMultiplier = util.clone(testData.mockWorkoutPlan1.associated_multiplier);
        workoutData.getUserMultiplier.mockResolvedValue(mockMultiplier);

        let path = "/users/" + testData.mockUser1.id + "/workout/complete";
        const res = await request(app)
            .post(path)
            .set("Accept", "application/json")
            .type("form")
            .send({
                "length-seconds": testData.mockWorkoutHistory1.actual_length_sec - 500,
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
        expect(mockUser.spottr_points === newExpectedPoints).toBeTruthy();

        // Since workout was too easy for the user's current skill, multiplier should increase
        expect(mockMultiplier > testData.mockWorkoutPlan1.associated_multiplier).toBeTruthy();
    });

    it("expect workout to be successfully completed, no multiplier change (due to being one-up)", async () => {
        // Set-up firebase API call to succeed
        firebaseData.sendFirebaseMessages.mockReturnValue([]);
        mockMultiplier = util.clone(testData.mockUser1Multiplier);
        workoutData.getUserMultiplier.mockResolvedValue(mockMultiplier);

        let path = "/users/" + testData.mockUser1.id + "/workout/complete";
        const res = await request(app)
            .post(path)
            .set("Accept", "application/json")
            .type("form")
            .send({
                "length-seconds": testData.mockWorkoutHistory1.actual_length_sec + 1000,
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
        expect(mockUser.spottr_points === newExpectedPoints).toBeTruthy();

        // Since workout was one-up, do not change multiplier regardless of performance
        expect(mockMultiplier).toEqual(testData.mockUser1Multiplier);
    });

    it("expect failed request (firebase messaging error)", async () => {
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


describe("GET /workout/muscle-groups (Retrieve All Muscle Groups)", function() {
    afterAll(() => { 
        jest.restoreAllMocks();
        app.close(); 
    });

    // Execute tests
    it("expect valid response", async function() {
        workoutData.getAllMuscleGroups.mockResolvedValue(testData.mockMuscleGroups);

        const res = await request(app)
            .get("/workout/muscle-groups")
            .set("Accept", "application/json")
            .send();

        // Check response
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject(testData.mockMuscleGroups);
    });

    it("should fail with status code 500 (db error)", async function() {
        workoutData.getAllMuscleGroups.mockImplementationOnce(() => {
            throw "Error occured getting muscle groups from database";
        });

        const res = await request(app)
            .get("/workout/muscle-groups")
            .set("Accept", "application/json")
            .send();

        // Check response
        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual("Error occured getting muscle groups from database");
    });
});


describe("GET /workout/history (Retrieve Recent Workout History)", function() {
    afterAll(() => { 
        jest.restoreAllMocks();
        app.close(); 
    });

    // Execute tests
    it("expect valid response, default entries (no number specified)", async function() {
        // Constant amount should match the value in workoutService.js
        const DEFAULT_WORKOUT_HISTORY_ENTRIES = 20;

        workoutData.getRecentWorkoutHistory.mockImplementationOnce((dbConfig, numEntries) => {
            expect(numEntries === DEFAULT_WORKOUT_HISTORY_ENTRIES);
            return util.clone([testData.mockWorkoutHistory1]);
        });

        const res = await request(app)
            .get("/workout/history")
            .set("Accept", "application/json")
            .send();

        // Check response
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([testData.mockWorkoutHistoryExpected]);
    });

    it("expect valid response, default entries (NaN specified)", async function() {
        // Constant amount should match the value in workoutService.js
        const DEFAULT_WORKOUT_HISTORY_ENTRIES = 20;

        workoutData.getRecentWorkoutHistory.mockImplementationOnce((dbConfig, numEntries) => {
            expect(numEntries === DEFAULT_WORKOUT_HISTORY_ENTRIES);
            return util.clone([testData.mockWorkoutHistory1]);
        });

        const res = await request(app)
            .get("/workout/history?entries='asdasdas'")
            .set("Accept", "application/json")
            .send();

        // Check response
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([testData.mockWorkoutHistoryExpected]);
    });

    it("expect valid response, defined entries", async function() {
        workoutData.getRecentWorkoutHistory.mockImplementationOnce((dbConfig, numEntries) => {
            expect(numEntries === 2);
            return [
                util.clone(testData.mockWorkoutHistory1),
                util.clone(testData.mockWorkoutHistory1)
            ];
        });

        const res = await request(app)
            .get("/workout/history?entries=2")
            .set("Accept", "application/json")
            .send();

        // Check response
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([
            testData.mockWorkoutHistoryExpected,
            testData.mockWorkoutHistoryExpected
        ]);
    });

    it("should fail with status code 500 (db error)", async function() {
        workoutData.getRecentWorkoutHistory.mockImplementationOnce(() => {
            throw "Error occured";
        });

        const res = await request(app)
            .get("/workout/history")
            .set("Accept", "application/json")
            .send();

        // Check response
        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual("Error occured");
    });
});


describe("GET /workout/plan/:workoutPlanId (Retrieve Workout Plan By Id)", function() {
    afterAll(() => { 
        jest.restoreAllMocks();
        app.close(); 
    });

    // Execute tests
    it("expect valid response", async function() {
        workoutData.getWorkoutPlanById.mockResolvedValue(testData.mockWorkoutPlan1DatebaseVersion);
        workoutData.getWorkoutExercisesByWorkoutPlanId.mockResolvedValue(util.clone(testData.mockWorkoutPlan1DatebaseVersion.exercises));
        workoutData.getExercisesByTargetMuscleGroups.mockResolvedValue(util.clone(testData.mockPossibleExercises1));

        const res = await request(app)
            .get("/workout/plan/93")
            .set("Accept", "application/json")
            .send();

        // Check response
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject(testData.mockWorkoutPlan1);
    });

    it("should fail with status code 500 (db error)", async function() {
        workoutData.getWorkoutPlanById.mockImplementationOnce(() => {
            throw "Error occured getting workout plan from database";
        });

        const res = await request(app)
            .get("/workout/plan/93")
            .set("Accept", "application/json")
            .send();

        // Check response
        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual("Error occured getting workout plan from database");
    });
});