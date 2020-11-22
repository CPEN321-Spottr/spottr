const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;

const workoutService = require("./src/service/workoutService.js");
const firebaseService = require("./src/service/firebaseService.js");
const userService = require("./src/service/userService.js");
const authService = require("./src/service/authService.js");
const connection = require("./src/connection.js");
const constants = require("./src/constants.js");
const validator = require("./src/paramValidator.js");

const jsonParser = bodyParser.urlencoded({ extended: true });
var dbConfig = connection.getDbConfig();

connection.initializeFirebaseApp();

app.use(bodyParser.json())

module.exports = app.listen(port, () => { console.log("Spottr API listening at http://localhost:${port}"); });

app.get("/", cors(), (req, res) => { res.json(new Date()); });

//////////                        //////////
//////////  COMMUNITY API CALLS   //////////
//////////                        //////////

app.get("/users", cors(), async function (req, res){
  try{
    let users = await userService.getAllUsers(dbConfig);
    res.send(users);
  } catch (ex) {
    res.status(constants.ERROR_RESPONSE).send(ex);
  }
});

app.get("/users/:userId", cors(), async function (req, res){
  try{
    let user = await userService.getUserById(JSON.parse(req.params.userId), dbConfig);
    res.json(user);
  } catch (ex) {
    res.status(constants.ERROR_RESPONSE).send(ex);
  }
});


//////////                           //////////
//////////  TOKEN VERIFY API CALLS   //////////
//////////                           //////////

app.post("/token", cors(), async function (req, res){
  try{
    res.json(
      await authService.googleTokenVerify(dbConfig, req.headers.authorization)
    );
  } catch (ex) {
    res.status(constants.ERROR_RESPONSE).send(ex);
  }
});


////////                            ////////
//////// FIREBASE VERIFY API CALLS  ////////
////////                            ////////

// A working token for testing: "fJDLUk0CRrScpTuhnNjBl9:APA91bGKScW3LwUSRrSfNE-GqkcZf51oOZI8dD9TcRKKQRUpg4KL-JhGj1X_lNT7_HxZttVsE1ztE5uiM5CQz2TZL_T-ZpGDFO9I8QSNv5luyGzegf-z8CO8ljs6KVh_PemvKH_Hc2H_"
app.post("/firebase-token", jsonParser, cors(), async function (req, res){
  try {
    // Basic input validation
    validator.checkIsPresent(["firebase-token"], req.body);
    
    await firebaseService.registerFirebaseToken(
      req.body["firebase-token"],
      dbConfig
    );

    res.sendStatus(constants.SUCCESS_RESPONSE);
  }
  catch(ex){
    res.status(constants.INVALID_TOKEN_RESPONSE).send(ex.message);
  }
});


//////////                      //////////
//////////  WORKOUT API CALLS   //////////
//////////                      //////////

app.get("/users/:userId/workout/generate-plan", jsonParser, cors(), async function (req, res) {
  try {
    // Basic input validation
    validator.checkIsPresent(["length-minutes", "target-muscle-group"], req.body, "body", true);

    res.json(await workoutService.generateWorkoutPlan(
        JSON.parse(req.params.userId),
        parseInt(req.body["length-minutes"], 10),
        parseInt(req.body["target-muscle-group"], 10),
        dbConfig
    ));
  } catch(ex) {
    res.status(constants.ERROR_RESPONSE).send(ex);
  }
});

app.get("/users/:userId/workout/one-up/:workout-plan-id", cors(), async function (req, res) {
  try {
    res.json(await workoutService.generateOneUpWorkoutPlan(
        JSON.parse(req.params.userId),
        JSON.parse(req.params.workoutPlanId),
        dbConfig
    ));
  } catch(ex) {
    res.status(constants.ERROR_RESPONSE).send(ex);
  }
});

app.put("/users/:userId/workout/change-difficulty", jsonParser, cors(), async function (req, res) {
  try {
    // Basic input validation
    validator.checkIsPresent(["factor", "target-muscle-group"], req.body, "body", true);

    res.sendStatus(await workoutService.modifyWorkoutDifficulty(
      JSON.parse(req.params.userId),
      parseInt(req.body["target-muscle-group"], 10),
      parseInt(req.body["factor"], 10),
      dbConfig
    ));
  } catch(ex) {
    res.status(constants.ERROR_RESPONSE).send(ex);
  }
});

app.post("/users/:userId/workout/complete", jsonParser, cors(), async function (req, res) {
  try {
    // Basic input validation
    validator.checkIsPresent(["length-seconds", "workout-plan-id"], req.body, "body", true);

    await workoutService.completeWorkout(
      JSON.parse(req.params.userId),
      parseInt(req.body["length-seconds"], 10),
      parseInt(req.body["workout-plan-id"], 10),
      dbConfig
    );

    res.sendStatus(constants.SUCCESS_RESPONSE);
  } catch(ex) {
    res.status(constants.ERROR_RESPONSE).send(ex);
  }
});

app.get("/workout/muscle-groups", cors(), async function (req, res) {
  try{
    res.send(
      await workoutService.getAllMuscleGroups(dbConfig)
    );
  } catch (ex) {
    res.status(constants.ERROR_RESPONSE).send(ex);
  }
});

app.get("/workout/history", cors(), async function (req, res) {
  try{
    let numEntries = parseInt(req.query.entries, 10);

    res.send(
      await workoutService.getWorkoutHistory(dbConfig, numEntries)
    );
  } catch (ex) {
    res.status(constants.ERROR_RESPONSE).send(ex);
  }
});

app.get("/workout/plan/:workout-plan-id", cors(), async function (req, res) {
  try{
    res.send(
      await workoutService.getWorkoutPlanById(dbConfig, req.params.workoutPlanId)
    );
  } catch (ex) {
    res.status(constants.ERROR_RESPONSE).send(ex);
  }
});
