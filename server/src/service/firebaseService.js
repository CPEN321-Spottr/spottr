const util = require('../util.js');
const constants = require('../constants.js');

var faker = require('faker');
var admin = require("firebase-admin");


module.exports = {
    firebaseTokenVerify: async function(registrationToken) {
        return generateNotificationBatch(admin, registrationToken);
    },

    sendWorkoutToFirebase: async function(workoutHistory) {
        throw 'NOT IMPLEMENTED YET';
        // TODO: need to still implement!
    }
}

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
    admin.messaging().sendToDevice(registrationToken, payload, options)
      .then(function(response) {
      })
      .catch(function(error) {
        console.log("Error sending message:", error);
      });

    // generate time to wait before next message (standard time +- 1 sec) and execute it
    var timeToWait = Math.floor(Math.random() * 2) - 1 + TIME_BETWEEN_SEC;
    await util.sleep(timeToWait * 1000);
  }

  return constants.SUCCESS_RESPONSE;
}