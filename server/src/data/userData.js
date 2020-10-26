var sql = require("mssql");

module.exports = {
    getUserByUserId: function(userId, dbConfig) {
        try {
            return sql
              .connect(dbConfig)
              .then((pool) => {
                return pool
                  .request()
                  .input("userId", sql.Int, userId)
                  .query(
                    "SELECT * FROM user_profile WHERE id = @userId"
                  );
              })
              .then((result) => {
                if (result.recordset.length == 0) throw ('No user found for user with id: ' + userId);
                return result.recordset[0];
              })
        } catch(ex) {
            console.log(ex);
            throw ex;
        }
    },

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
   
   deleteUser: function(userID) {
      return "Deleting user " + userID;
   }
}