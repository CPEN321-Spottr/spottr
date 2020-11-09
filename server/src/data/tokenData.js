var sql = require("mssql");
//const CLIENT_ID_1 = "347900541097-jh4h8b5iuglt6s785vo6j73relo9fph4.apps.googleusercontent.com"; //debug
//const CLIENT_ID_2 = "347900541097-qbvaoqoc68hp2m6joea6728ebgm598lt.apps.googleusercontent.com"; //release
const CLIENT_ID = "347900541097-0g1k5jd34m9189jontkd1o9mpv8b8o1o.apps.googleusercontent.com"; //backend client ID - USE THIS

module.exports = {
    async verifyToken(client, token) {
        //Verify user token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
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
          console.error(ex);
          throw ex;
        });
    }
 };
