const payloadExistingUser = {
    "sub" : 123,
    "email" : "abc@shaw.ca",
    "name" : "Abc Smith"
};
const payloadNewUser = {
    "sub" : 456,
    "email" : "newUser@shaw.ca",
    "name" : "New Smith"
};
const errorPayload = {
    "sub" : "kfisd7uhwbdm",
    "name" : "Ble bal \n"
};

module.exports = {
    async getUserByGoogleID(dbConfig, googleID) {
        if (googleID === 456) {
            return {};
        }
        else if (googleID === 123) {
            return payloadExistingUser;
        }
        else {
            throw ("Invalid Google ID");
        }
    },

    async verifyToken(client, token) {
        if (token === "badToken") {
            throw ("Bad google token");
        }
        else if (token === "tokenWithDatabaseIssue") {
            return errorPayload;
        }
        else if (token === "existingUser") {
            return payloadExistingUser;
        } 
        return payloadNewUser;
    }
};