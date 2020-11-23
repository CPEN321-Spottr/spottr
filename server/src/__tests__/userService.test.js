/*eslint-env jest*/
var userService = require("../service/userService.js");

if(typeof jest !== "undefined") {
  jest.mock("../data/userData.js");
}

jest.mock("../data/userData.js");
jest.mock("../data/userMultiplierData.js");
const connection = require("../connection.js");
var dbConfig = connection.getDbConfig();

// Test constants //
const test_sub = "googleid123abc";
const test_email = "abc9944@shaw.ca";
const test_name = "Test McTester";
const users = {
  1: {name: "Spottr User 1", user_multiplier_id: 1},
  2: {name: "Spottr User 2", user_multiplier_id: 2}
};

describe("User Service Tests", () => {
  it("test getAllUsers", () => {
      return userService.getAllUsers(dbConfig)
          .then((data) => expect(data).toEqual("Successfully found all users"));
  });
  it("test getUserByUserId", () => {
    return userService.getUserById(1, dbConfig)
          .then((data) => expect(data.name).toEqual("Spottr User 1"));
  });
  it("test createNewUser", () => {
    return userService.createNewUser(test_sub, test_email, test_name, dbConfig)
          .then((data) => expect(data).toEqual(users[1]));
  });
});
