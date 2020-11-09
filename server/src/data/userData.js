var sql = require("mssql");

module.exports = {
    getUserByUserId(userId, dbConfig) {
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

    getUsers(dbConfig) {
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

   upsertUserMultiplier(userId, newMultiplierId, dbConfig) {
    try {
      return sql
        .connect(dbConfig)
        .then((pool) => {
            return pool
              .request()
              .input("uid", sql.Int, userId)
              .input("value", sql.Int, newMultiplierId)
              .query(
                "UPDATE user_profile SET user_multiplier_id = @value WHERE id = @uid"
              );
        })
        .then((result) => {
          return 1;
        })
    } catch(ex) {
        console.log(ex);
        throw ex;
    }
   },

   updateUserSpottrPoints(userId, newAmount, dbConfig) {
    try {
      return sql
        .connect(dbConfig)
        .then((pool) => {
            return pool
              .request()
              .input("uid", sql.Int, userId)
              .input("value", sql.Int, newAmount)
              .query(
                "UPDATE user_profile SET spottr_points = @value WHERE id = @uid"
              );
        })
        .then((result) => {
          return 1;
        })
    } catch(ex) {
        console.log(ex);
        throw ex;
    }
   },

   async createUser(dbConfig, googleID, googleEmail, googleName){
    try {
        return sql
          .connect(dbConfig)
          .then((pool) => {
            return pool
              .request()
              .input("gID", sql.Char(256), googleID)
              .input("gEmail", sql.VarChar(50), googleEmail)
              .input("gName", sql.VarChar(50), googleName)
              .query(
                "insert into user_profile (email, google_user_id, name) OUTPUT Inserted.id values (@gEmail, @gID, @gName)"
              );
          })
          .then((result) => {
            if (result.recordset.length == 0) throw ('Could not create user with google id: ' + googleID);
            return result.recordset[0].id;
          })
      } catch(ex) {
          console.log(ex);
          throw ex;
      }
    },

   deleteUser(userId) {
      return "Deleting user " + userId;
   }
}
