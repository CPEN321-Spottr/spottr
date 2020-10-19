const express = require('express')
const app = express()
const port = process.env.PORT || 3000

module.exports = {
   users: function() {
      return "This is community users";
   }
}