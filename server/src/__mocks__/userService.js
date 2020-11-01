const userMultiplierData = require('../data/userMultiplierData.js');
const userData = require('../data/userData.js');

const users = {
    1: {name: 'Spottr User 1'},
    2: {name: 'Spottr User 2'}
}

module.exports = {
    getAllUsers : async function (dbConfig) {
        return new Promise(function(resolve) {
            var getUsers = "Successfully found all users";
            resolve(getUsers);
        });
    },
    getUserById : async function (userId, dbConfig) {
        return new Promise(function(resolve) {
            resolve(users[userId]);
        });
    }
}