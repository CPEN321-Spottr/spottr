var sql = require("mssql");
//const CLIENT_ID_1 = '347900541097-jh4h8b5iuglt6s785vo6j73relo9fph4.apps.googleusercontent.com'; //debug
//const CLIENT_ID_2 = '347900541097-qbvaoqoc68hp2m6joea6728ebgm598lt.apps.googleusercontent.com'; //release
const CLIENT_ID = '347900541097-0g1k5jd34m9189jontkd1o9mpv8b8o1o.apps.googleusercontent.com'; //backend client ID - USE THIS

module.exports = {
    verifyToken: async function(client, token) {
        //Verify user token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload(); 
        return payload
    }, 

    checkIfUserExists: async function(dbConfig, googleID){
        try {
            return sql
            .connect(dbConfig)
            .then((pool) => {
                return pool
                .request()
                .input("googleUserID", sql.VarChar(255), googleID)
                .query(
                    "SELECT * FROM user_profile where google_user_id=@googleUserID"
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

    createUser: async function(dbConfig, googleID, googleEmail, googleName){
        try {
            return sql
              .connect(dbConfig)
              .then((pool) => {
                return pool
                  .request()
                  .input("gID", sql.VarChar(255), googleID)
                  .input("gEmail", sql.VarChar(50), googleEmail)
                  .input("gName", sql.VarChar(50), googleName)
                  .query(
                     "insert into user_profile(email, id, google_user_id) values (@gEmail, @gID, @gName)"
                  );
              })
              .then((result) => {
                return result.recordset;
              })
        } catch(ex) {
            console.log(ex);
            return ex;
        }
    }
 }

 /*
Verify the integrity of the ID token steps

After you receive the ID token by HTTPS POST, 
you must verify the integrity of the token. 
To verify that the token is valid, ensure that the following criteria are satisfied:

1. The ID token is properly signed by Google. Use Google's public keys (available in JWK or PEM format) to verify the token's signature. These keys are regularly rotated; examine the Cache-Control header in the response to determine when you should retrieve them again.
2. The value of aud in the ID token is equal to one of your app's client IDs. This check is necessary to prevent ID tokens issued to a malicious app being used to access data about the same user on your app's backend server.
3. The value of iss in the ID token is equal to accounts.google.com or https://accounts.google.com.
4. The expiry time (exp) of the ID token has not passed.
If you want to restrict access to only members of your G Suite domain, verify that the ID token has an hd claim that matches your G Suite domain name.
 */
