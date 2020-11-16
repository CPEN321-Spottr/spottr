const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;

const workoutService = require("../service/workoutService.js");
const firebaseService = require("../service/firebaseService.js");
const authService = require("../service/authService.js");
const connection = require("../connection.js");
const constants = require("../constants.js");

const jsonParser = bodyParser.urlencoded({ extended: true });

module.exports = app;


//////////                        //////////
//////////  COMMUNITY API CALLS   //////////
//////////                        //////////

app.get("/users", cors(), async function (req, res){
  try{
    let users = [
        {"id":6,"name":"Test User","email":"test@gmail.com","user_multiplier_id":1,"google_user_id":"abc","spottr_points":0},
        {"id":7,"name":"User Test","email":"test2@gmail.com","user_multiplier_id":2,"google_user_id":"def","spottr_points":0}
    ];
    res.send(users);
  } catch (ex) {
    res.status(constants.ERROR_RESPONSE).send(ex);
  }
});

app.get("/users/:userId", cors(), async function (req, res){
  if(req.params.userId == 6) {
    let user = {"id":6,"name":"Test User","email":"test@gmail.com","user_multiplier_id":1,"google_user_id":"abc","spottr_points":0};
    res.json(user);
  } 
  else {
    res.status(constants.ERROR_RESPONSE);
    res.json({});
  }
});


//////////                           //////////
//////////  TOKEN VERIFY API CALLS   //////////
//////////                           //////////

app.post("/token", cors(), async function (req, res){
  if (req.Authorization == "goodToken") {
    res.json({"id":10,"name":"New User","email":"newuser@gmail.com","user_multiplier_id":1,"google_user_id":"abc","spottr_points":0});
  }
  else {
    res.status(constants.ERROR_RESPONSE);
    res.json({});
  }
});


////////                            ////////
//////// FIREBASE VERIFY API CALLS  ////////
////////                            ////////

// A working token for testing: "fJDLUk0CRrScpTuhnNjBl9:APA91bGKScW3LwUSRrSfNE-GqkcZf51oOZI8dD9TcRKKQRUpg4KL-JhGj1X_lNT7_HxZttVsE1ztE5uiM5CQz2TZL_T-ZpGDFO9I8QSNv5luyGzegf-z8CO8ljs6KVh_PemvKH_Hc2H_"
app.post("/firebaseToken", jsonParser, cors(), async function (req, res){
  try {
    // Basic error checking
    if (!("firebase-token" in req.body)) {
      throw ("Could not find expected firebase-token key in request body!");
    }
    if (req.body["firebase-token"] === "") {
      throw ("Found token in body contains no value");
    }

    res.sendStatus(
      await firebaseService.firebaseTokenVerify(req.body["firebase-token"])
    );
  }
  catch(ex){
    console.error(console.trace());
    res.status(constants.INVALID_TOKEN_RESPONSE).send(ex);
  }
});


//////////                      //////////
//////////  WORKOUT API CALLS   //////////
//////////                      //////////

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

app.get("/users/:userId/workout/generate-plan/:lengthMinutes&:targetMuscleGroup", cors(), async function (req, res) {
    if(req.params.lengthMinutes == 60) {
        res.json(workoutPlan);
      } 
      else {
        res.status(constants.ERROR_RESPONSE);
        res.json({});
      }
});

app.get("/users/:userId/workout/one-up/:workoutPlanId", cors(), async function (req, res) {
    if(req.params.workoutPlanId == 101) {
        res.json(workoutPlan);
      } 
      else {
        res.status(constants.ERROR_RESPONSE);
        res.json({});
      }
});

app.put("/users/:userId/workout/change-difficulty/:factor&:targetMuscleGroup", cors(), async function (req, res) {
    if(req.params.factor == 2) {
        res.status(constants.SUCCESS_RESPONSE);
        res.json({});
      } 
      else {
        res.status(constants.ERROR_RESPONSE);
        res.json({});
      }
});

app.post("/users/:userId/workout/complete/:lengthOfWorkoutSeconds&:workoutPlanId", cors(), async function (req, res) {
    if(req.params.lengthOfWorkoutSeconds == 10) {
        res.status(constants.SUCCESS_RESPONSE);
        res.json(1);
      } 
      else {
        res.status(constants.ERROR_RESPONSE);
        res.json({});
      }
});

app.get("/workout/muscleGroups", cors(), async function (req, res) {
    res.send([{"id":1,"name":"Arms"},{"id":3,"name":"Rest"}]);
});

app.get("/workout/history/:numEntries/:startId?", cors(), async function (req, res) {
    if(req.params.startId == 1) {
        res.status(constants.SUCCESS_RESPONSE);
        res.json([
            {"id":1,"user_profile_id":37,"workout_plan_id":93,"actual_length_sec":1100,"major_muscle_group_id":1,"spottr_points":235,"date_time_utc":"2020-10-29T08:42:10.000Z"},
            {"id":2,"user_profile_id":37,"workout_plan_id":93,"actual_length_sec":1100,"major_muscle_group_id":1,"spottr_points":235,"date_time_utc":"2020-10-29T09:15:46.000Z"}
        ]);
      } 
      else {
        res.status(constants.ERROR_RESPONSE);
        res.json({});
      }
});

app.get("/workout/workoutplan/:workoutPlanId", cors(), async function (req, res) {
    if(req.params.workoutPlanId == 10) {
        res.status(constants.SUCCESS_RESPONSE);
        res.json(workoutPlan);
      } 
      else {
        res.status(constants.ERROR_RESPONSE);
        res.json({});
      }
});
