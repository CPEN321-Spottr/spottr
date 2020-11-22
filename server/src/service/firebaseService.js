var faker = require("faker");

const firebaseData = require("../data/firebaseData.js");

module.exports = {
    async registerFirebaseToken(registrationToken) {
        return new Promise(function(resolve) {
          resolve(firebaseData.createFirebaseTokenEntry(registrationToken));
        });
    },

    async sendWorkoutToFirebase(newWorkoutHistory, userName, dbConfig) {
      // Generate message
      var payload = {
        data: {
          "profile_img_uri": faker.image.imageUrl(),
          "name": userName,
          "posted": new Date(newWorkoutHistory.date_time_utc).toDateString(),
          "workoutHistory": newWorkoutHistory
        }
      };

      var options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
      };

      // Collect tokens and send message
      let tokens = await firebaseData.getAllFirebaseTokens(dbConfig);
      let success = await firebaseData.sendFirebaseMessages(tokens, payload, options);
      
      if (!success) { throw ("Unable to send firebase message"); }
      return new Promise(function(resolve) { resolve(1); });
    }
};
