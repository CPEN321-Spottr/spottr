const userMultiplierData = require('../data/userMultiplierData.js');
const userData = require('../data/userData.js');

module.exports = {
    createNewUser : async function (sub, email, name, dbConfig) {
        // Create all the data required for a new user in the database structure
        return new Promise( async function(resolve) {
            var newUserId = await userData.createUser(dbConfig, sub, email, name);
            
            var newMultiplierId = await userMultiplierData.createUserMultipler(newUserId, dbConfig);
            await userData.upsertUserMultiplier(newUserId, newMultiplierId, dbConfig);
            
            var newUser = await userData.getUserByUserId(newUserId, dbConfig);
            resolve(newUser);
        });
    }
}