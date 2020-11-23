const userMultiplierData = require("../data/userMultiplierData.js");
const userData = require("../data/userData.js");

module.exports = {
    async createNewUser(sub, email, name, dbConfig) {
        // Create all the data required for a new user in the database structure
        var newUserId = await userData.createUser(dbConfig, sub, email, name);

        var newMultiplierId = await userMultiplierData.createUserMultipler(newUserId, dbConfig);
        await userData.upsertUserMultiplier(newUserId, newMultiplierId, dbConfig);

        return new Promise(async function(resolve){
            resolve(await userData.getUserByUserId(newUserId, dbConfig));
        });
    },

    async getAllUsers(dbConfig) {
        return new Promise(async (resolve) => resolve(await userData.getUsers(dbConfig)));
    },

    async getUserById(userId, dbConfig) {
        return new Promise(async (resolve) => resolve(await userData.getUserByUserId(userId, dbConfig)));
    }
};
