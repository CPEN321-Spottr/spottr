var sql = require("mssql");
const connection = require('../connection.js');

module.exports = {
    verifyToken: async function(client, token) {
        client_id = connection.getGoogleAuthClientID();
        //Verify user token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: client_id,
        });
        const payload = ticket.getPayload(); 
        return payload
    }, 

    getUserByGoogleID: async function(dbConfig, googleID){
        try {
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
                if (result.recordset.length == 0) 
                    return {};
                return result.recordset[0];
              })
        } catch(ex) {
            console.log(ex);
            throw ex;
        }
    }
 }