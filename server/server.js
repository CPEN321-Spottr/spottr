const express = require('express')
const app = express()
var cors = require('cors')
const port = process.env.PORT || 3000

const community = require('./communityAPIFunctions.js');
const exercise = require('./exerciseAPIFunctions.js');
const workout = require('./src/service/workoutService.js');

var dbConfig = {
  user: 'u0tri2ukfid8bnj',
  password: 'Udh!v6payG2cTwuVAXvta%0&y',
  server: 'eu-az-sql-serv1.database.windows.net', 
  database: 'dkxp1krn55tloca'
};

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
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
  var result = await workout.generateWorkoutPlan(
    JSON.parse(req.params.userId), 
    JSON.parse(req.params.lengthMinutes), 
    JSON.parse(req.params.targetMuscleGroup), 
    dbConfig
  );

  res.json(result);
})

