/*eslint-env jest*/

var userService = require("../__mocks__/userService.js");

if(typeof jest !== "undefined") {
  jest.mock("../data/userData.js");
}


const connection = require("../connection.js");
var dbConfig = connection.getDbConfig();

// Test constants //
const test_sub = "googleid123abc";
const test_email = "abc9944@shaw.ca";
const test_name = "Test McTester";

it("test getAllUsers", () => {
    expect.assertions(1);
    return userService.getAllUsers(dbConfig)
        .then((data) => expect(data).toEqual("Successfully found all users"));
});

it("test getUserByUserId", () => {
  expect.assertions(1);
  return userService.getUserById(1, dbConfig)
        .then((data) => expect(data.name).toEqual("Spottr User 1"));
});

it("test createNewUser", () => {
  expect.assertions(1);
  return userService.createNewUser(test_sub, test_email, test_name, dbConfig)
        .then((data) => expect(data).toEqual(test_sub + test_email + test_name));
});
