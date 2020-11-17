/*eslint-env jest*/
<<<<<<< HEAD
var userService = require("../service/userService.js");
=======

var userService = require("../__mocks__/userService.js");
>>>>>>> main

if(typeof jest !== "undefined") {
  jest.mock("../data/userData.js");
}

jest.mock("../data/userData.js");
jest.mock("../data/userMultiplier.js");
const connection = require("../connection.js");
var dbConfig = connection.getDbConfig();

// Test constants //
const test_sub = "googleid123abc";
const test_email = "abc9944@shaw.ca";
const test_name = "Test McTester";
const users = {
  1: {name: "Spottr User 1"},
  2: {name: "Spottr User 2"}
};

it("test getAllUsers", () => {
    return userService.getAllUsers(dbConfig)
        .then((data) => expect(data).toEqual("Successfully found all users"));
});
it("test getUserByUserId", () => {
  return userService.getUserById(1, dbConfig)
        .then((data) => expect(data.name).toEqual(users[1]));
});
it("test createNewUser", () => {
  return userService.createNewUser(test_sub, test_email, test_name, dbConfig)
        .then((data) => expect(data).toEqual(test_sub + test_email + test_name));
});
