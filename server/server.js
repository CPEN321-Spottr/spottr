const express = require('express')
const app = express()
var cors = require('cors')
const port = process.env.PORT || 3000

const community = require('./communityAPIFunctions.js');
const exercise = require('./exerciseAPIFunctions.js');

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
app.get('/users', function (req, res) {
   
  var sql = require("mssql");

  // connect to your database
  sql.connect(dbConfig, function (err) {
      if (err) console.log(err);

      // create Request object
      var request = new sql.Request();
         
      // query to the database and get the records
      request.query('select * from user_profile', function (err, users) {
          if (err) console.log(err)
          res.send(users.recordset);
      });
  });
});

/*
app.get('/users', cors(), (req, res) => {
  community.getUsers();
})*/

app.get('/users/:userID', cors(), (req, res) => {
  var result = community.getUser(req.params.userID);
  res.json(result)
})

app.post('/users', cors(), function (req, res) {
  var sql = require("mssql");

  // connect to your database
  sql.connect(dbConfig, function (err) {
      if (err) console.log(err);

      // create Request object
      var request = new sql.Request();
         
      // query to the database and get the records
      request.query("insert into user_profile(email) values(" + req.params.email + ")", function (err, users) {
          if (err) console.log(err)
          res.send(users.recordset);
      });
  });
})

app.delete('/users/:userID', cors(), function (req, res) {
  var result = community.deleteUser(req.params.userID);
  res.json(result)
})

//////////  EXERCISE API CALLS   //////////