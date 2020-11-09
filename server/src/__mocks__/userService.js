const userMultiplierData = require("../data/userMultiplierData.js");
const userData = require("../data/userData.js");

const users = {
    1: {name: "Spottr User 1"},
    2: {name: "Spottr User 2"}
}

module.exports = {
    createNewUser : async function (sub, email, name, dbConfig) {
        const newUser = sub + email + name;
        return new Promise(async function(resolve) {
            resolve(await newUser);
        });
    },
    getAllUsers : async function (dbConfig) {
        var getUsers = "Successfully found all users";
        return new Promise(function(resolve) {
            resolve(getUsers);
        });
    },
    getUserById : async function (userId, dbConfig) {
        return new Promise(function(resolve) {
            resolve(users[userId]);
        });
    }
}
