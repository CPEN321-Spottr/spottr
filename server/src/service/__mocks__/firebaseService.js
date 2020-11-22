module.exports = {
    async registerFirebaseToken(registrationToken) {
        if(registrationToken === "badToken")
          throw ("Invalid Token");
        return new Promise(function(resolve) {
          resolve("Registration of token successful");
        });
    }
};