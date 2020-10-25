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
                return result.recordset[0];
              })
        } catch(ex) {
            console.log(ex);
            return ex;
        }
    }
}