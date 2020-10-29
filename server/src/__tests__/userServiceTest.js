var userService = require('../__mocks__/userService.js');
jest.mock("../data/userData.js");

var dbConfig = {
    user: 'u0tri2ukfid8bnj',
    password: 'Udh!v6payG2cTwuVAXvta%0&y',
    server: 'eu-az-sql-serv1.database.windows.net', 
    database: 'dkxp1krn55tloca'
  };

it('test createNewUser', () => {
    expect.assertions(1);
    return userService.createNewUser("JestTestID","jest@shaw.ca","Jest Test",dbConfig).then(data => expect(data).toEqual("Successfully created user"));
});
