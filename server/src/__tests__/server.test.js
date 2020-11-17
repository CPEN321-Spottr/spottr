/*eslint-env jest*/
const request = require("supertest");
const app = require("../../server.js");
const constants = require("../constants.js");

if(typeof jest !== "undefined") {
    jest.mock("../service/userService.js");
}

jest.mock("../service/userService.js");
jest.mock("../service/workoutService.js");
jest.mock("../service/authService.js");
jest.mock("../service/firebaseService.js");

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

describe("User Endpoints", () => {
  it("Get all users with valid connection", async (done) => {
    const res = await request(app).get("/users");
    expect(res.statusCode).toEqual(constants.SUCCESS_RESPONSE);
    expect(res.text).toEqual("Successfully found all users");
    done();
  });
  it("Get all users with invalid connection", async (done) => {
    const res = await request(app).get("/users");
    expect(res.statusCode).toEqual(constants.ERROR_RESPONSE);
    done();
  });
  it("Get user ID with not existing ID", async (done) => {
    const res = await request(app).get("/users/10");
    expect(res.statusCode).toEqual(constants.ERROR_RESPONSE);
    expect(res.body).toEqual({});
    done();
  });
  it("Get user ID with existing ID", async (done) => {
    const res = await request(app).get("/users/1");
    expect(res.statusCode).toEqual(constants.SUCCESS_RESPONSE);
    const users = {
        1: {name: "Spottr User 1"},
        2: {name: "Spottr User 2"}
    };
    expect(res.body).toEqual(users[1]);
    done();
  });
});

describe("Google Auth Token Endpoint", () => {
  it("Post google auth token with verifiable token", async (done) => {
    const res = await request(app)
      .post("/token")
      .set({ "Authorization": "goodToken" });
    expect(res.statusCode).toEqual(constants.SUCCESS_RESPONSE);
    expect(res.body).toEqual({"id":10,"name":"New User","email":"newuser@gmail.com","user_multiplier_id":1,"google_user_id":"abc","spottr_points":0});
    done();
  });
  it("Post google auth token with invalid token", async (done) => {
    const res = await request(app)
      .post("/token")
      .set({ "Authorization": "badToken" });
    expect(res.statusCode).toEqual(constants.INVALID_TOKEN_RESPONSE);
    done();
  });
  it("Post google auth token with token causing exception", async (done) => {
    const res = await request(app)
      .post("/token")
      .set({ "Authorization": "efhfjksj/nfsi" });
    expect(res.statusCode).toEqual(constants.ERROR_RESPONSE);
    done();
  });
});

describe("Firebase Token Endpoint", () => {
    it("Post firebase token with verifiable token", async (done) => {
      const res = await request(app)
        .post("/firebaseToken")
        .send({"firebase-token": "goodToken"});
      expect(res.statusCode).toEqual(constants.SUCCESS_RESPONSE);
      expect(res.message).toEqual("Notification batch generated");
      done();
    });
    it("Post firebase token with empty token", async (done) => {
        const res = await request(app)
          .post("/firebaseToken")
          .send([{"firebase-token": "" }]);
        expect(res.statusCode).toEqual(constants.INVALID_TOKEN_RESPONSE);
        done();
      });
});

describe("Workout Endpoints", () => {
    it("Generate workout plan with valid parameters", async (done) => {
      const res = await request(app)
        .get("/users/1/workout/generate-plan/60&1");
      expect(res.statusCode).toEqual(constants.SUCCESS_RESPONSE);
      expect(res.body).toEqual(workoutPlan);
      done();
    });
    it("Generate workout plan with invalid parameters", async (done) => {
        const res = await request(app)
          .get("/users/5/workout/generate-plan/50&1");
        expect(res.statusCode).toEqual(constants.ERROR_RESPONSE);
        done();
    });
    it("Generate One Up workout plan with valid parameters", async (done) => {
        const res = await request(app)
          .get("/users/1/workout/one-up/101");
        expect(res.statusCode).toEqual(constants.SUCCESS_RESPONSE);
        expect(res.body).toEqual(workoutPlan);
        done();
    });
    it("Generate One Up workout plan with invalid parameters", async (done) => {
        const res = await request(app)
          .get("/users/5/workout/one-up/100");
        expect(res.statusCode).toEqual(constants.ERROR_RESPONSE);
        done();
    });
    it("Modify workout difficulty with valid parameters", async (done) => {
        const res = await request(app)
            .put("/users/1/workout/change-difficulty/2&1");
        expect(res.statusCode).toEqual(constants.SUCCESS_RESPONSE);
        done();
    });
    it("Modify workout difficulty with with invalid parameters", async (done) => {
        const res = await request(app)
          .put("/users/5/workout/change-difficulty/1&1");
        expect(res.statusCode).toEqual(constants.ERROR_RESPONSE);
        done();
    });
    it("Complete workout with valid parameters", async (done) => {
        const res = await request(app)
          .post("/users/1/workout/complete/10&1");
        expect(res.statusCode).toEqual(constants.SUCCESS_RESPONSE);
        expect(res.body).toEqual(1); //FAILING -> I think because we should return 1 as body of response
        done();
    });
    it("Complete workout with invalid parameters", async (done) => {
        const res = await request(app)
          .post("/users/5/workout/complete/9&1");
        expect(res.statusCode).toEqual(constants.ERROR_RESPONSE);
        done();
    });
    it("Get workout muscle groups", async (done) => {
        const res = await request(app)
          .get("/workout/muscleGroups");
        expect(res.statusCode).toEqual(constants.SUCCESS_RESPONSE);
        expect(res.body).toEqual([{"id":1,"name":"Arms"},{"id":3,"name":"Rest"}]);
        done();
    });
    it("Get workout history with valid parameters", async (done) => {
        const res = await request(app)
          .get("/workout/history/1/1");
        expect(res.statusCode).toEqual(constants.SUCCESS_RESPONSE);
        expect(res.body).toEqual([
            {"id":1,"user_profile_id":37,"workout_plan_id":93,"actual_length_sec":1100,"major_muscle_group_id":1,"spottr_points":235,"date_time_utc":"2020-10-29T08:42:10.000Z"},
            {"id":2,"user_profile_id":37,"workout_plan_id":93,"actual_length_sec":1100,"major_muscle_group_id":1,"spottr_points":235,"date_time_utc":"2020-10-29T09:15:46.000Z"}
        ]);
        done();
    });
    it("Get workout history with invalid parameters", async (done) => {
        const res = await request(app)
          .get("/workout/history/5/5");
        expect(res.statusCode).toEqual(constants.ERROR_RESPONSE);
        done();
    });
    it("Get workout plan by ID with valid ID", async (done) => {
        const res = await request(app)
          .get("/workout/workoutplan/1");
        expect(res.statusCode).toEqual(constants.SUCCESS_RESPONSE);
        expect(res.body).toEqual(workoutPlan);
        done();
    });
    it("Get workout plan by ID with invalid ID", async (done) => {
        const res = await request(app)
        .get("/workout/workoutplan/10");
        expect(res.statusCode).toEqual(constants.ERROR_RESPONSE);
        done();
    });
});