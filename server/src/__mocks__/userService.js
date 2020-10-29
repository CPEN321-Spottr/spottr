const userMultiplierData = require('../data/userMultiplierData.js');
const userData = require('../data/userData.js');

module.exports = {
    createNewUser : async function (sub, email, name, dbConfig) {
        // Create all the data required for a new user in the database structure
        return new Promise(function(resolve, reject) {
            var createdUser = "Successfully created user";
            resolve(createdUser);
        });
    }
}