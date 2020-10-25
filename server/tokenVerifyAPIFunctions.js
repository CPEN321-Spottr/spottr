var sql = require("mssql");
const CLIENT_ID = 'spottr-be.herokuapp.com';

module.exports = {
    verifyToken: async function(client, dbConfig) {
        //Verify user token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload(); 
        // const userid = payload['sub']; - I don;t think the userID means much to us in this context
        
        //Use output email of verification to query database for any users with that email
        const email  = payload['email'];
        try {
            return sql
              .connect(dbConfig)
              .then((pool) => {
                return pool
                  .request()
                  .input("userEmail", sql.VarChar(50), email)
                  .query(
                    "SELECT * FROM user_profile where email=@email"
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
