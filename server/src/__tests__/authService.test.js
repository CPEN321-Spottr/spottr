/*eslint-env jest*/
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

describe("authService Tests", () => {
    it("test googleTokenVerify with valid token of new user", () => {
        const token = "goodToken";
        return authService.googleTokenVerify(dbConfig, token)
            .then((data) => expect(data).toEqual(payloadNewUser["sub"] + payloadNewUser["email"] + payloadNewUser["name"]));
    });

    it("test googleTokenVerify with invalid token", async() => {
        const token = "badToken";
        let thrownError;
        try {
            await authService.googleTokenVerify(dbConfig, token);
        }
        catch (error) {
            thrownError = error;
        }
            
        expect(thrownError).toEqual("Bad google token");
    });

    it("test googleTokenVerify with valid token of existing user", () => {
        const token = "existingUser";
        return authService.googleTokenVerify(dbConfig, token)
            .then((data) => expect(data).toEqual(payloadExistingUser));
    });

    it("test googleTokenVerify with valid token causing database exception", async () => {
        const token = "tokenWithDatabaseIssue";
        let thrownError;
        try {
            await authService.googleTokenVerify(dbConfig, token);
        }
        catch (error) {
            thrownError = error;
        }
            
        expect(thrownError).toEqual("Invalid Google ID");
    });
});
