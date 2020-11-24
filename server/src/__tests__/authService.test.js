/*eslint-env jest*/
var constants = require("../constants.js");
var authService = require("../service/authService.js");

jest.mock("../data/tokenData.js");
jest.mock("../service/userService.js");

const payloadNewUser = {
    "sub" : 456,
    "email" : "newUser@shaw.ca",
    "name" : "New Smith"
};
const payloadExistingUser = {
    "sub" : 123,
    "email" : "abc@shaw.ca",
    "name" : "Abc Smith"
};
const dbConfig = {};

describe("AuthService Tests", () => {
    it("test googleTokenVerify with valid token of new user", () => {
        const token = "goodToken";
        return authService.googleTokenVerify(dbConfig, token)
            .then((data) => expect(data).toEqual(payloadNewUser["sub"] + payloadNewUser["email"] + payloadNewUser["name"]));
    });
    it("test googleTokenVerify with invalid token", () => {
        const token = "badToken";
        return authService.googleTokenVerify(dbConfig, token)
            .then((data) => expect(data).toEqual(constants.INVALID_TOKEN_RESPONSE));
    });
    it("test googleTokenVerify with valid token of existing user", () => {
        const token = "existingUser";
        return authService.googleTokenVerify(dbConfig, token)
            .then((data) => expect(data).toEqual(payloadExistingUser));
    });
    it("test googleTokenVerify with valid token causing database exception", () => {
        const token = "tokenWithDatabaseIssue";
        return authService.googleTokenVerify(dbConfig, token)
            .then((data) => expect(data).toEqual(constants.ERROR_RESPONSE));
    });
});