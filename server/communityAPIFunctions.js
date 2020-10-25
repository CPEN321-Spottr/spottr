const express = require('express')
const app = express()
const port = process.env.PORT || 3000

module.exports = {
   getUsers: function() {
      var sql = require("mssql");
  
      var config = {
            user: 'u0tri2ukfid8bnj',
            password: 'Udh!v6payG2cTwuVAXvta%0&y',
            server: 'eu-az-sql-serv1.database.windows.net', 
            database: 'dkxp1krn55tloca'
      };

      // connect to your database
      sql.connect(config, function (err) {
            if (err) console.log(err);

            // create Request object
            var request = new sql.Request();
               
            // query to the database and get the records
            request.query('select * from user_profile', function (err, users) {
               if (err) console.log(err)
               res.send(users);
            });
      });
   }, 
   
   getUser: function(userID) {
      return "Getting user " + userID;
   }, 
   
   deleteUser: function(userID) {
      return "Deleting user " + userID;
   },
   
   createUser: function(userID) {
      
      return "Creating user " + userID;
   }
}