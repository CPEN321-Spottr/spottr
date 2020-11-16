
const request = require('supertest');
const app = require("../__mocks__/server.js");
const constants = require("../constants.js");

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
  it("Get all users", async () => {
    const res = await request(app).get("/users");
    expect(res.statusCode).toEqual(constants.SUCCESS_RESPONSE);
    expect(res.body).toEqual([
        {"id":6,"name":"Test User","email":"test@gmail.com","user_multiplier_id":1,"google_user_id":"abc","spottr_points":0},
        {"id":7,"name":"User Test","email":"test2@gmail.com","user_multiplier_id":2,"google_user_id":"def","spottr_points":0}
    ]);
  });
  it("Get user ID with not existing ID", async () => {
    const res = await request(app).get("/users/10");
    expect(res.statusCode).toEqual(constants.ERROR_RESPONSE);
    expect(res.body).toEqual({});
  });
  it("Get user ID with existing ID", async () => {
    const res = await request(app).get("/users/6");
    expect(res.statusCode).toEqual(constants.SUCCESS_RESPONSE);
    expect(res.body).toEqual({"id":6,"name":"Test User","email":"test@gmail.com","user_multiplier_id":1,"google_user_id":"abc","spottr_points":0});
  });
});

describe("Token Endpoint", () => {
    /*
  it('Post google auth token with verifiable token', async () => {
    const res = await request(app)
      .post("/token")
      .set({ Authorization: "goodToken" });
    expect(res.statusCode).toEqual(constants.SUCCESS_RESPONSE);
    expect(res.body).toEqual({"id":10,"name":"New User","email":"newuser@gmail.com","user_multiplier_id":1,"google_user_id":"abc","spottr_points":0});
  });*/
  it("Post google auth token with unverifiable token", async () => {
    const res = await request(app)
      .post("/token")
      .send({
        Authorization: "badToken"
      });
    expect(res.statusCode).toEqual(constants.ERROR_RESPONSE);
  });
});


describe("Workout Endpoints", () => {
    it("Generate workout plan with valid parameters", async () => {
      const res = await request(app)
        .get("/users/:userId/workout/generate-plan/60&1");
      expect(res.statusCode).toEqual(constants.SUCCESS_RESPONSE);
      expect(res.body).toEqual(workoutPlan);
    });
    it("Generate workout plan with invalid parameters", async () => {
        const res = await request(app)
          .get("/users/:userId/workout/generate-plan/50&1");
        expect(res.statusCode).toEqual(constants.ERROR_RESPONSE);
    });
    it("Generate One Up workout plan with valid parameters", async () => {
        const res = await request(app)
          .get("/users/5/workout/one-up/101");
        expect(res.statusCode).toEqual(constants.SUCCESS_RESPONSE);
        expect(res.body).toEqual(workoutPlan);
    });
    it("Generate One Up workout plan with invalid parameters", async () => {
        const res = await request(app)
          .get("/users/5/workout/one-up/100");
        expect(res.statusCode).toEqual(constants.ERROR_RESPONSE);
    });
    it("Modify workout difficulty with valid parameters", async () => {
        const res = await request(app)
            .put("/users/5/workout/change-difficulty/2&1");
        expect(res.statusCode).toEqual(constants.SUCCESS_RESPONSE);
    });
    it("Modify workout difficulty with with invalid parameters", async () => {
        const res = await request(app)
          .put("/users/5/workout/change-difficulty/1&1");
        expect(res.statusCode).toEqual(constants.ERROR_RESPONSE);
    });
    it("Complete workout with valid parameters", async () => {
        const res = await request(app)
          .post("/users/5/workout/complete/10&1");
        expect(res.statusCode).toEqual(constants.SUCCESS_RESPONSE);
        expect(res.body).toEqual(1);
    });
    it("Complete workout with invalid parameters", async () => {
        const res = await request(app)
          .post("/users/5/workout/complete/9&1");
        expect(res.statusCode).toEqual(constants.ERROR_RESPONSE);
    });
    it("Get workout muscle groups", async () => {
        const res = await request(app)
          .get("/workout/muscleGroups");
        expect(res.statusCode).toEqual(constants.SUCCESS_RESPONSE);
        expect(res.body).toEqual([{"id":1,"name":"Arms"},{"id":3,"name":"Rest"}]);
    });
    it("Get workout history with valid parameters", async () => {
        const res = await request(app)
          .get("/workout/history/5/1");
        expect(res.statusCode).toEqual(constants.SUCCESS_RESPONSE);
        expect(res.body).toEqual([
            {"id":1,"user_profile_id":37,"workout_plan_id":93,"actual_length_sec":1100,"major_muscle_group_id":1,"spottr_points":235,"date_time_utc":"2020-10-29T08:42:10.000Z"},
            {"id":2,"user_profile_id":37,"workout_plan_id":93,"actual_length_sec":1100,"major_muscle_group_id":1,"spottr_points":235,"date_time_utc":"2020-10-29T09:15:46.000Z"}
        ]);
    });
    it("Get workout history with invalid parameters", async () => {
        const res = await request(app)
          .get("/workout/history/5/5");
        expect(res.statusCode).toEqual(constants.ERROR_RESPONSE);
    });
    it("Get workout plan by ID with valid ID", async () => {
        const res = await request(app)
          .get("/workout/workoutplan/10");
        expect(res.statusCode).toEqual(constants.SUCCESS_RESPONSE);
        expect(res.body).toEqual(workoutPlan);
    });
    it("Get workout plan by ID with invalid ID", async () => {
        const res = await request(app)
          .get("/workout/workoutplan/9");
        expect(res.statusCode).toEqual(constants.ERROR_RESPONSE);
    });
  });



