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

   upsertUserMultiplier: function(userId, newValue, dbConfig) {
    try {
      return sql
        .connect(dbConfig)
        .then((pool) => {
            return pool
              .request()
              .input("uid", sql.Int, userId)
              .input("value", sql.Int, newValue)
              .query(
                "UPDATE user_profile SET user_multiplier_id = @value OUTPUT Inserted.* WHERE id = @uid"
              );
        })
        .then((result) => {
          return result.resultset[0];
        })
    } catch(ex) {
        console.log(ex);
        throw ex;
    }
   },
   
   deleteUser: function(userId) {
      return "Deleting user " + userId;
   }
}