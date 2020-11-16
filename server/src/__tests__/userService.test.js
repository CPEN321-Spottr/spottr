var userService = require("../service/userService.js");

jest.mock("../data/userData.js");
const connection = require("../connection.js");
var dbConfig = connection.getDbConfig();

// Test constants //
const test_sub = "googleid123abc";
const test_email = "abc9944@shaw.ca";
const test_name = "Test McTester";

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
const users = {
  1: {name: "Spottr User 1"},
  2: {name: "Spottr User 2"}
};

const allUsers =
[{"id":6,"name":"Test User","email":"test@gmail.com","user_multiplier_id":1,"google_user_id":"tnahbtexjiepxejngosephskvkrkvbnioentndgddthkjernovhyahsxhuozqalaglijaoijeteavkrvyrashwemqndfuabmyikknhzwqrkulcwgcvbukhkzrsgxshdmlbkjpjikeyfmazvqquakbpelasyytytkssrdfwafdfdaekvmbfuebwhhfmkkackbautbxwdyiybblliwxqzfdbgrewgxglmjyvnwgzzxljqpjggmhyjyjnabomcyezos","spottr_points":0},{"id":7,"name":"User Test","email":"test2@gmail.com","user_multiplier_id":2,"google_user_id":"ssrvbclydwlrfmwtauqtpphpshqupcuqwriaktoarduelmrdjujtedmatbakhjshvqpbckdqmtvzoveiiitfwncuxgcgiswjquxbetddguukwoqkzehjtprgkcojkccpfsxdjtpcggeemjwbcdwrusdeerwcjhwuifedaluliobcmbbegvgnppxompnowlzpxlfvrapluhojpghjjylvafbjkidjpbxijoefwkegezvoqbnotmioofwvejaondxy","spottr_points":0},{"id":34,"name":"Jake Wickstrom","email":"jtwickstrom@gmail.com","user_multiplier_id":20,"google_user_id":"101049768684883233663                                                                                                                                                                                                                                           ","spottr_points":0},{"id":37,"name":"Zane Frantzen","email":"frantzen.zane@gmail.com","user_multiplier_id":23,"google_user_id":"116756994685917651077                                                                                                                                                                                                                                           ","spottr_points":940},{"id":38,"name":"Sean Garvey","email":"sgarveybc@gmail.com","user_multiplier_id":24,"google_user_id":"115028785271978674060                                                                                                                                                                                                                                           ","spottr_points":0},{"id":39,"name":"Dana Harlos","email":"danaharlos@gmail.com","user_multiplier_id":25,"google_user_id":"108856658408388780458                                                                                                                                                                                                                                           ","spottr_points":0},{"id":40,"name":"Yaman Malkoç","email":"yamanmalkoc14@gmail.com","user_multiplier_id":26,"google_user_id":"117336305409863717402                                                                                                                                                                                                                                           ","spottr_points":0},{"id":41,"name":"CPEN321 Tutorials","email":"noreplydabsonly@gmail.com","user_multiplier_id":27,"google_user_id":"102245035949797476910                                                                                                                                                                                                                                           ","spottr_points":0},{"id":42,"name":"cpen321 test","email":"cpen321test@gmail.com","user_multiplier_id":32,"google_user_id":"108956686198345665190                                                                                                                                                                                                                                           ","spottr_points":0}];
const userId6 = {"id":6,"name":"Test User","email":"test@gmail.com","user_multiplier_id":1,"google_user_id":"tnahbtexjiepxejngosephskvkrkvbnioentndgddthkjernovhyahsxhuozqalaglijaoijeteavkrvyrashwemqndfuabmyikknhzwqrkulcwgcvbukhkzrsgxshdmlbkjpjikeyfmazvqquakbpelasyytytkssrdfwafdfdaekvmbfuebwhhfmkkackbautbxwdyiybblliwxqzfdbgrewgxglmjyvnwgzzxljqpjggmhyjyjnabomcyezos","spottr_points":0};