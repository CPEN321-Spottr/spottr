const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const community = require('./communityAPIFunctions.js');
const exercise = require('./exerciseAPIFunctions.js');

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

app.get('/', (req, res) => {
  var currentTime = new Date();
  res.json(currentTime)
})


//////////  COMMUNITY API CALLS   //////////
app.get('/users', (req, res) => {
  var result = community.getUsers();
  res.json(result)
})

app.get('/users/:userID', (req, res) => {
  var result = community.getUser(req.params.userID);
  res.json(result)
})

app.post('/users', function (req, res) {
  var result = community.createUser(req.body.User.id);
  res.json(result)
})

app.delete('/users/:userID', function (req, res) {
  var result = community.deleteUser(req.params.userID);
  res.json(result)
})


//////////  EXERCISE API CALLS   //////////