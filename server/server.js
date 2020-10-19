const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  var currentTime = new Date();
  res.json(currentTime)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
