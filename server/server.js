const express = require('express')
const app = express()
var cors = require('cors')
const port = process.env.PORT || 3000

const community = require('./communityAPIFunctions.js');
const exercise = require('./exerciseAPIFunctions.js');
const workout = require('./src/service/workoutService.js');
const db = require('./src/connection.js');
const constants = require('./src/constants.js');

const dbConfig = db.getDbConfig();

app.listen(port, () => {
  console.log(`Spottr API listening at http://localhost:${port}`)
})

app.get('/', cors(), (req, res) => {
  var currentTime = new Date();
  res.json(currentTime)
})


//////////  COMMUNITY API CALLS   //////////
app.get('/users', cors(), (req, res) => {
  var result = community.getUsers();
  res.json(result)
})

app.get('/users/:userID', cors(), (req, res) => {
  var result = community.getUser(req.params.userID);
  res.json(result)
})

app.post('/users', cors(), function (req, res) {
  var result = community.createUser(req.body.User.id);
  res.json(result)
})

app.delete('/users/:userID', cors(), function (req, res) {
  var result = community.deleteUser(req.params.userID);
  res.json(result)
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