var userService = require('../__mocks__/userService.js');
jest.mock("../data/userData.js");

const connection = require('../connection.js');
var dbConfig = connection.getDbConfig();

it('test getAllUsers', () => {
    expect.assertions(1);
    return userService.getAllUsers(dbConfig).then(data => expect(data).toEqual("Successfully found all users"));
});

it('test getUserByUserId', () => {
  expect.assertions(1);
  return userService.getUserById(1, dbConfig).then(data => expect(data.name).toEqual('Spottr User 1'));
});
