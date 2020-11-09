const express = require("express")
const app = express()
const cors = require("cors")
const bodyParser = require("body-parser")
const port = process.env.PORT || 3000

const workoutService = require("./src/service/workoutService.js");
const firebaseService = require("./src/service/firebaseService.js");
const userService = require("./src/service/userService.js");
const authService = require("./src/service/authService.js");
const connection = require("./src/connection.js");
const constants = require("./src/constants.js");

const jsonParser = bodyParser.urlencoded({ extended: true });
var dbConfig = connection.getDbConfig();

connection.initializeFirebaseApp();

app.listen(port, () => { console.log(`Spottr API listening at http://localhost:${port}`) })

app.get("/", cors(), (req, res) => { res.json(new Date()) })


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
})

app.get("/users/:userId", cors(), async function (req, res){
  try{
    let user = await userService.getUserById(JSON.parse(req.params.userId), dbConfig);
    res.json(user);
  } catch (ex) {
    res.status(constants.ERROR_RESPONSE).send(ex);
  }
})


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
})


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
    if (req.body["firebase-token"] == "") {
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
})


//////////                      //////////
//////////  WORKOUT API CALLS   //////////
//////////                      //////////

app.get("/users/:userId/workout/generate-plan/:lengthMinutes&:targetMuscleGroup", cors(), async function (req, res) {
  try {
    res.json(await workoutService.generateWorkoutPlan(
        JSON.parse(req.params.userId),
        JSON.parse(req.params.lengthMinutes),
        JSON.parse(req.params.targetMuscleGroup),
        dbConfig
    ));
  } catch(ex) {
    res.status(constants.ERROR_RESPONSE).send(ex);
  }
})

app.get("/users/:userId/workout/one-up/:workoutPlanId", cors(), async function (req, res) {
  try {
    res.json(await workoutService.generateOneUpWorkoutPlan(
        JSON.parse(req.params.userId),
        JSON.parse(req.params.workoutPlanId),
        dbConfig
    ));
  } catch(ex) {
    res.status(constants.ERROR_RESPONSE).send(ex);
  }
})

app.put("/users/:userId/workout/change-difficulty/:factor&:targetMuscleGroup", cors(), async function (req, res) {
  try {
    res.sendStatus(await workoutService.modifyWorkoutDifficulty(
      JSON.parse(req.params.userId),
      JSON.parse(req.params.targetMuscleGroup),
      JSON.parse(req.params.factor),
      dbConfig
    ));
  } catch(ex) {
    res.status(constants.ERROR_RESPONSE).send(ex);
  }
})

app.post("/users/:userId/workout/complete/:lengthOfWorkoutSeconds&:workoutPlanId", cors(), async function (req, res) {
  try {
    await workoutService.completeWorkout(
      JSON.parse(req.params.userId),
      JSON.parse(req.params.lengthOfWorkoutSeconds),
      JSON.parse(req.params.workoutPlanId),
      dbConfig
    );

    res.sendStatus(constants.SUCCESS_RESPONSE);
  } catch(ex) {
    res.status(constants.ERROR_RESPONSE).send(ex);
  }
})

app.get("/workout/muscleGroups", cors(), async function (req, res) {
  try{
    res.send(
      await workoutService.getAllMuscleGroups(dbConfig)
    );
  } catch (ex) {
    res.status(constants.ERROR_RESPONSE).send(ex);
  }
})

app.get("/workout/history/:numEntries/:startId?", cors(), async function (req, res) {
  try{
    res.send(
      await workoutService.getWorkoutHistory(dbConfig, req.params.numEntries, req.params.startId)
    );
  } catch (ex) {
    res.status(constants.ERROR_RESPONSE).send(ex);
  }
})

app.get("/workout/workoutplan/:workoutPlanId", cors(), async function (req, res) {
  try{
    res.send(
      await workoutService.getWorkoutPlanById(dbConfig, req.params.workoutPlanId)
    );
  } catch (ex) {
    res.status(constants.ERROR_RESPONSE).send(ex);
  }
})
