var sql = require("mssql");

module.exports = {
   getUsers: function(dbConfig) {
      try {
         return sql
           .connect(dbConfig)
           .then((pool) => {
             return pool
               .request()
               .query(
                 "SELECT * FROM user_profile"
               );
           })
           .then((result) => {
             return result.recordset;
           })
     } catch(ex) {
         console.log(ex);
         return ex;
     }
   }, 
   
   getUser: function(userID) {
      return "Getting user " + userID;
   }, 
   
   deleteUser: function(userID) {
      return "Deleting user " + userID;
   },
   
   createUser: function(dbConfig, email) {
      try {
         return sql
           .connect(dbConfig)
           .then((pool) => {
             return pool
               .request()
               .input("email", sql.VarChar(50), email)
               .query(
                  "insert into user_profile(email) values(@email)"
               );
           })
           .then((result) => {
             return result.recordset;
           })
     } catch(ex) {
         console.log(ex);
         return ex;
     }
   }, 
}