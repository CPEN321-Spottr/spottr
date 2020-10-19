const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  var currentTime = new Date();
  res.send('%s', currentTime)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})



