//const userMultiplierData = require("../../../src/data/userMultiplierData.js");
//const userData = require("../../../src/data/userData.js");
const constants = require("../../constants.js")

const users = {
    1: {name: "Spottr User 1"},
    2: {name: "Spottr User 2"}
};

module.exports = {
    async createNewUser(sub, email, name, dbConfig) {
        const newUser = sub + email + name;
        return new Promise(async function(resolve) {
            resolve(await newUser);
        });
    },
    async getAllUsers(dbConfig) {
        var getUsers = "Successfully found all users";
        return new Promise(function(resolve) {
            resolve(getUsers);
            reject()
        });
    },
    async getUserById(userId, dbConfig) {
        return new Promise(function(resolve, reject) {
            if(userId==1 || userId==2)
                resolve(users[String(userId)]);
            else{
                reject(constants.ERROR_RESPONSE);
            }
        });
    }
};
