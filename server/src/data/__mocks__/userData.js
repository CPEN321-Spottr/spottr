//const userMultiplierData = require("../../../src/data/userMultiplierData.js");
//const userData = require("../../../src/data/userData.js");
const constants = require("../../constants.js");

const users = {
    1: {name: "Spottr User 1"},
    2: {name: "Spottr User 2"}
};

module.exports = {
    async createUser(sub, email, name, dbConfig) {
        const newUser = sub + email + name;
        return new Promise(async function(resolve) {
            resolve(5);
        });
    },
    async getUsers(dbConfig) {
        var getUsers = "Successfully found all users";
        return new Promise(function(resolve) {
            resolve(getUsers);
        });
    },
    async getUserByUserId(userId, dbConfig) {
        return new Promise(function(resolve) {
            resolve(users[String(userId)]);
        });
    },
    async upsertUserMultiplier(newUserId, newMultiplierId, dbConfig){
        //Mock upsert just edits database
    }
};
