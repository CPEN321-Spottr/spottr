const express = require('express')
const app = express()
const port = process.env.PORT || 3000

module.exports = {
   getUsers: function() {
      var Users = {
          user1: {
            id:  "user1",
            created: 1,
            email: "abc@shaw.ca",
            workouts: 0},
          user2: {
            id:  "user2",
            created: 1,
            email: "def@shaw.ca",
            workouts: 0}
      };
      return Users;
   }, 
   
   getUser: function(userID) {
      var User = {
        id:  userID,
        created: 1,
        email: "abc@shaw.ca",
        workouts: 0};
      return User;
   }, 
   
   deleteUser: function(userID) {
      return "Deleting user " + userID;
   },
   
   createUser: function(userID) {
      return "Creating user " + userID;
   }
}