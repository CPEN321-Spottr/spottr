const token = require('../data/tokenData.js');
const userMultiplierData = require('../data/userMultiplierData.js');
const userData = require('../data/userData.js');

module.exports = {
    createNewUser : async function (sub, email, name, dbConfig) {
        // Create all the data required for a new user in the database structure
        var newUser = await token.createUser(dbConfig, sub, email, name);
        
        var newMultiplierId = await userMultiplierData.createUserMultipler(newUser.id, dbConfig);
        var finalUser = await userData.upsertUserMultiplier(userId, newMultiplierId, dbConfig);

        return finalUser;
    }
}