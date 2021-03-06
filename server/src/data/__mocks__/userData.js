//const userMultiplierData = require("../../../src/data/userMultiplierData.js");
//const userData = require("../../../src/data/userData.js");
const constants = require("../../constants.js");

const users = {
    1: {name: "Spottr User 1", user_multiplier_id: 1},
    2: {name: "Spottr User 2", user_multiplier_id: 2}
};

module.exports = {
    async createUser(dbConfig, sub, email, name) {
        const newUser = sub + email + name;
        return new Promise(async function(resolve) {
            resolve(1);
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
    },
    async updateUserSpottrPoints(userId, newAmount, dbConfig) {
        return 1;
    }
};
