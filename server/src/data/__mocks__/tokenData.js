/*eslint security_detect-possible-timing-attacks: 0*/

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
        if (456 === googleID) {
            return {};
        }
        else if (123 === googleID) {
            return payloadExistingUser;
        }
        else {
            throw ("Invalid Google ID");
        }
    },

    async verifyToken(client, token) {
        if ("badToken" === token) {
            throw ("Bad google token");
        }

        if ("tokenWithDatabaseIssue" === token) {
            return errorPayload;
        }
        else if ("existingUser" === token) {
            return payloadExistingUser;
        } 
        
        return payloadNewUser;
    }
};