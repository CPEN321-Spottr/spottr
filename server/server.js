const express = require('express')
const app = express()
var cors = require('cors')
const port = process.env.PORT || 3000

const community = require('./communityAPIFunctions.js');
const exercise = require('./exerciseAPIFunctions.js');
const token = require('./tokenVerifyAPIFunctions.js');

var sql = require("mssql");
const {OAuth2Client} = require('google-auth-library');

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
  var result = await community.createUser(dbConfig, req.body,email)
  res.sendStatus(result);
})

app.delete('/users/:userID', cors(), function (req, res) {
  var result = community.deleteUser(req.params.userID);
  res.json(result)
})

//////////  EXERCISE API CALLS   //////////


//////////  TOKEN VERIFY API CALLS   //////////

app.post('/token/:tokenID', cors(), async function (req, res){
  const client = new OAuth2Client(CLIENT_ID);
  var result = await token.verifyToken(client, dbConfig).catch(console.error);
  res.sendStatus
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
