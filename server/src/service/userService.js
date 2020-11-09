const userMultiplierData = require('../data/userMultiplierData.js');
const userData = require('../data/userData.js');

module.exports = {
    createNewUser : async function (sub, email, name, dbConfig) {
        // Create all the data required for a new user in the database structure
        var newUserId = await userData.createUser(dbConfig, sub, email, name);

        var newMultiplierId = await userMultiplierData.createUserMultipler(newUserId, dbConfig);
        await userData.upsertUserMultiplier(newUserId, newMultiplierId, dbConfig);

        return new Promise(async function(resolve){
            resolve(await userData.getUserByUserId(newUserId, dbConfig))
        });
    },

    getAllUsers : async function (dbConfig) {
        return new Promise(function(resolve) {
            resolve(await userData.getUsers(dbConfig));
        });
    },

    getUserById : async function (userId, dbConfig) {
        return new Promise(function(resolve) {
            resolve(await userData.getUserByUserId(userId, dbConfig));
        })
    }
}
