const constants = require("../../constants.js");

module.exports = {
    async googleTokenVerify(dbConfig, tokenToVerify) {
        return new Promise(function(resolve, reject){
            if (tokenToVerify === "goodToken") {
                resolve({"id":10,"name":"New User","email":"newuser@gmail.com","user_multiplier_id":1,"google_user_id":"abc","spottr_points":0});
            }
            else if (tokenToVerify === "badToken"){
                reject(constants.INVALID_TOKEN_RESPONSE);
            }
            else {
                reject(constants.ERROR_RESPONSE);
            }
        });
    }
}