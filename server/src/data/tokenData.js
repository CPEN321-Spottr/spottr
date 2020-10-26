var sql = require("mssql");
//const CLIENT_ID_1 = '347900541097-jh4h8b5iuglt6s785vo6j73relo9fph4.apps.googleusercontent.com'; //debug
//const CLIENT_ID_2 = '347900541097-qbvaoqoc68hp2m6joea6728ebgm598lt.apps.googleusercontent.com'; //release
const CLIENT_ID = '347900541097-0g1k5jd34m9189jontkd1o9mpv8b8o1o.apps.googleusercontent.com'; //backend client ID - USE THIS

module.exports = {
    verifyToken: async function(client, token) {
        //Verify user token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
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
    },

    createUser: async function(dbConfig, googleID, googleEmail, googleName){
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
                    "insert into user_profile (email, google_user_id, name) values (@gEmail, @gID, @gName)"
                  );
              })
              .then((result) => {
                if (result.recordset.length == 0) throw ('Could not create user with google id: ' + googleID);
                return result.recordset[0];
              })
        } catch(ex) {
            console.log(ex);
            throw ex;
        }
    }
 }