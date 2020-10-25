const express = require('express')
const app = express()
var cors = require('cors')
const port = process.env.PORT || 3000

const community = require('./communityAPIFunctions.js');
const exercise = require('./exerciseAPIFunctions.js');
const token = require('./tokenVerifyAPIFunctions.js');

var sql = require("mssql");
const {OAuth2Client} = require('google-auth-library');

//const CLIENT_ID_1 = '347900541097-jh4h8b5iuglt6s785vo6j73relo9fph4.apps.googleusercontent.com'; //debug
//const CLIENT_ID_2 = '347900541097-qbvaoqoc68hp2m6joea6728ebgm598lt.apps.googleusercontent.com'; //release
const CLIENT_ID = '347900541097-0g1k5jd34m9189jontkd1o9mpv8b8o1o.apps.googleusercontent.com'; //backend client ID - USE THIS

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

app.get('/users', cors(), async function (req, res){
  var result = await community.getUsers(dbConfig)
  res.send(result);
})

app.get('/users/:userID', cors(), (req, res) => {
  var result = community.getUser(req.params.userID);
  res.json(result)
})

app.post('/users', cors(), async function (req, res) {
  var result = await community.createUser(dbConfig, req.params.email)
  res.sendStatus(result);
})

app.delete('/users/:userID', cors(), function (req, res) {
  var result = community.deleteUser(req.params.userID);
  res.json(result)
})

//////////  EXERCISE API CALLS   //////////


//////////  TOKEN VERIFY API CALLS   //////////

app.post('/token', cors(), async function (req, res){
  const client = new OAuth2Client(CLIENT_ID);
  var payload = await token.verifyToken(client, req.header.authorization).catch(console.error);
  var possibleUserProfile = await token.checkIfUserExists(
    dbConfig, payload['sub'], payload['email'], payload['name']);
  
  if (Object.keys(possibleUserProfile).length === 0) { //checks if returned a user or an empty list
    var newUser = await token.createUser(dbConfig, req.body.email)
    res.json(newUser)
  }else{
    res.json(possibleUserProfile)
  }
})

//Another way of authenticating token I found at https://github.com/googleapis/google-auth-library-nodejs
//  (Back up incase first way doesn't work)
/*
app.post('/token/:tokenID', cors(), (req, res) => {

  const {OAuth2Client} = require('google-auth-library');
  // Expected audience for App Engine.
  const expectedAudience = `/projects/your-project-number/apps/your-project-id`;
  // IAP issuer
  const issuers = ['https://cloud.google.com/iap'];
  // Verify the token. OAuth2Client throws an Error if verification fails
  const oAuth2Client = new OAuth2Client();
  const response = await oAuth2Client.getIapCerts();
  const ticket = await oAuth2Client.verifySignedJwtWithCertsAsync(
    idToken,
    response.pubkeys,
    expectedAudience, //2
    issuers //3
  );
  return ticket;
})*/
