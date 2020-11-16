const util = require("../util.js");
const constants = require("../constants.js");

var faker = require("faker");
var admin = require("firebase-admin");
const workoutData = require("../data/workoutData.js");

const NOTIFICATIONS_TO_SEND = 12;
const TIME_BETWEEN_SEC = 2;

async function generateNotificationBatch(admin, registrationToken) {
  for (var i = 0; i < NOTIFICATIONS_TO_SEND; i++) {
    // generate message with Faker
    var payload = {
      data: {
        profile_img_uri: faker.image.imageUrl(),
        name: faker.name.findName(),
        posted: faker.time.recent().toString()
      }
    };

    var options = {
      priority: "high",
      timeToLive: 60 * 60 * 24
    };

    // send message
    admin.messaging().sendToDevice(registrationToken, payload, options);

    // generate time to wait before next message (standard time +- 1 sec) and execute it
    var timeToWait = Math.floor(Math.random() * 2) - 1 + TIME_BETWEEN_SEC;
    await util.sleep(timeToWait * 1000);
  }
  return new Promise(async function(resolve) {
    resolve(constants.SUCCESS_RESPONSE);
  });
}

module.exports = {
    async sendFirebaseMessage(registrationToken, payload, options) {
      return await admin.messaging().sendToDevice(registrationToken, payload, options)
        .then(function(response) { 
          return 1;
        })
        .catch(function(error) {
          return 0;
      });
    },

    async firebaseTokenVerify(registrationToken) {
        return new Promise(function(resolve) {
          resolve(generateNotificationBatch(admin, registrationToken));
        });
    },

    async sendWorkoutToFirebase(workoutHistory, userName) {
      // TODO: Need to figure this out still
      
      // TODO: REMOVE LATER
      var registrationToken = "123123123";

      var payload = {
        data: {
          "profile_img_uri": faker.image.imageUrl(),
          "name": userName,
          "posted": new Date(workoutHistory.date_time_utc).toDateString(),
          "workoutHistory": workoutHistory
        }
      };

      var options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
      };

      // send message
      let success = await this.sendFirebaseMessage(registrationToken, payload, options);
      
      if (!success) { throw ("Unable to send firebase message"); }
      return new Promise(function(resolve) { resolve(1); });
    }
};
