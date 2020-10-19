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
app.get('/community/users', (req, res) => {
  var result = myModule.users();
  res.json(result)
})





//////////  EXERCISE API CALLS   //////////