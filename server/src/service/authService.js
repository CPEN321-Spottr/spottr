const {OAuth2Client} = require("google-auth-library");
const connection = require("../connection.js");
const token = require("../data/tokenData.js");
const userService = require("./userService.js");
var CLIENT_ID = connection.getGoogleAuthClientID();

module.exports = {
    async googleTokenVerify(dbConfig, tokenToVerify) {
        const client = new OAuth2Client(CLIENT_ID);
        var payload;

        try { 
            payload = await token.verifyToken(client, tokenToVerify); 
        }
        catch(ex) {
            throw ex;
        }

        try {
            let possibleUserProfile = await token.getUserByGoogleID(dbConfig, payload["sub"]);
            return new Promise(async function(resolve){
                if (Object.keys(possibleUserProfile).length === 0) { //checks if returned a user or an empty list
                    resolve(await userService.createNewUser(payload["sub"], payload["email"], payload["name"], payload["picture"], dbConfig));
                }
                else {
                    resolve(possibleUserProfile);
                }
            });
        }
        catch(ex) {
            throw ex;
        }
    }
};
