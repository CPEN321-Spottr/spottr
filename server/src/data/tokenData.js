var sql = require("mssql");
const connection = require('../connection.js');

module.exports = {
    async verifyToken(client, token) {
        client_id = connection.getGoogleAuthClientID();
        //Verify user token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: connection.getGoogleAuthClientID(),
        });
        const payload = ticket.getPayload();
        return payload;
    },

    async getUserByGoogleID(dbConfig, googleID){
      return sql
        .connect(dbConfig)
        .then((pool) => {
          return pool
            .request()
            .input("gID", sql.Char(256), googleID)
            .query(
              "SELECT * FROM user_profile WHERE google_user_id = @gID"
            );
        })
        .then((result) => {
          if (result.recordset.length === 0) {
            return {};
          }
          return result.recordset[0];
        })
        .catch((ex) => {
          throw ex;
        });
    }
 };
