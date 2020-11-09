var sql = require("mssql");

module.exports = {
    async createUserMultipler(userId, dbConfig) {
        return sql
          .connect(dbConfig)
          .then((pool) => {
            return pool
                .request()
                .input("userId", sql.Int, userId)
                .query(
                "INSERT INTO user_multiplier OUTPUT Inserted.id DEFAULT VALUES"
            );
          })
          .then((result) => {
            return result.recordset[0]["id"];
          })
          .catch((ex) => {
            console.error(ex);
            throw ex;
          });
    }
};
