const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000

const workoutService = require('./src/service/workoutService.js');
const firebaseService = require('./src/service/firebaseService.js');
const userService = require('./src/service/userService.js');
const authService = require('./src/service/authService.js');
const connection = require('./src/connection.js');
const constants = require('./src/constants.js');

const {OAuth2Client} = require('google-auth-library');
const token = require('./src/data/tokenData.js');

const jsonParser = bodyParser.urlencoded({ extended: true });
var CLIENT_ID = connection.getGoogleAuthClientID();
var dbConfig = connection.getDbConfig();

connection.initializeFirebaseApp();

app.listen(port, () => { console.log(`Spottr API listening at http://localhost:${port}`) })

app.get('/', cors(), (req, res) => { res.json(new Date()) })


//////////                        //////////
//////////  COMMUNITY API CALLS   //////////
//////////                        //////////

app.get('/users', cors(), async function (req, res){
  try{
    res.send(
      await userService.getAllUsers(dbConfig)
    );
  } catch (ex) {
    res.status(constants.ERROR_RESPONSE).send(ex);
  }
})

app.get('/users/:userId', cors(), async function (req, res){
  try{
    res.json(
      await userService.getUserById(JSON.parse(req.params.userId), dbConfig)
    );
  } catch (ex) {
    res.status(constants.ERROR_RESPONSE).send(ex);
  }
})

app.delete('/users/:userID', cors(), function (req, res) { // TODO: not yet implemented!
  res.sendStatus(constants.ERROR_RESPONSE);
})


//////////                           //////////
//////////  TOKEN VERIFY API CALLS   //////////
//////////                           //////////

app.post('/token', cors(), async function (req, res){

  // TODO: There is too much logic here. This should be refactored and placed in the authService.js file
  
  const client = new OAuth2Client(CLIENT_ID);
  try{
    var payload = await token.verifyToken(client, req.headers.authorization);
  }catch(ex){
      res.status(constants.INVALID_TOKEN_RESPONSE).send(ex);
  }
  try{
    var possibleUserProfile = await token.getUserByGoogleID(dbConfig, payload['sub']);
    
    if (Object.keys(possibleUserProfile).length === 0) { //checks if returned a user or an empty list
      var newUser = userService.createNewUser(payload['sub'], payload['email'], payload['name'], dbConfig);
      res.json(newUser)
    } else {
      res.json(possibleUserProfile)
    }
  } catch(ex) {
    res.status(constants.ERROR_RESPONSE).send(ex);
  }
})


////////                            ////////
//////// FIREBASE VERIFY API CALLS  ////////
////////                            ////////

// A working token for testing: 'fJDLUk0CRrScpTuhnNjBl9:APA91bGKScW3LwUSRrSfNE-GqkcZf51oOZI8dD9TcRKKQRUpg4KL-JhGj1X_lNT7_HxZttVsE1ztE5uiM5CQz2TZL_T-ZpGDFO9I8QSNv5luyGzegf-z8CO8ljs6KVh_PemvKH_Hc2H_'
app.post('/firebaseToken', jsonParser, cors(), async function (req, res){
  try {
    // Basic error checking
    if (!('firebase-token' in req.body)) {
      throw ('Could not find expected "firebase-token" key in request body!');
    }
    if (req.body['firebase-token'] == "") {
      throw ('Found token in body contains no value');
    }

    res.sendStatus(
      await firebaseService.firebaseTokenVerify(req.body['firebase-token'])
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

app.get('/users/:userId/workout/generate-plan/:lengthMinutes&:targetMuscleGroup', cors(), async function (req, res) {
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

app.put('/users/:userId/workout/change-difficulty/:factor&:targetMuscleGroup', cors(), async function (req, res) {
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

app.post('/users/:userId/workout/complete/:lengthOfWorkoutSeconds&:workoutPlanId', cors(), async function (req, res) {
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