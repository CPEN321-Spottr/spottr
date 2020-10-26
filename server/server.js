const express = require('express')
const app = express()
var cors = require('cors')
var bodyParser = require('body-parser')
const port = process.env.PORT || 3000

const token = require('./src/data/tokenData.js');
const workout = require('./src/service/workoutService.js');
const firebase = require('./src/service/firebaseService.js');
const db = require('./src/connection.js');
const userData = require('./src/data/userData.js');
const constants = require('./src/constants.js');

const {OAuth2Client} = require('google-auth-library');

const CLIENT_ID = '347900541097-0g1k5jd34m9189jontkd1o9mpv8b8o1o.apps.googleusercontent.com'; //backend client ID - USE THIS

var jsonParser = bodyParser.urlencoded({ extended: true });

var dbConfig = {
  user: 'u0tri2ukfid8bnj',
  password: 'Udh!v6payG2cTwuVAXvta%0&y',
  server: 'eu-az-sql-serv1.database.windows.net', 
  database: 'dkxp1krn55tloca'
};
//const dbConfig = db.getDbConfig();

app.listen(port, () => {
  console.log(`Spottr API listening at http://localhost:${port}`)
})

app.get('/', cors(), (req, res) => {
  var currentTime = new Date();
  res.json(currentTime)
})

//////////  COMMUNITY API CALLS   //////////
app.get('/users', cors(), async function (req, res){
  try{
    var result = await userData.getUsers(dbConfig)
    res.send(result);
  } catch (ex) {
    res.status(constants.ERROR_RESPONSE).send(ex);
  }
})

app.get('/users/:userId', cors(), async function (req, res){
  try{
    var result = await userData.getUserByUserId(JSON.parse(req.params.userId), dbConfig);
    res.json(result);
  } catch (ex) {
    res.status(constants.ERROR_RESPONSE).send(ex);
  }
})

app.delete('/users/:userID', cors(), function (req, res) { //yet to be implemented
  var result = userData.deleteUser(req.params.userID);
  res.json(result)
})

//////////  TOKEN VERIFY API CALLS   //////////
app.post('/token', cors(), async function (req, res){
  const client = new OAuth2Client(CLIENT_ID);
  try{
    var payload = await token.verifyToken(client, req.headers.authorization);
  }catch(ex){
      res.status(constants.INVALID_TOKEN_RESPONSE).send(ex);
  }
  try{
    var possibleUserProfile = await token.getUserByGoogleID(dbConfig, payload['sub']);
    
    if (Object.keys(possibleUserProfile).length === 0) { //checks if returned a user or an empty list
      var newUser = await token.createUser(dbConfig, payload['sub'], payload['email'], payload['name']);
      res.json(newUser)
    } else {
      res.json(possibleUserProfile)
    }
  } catch(ex) {
    res.status(constants.ERROR_RESPONSE).send(ex);
  }
})

//////// FIREBASE VERIFY API CALLS  ////////

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

    var result = await firebase.firebaseTokenVerify(req.body['firebase-token']);
    
    res.sendStatus(result);
  }
  catch(ex){
    res.status(constants.INVALID_TOKEN_RESPONSE).send(ex);
  }
})

//////////  WORKOUT API CALLS   //////////
app.get('/users/:userId/workout-plan/generate/:lengthMinutes&:targetMuscleGroup', cors(), async function (req, res) {
  try {
    var result = await workout.generateWorkoutPlan(
        JSON.parse(req.params.userId), 
        JSON.parse(req.params.lengthMinutes), 
        JSON.parse(req.params.targetMuscleGroup), 
        dbConfig
      );

      res.json(result);
  } catch(ex) {
    res.status(constants.ERROR_RESPONSE).send(ex);
  }
})

app.put('/users/:userId/workout-difficulty/increase/:factor&:targetMuscleGroup', cors(), async function (req, res) {
  try {
    var result = await workout.modifyWorkoutDifficulty(
    JSON.parse(req.params.userId),
    JSON.parse(req.params.targetMuscleGroup),
    JSON.parse(req.params.factor),
    dbConfig,
    1
  );

  res.sendStatus(result);
  } catch(ex) {
    res.status(constants.ERROR_RESPONSE).send(ex);
  }
})

app.put('/users/:userId/workout-difficulty/decrease/:factor&:targetMuscleGroup', cors(), async function (req, res) {
  try {
    var result = await workout.modifyWorkoutDifficulty(
    JSON.parse(req.params.userId),
    JSON.parse(req.params.targetMuscleGroup),
    JSON.parse(req.params.factor),
    dbConfig,
    0
  );

  res.sendStatus(result);
  } catch(ex) {
    res.status(constants.ERROR_RESPONSE).send(ex);
  }
})

//////////  EXERCISE API CALLS   //////////

