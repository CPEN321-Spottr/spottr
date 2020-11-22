var faker = require("faker");

const firebaseData = require("../data/firebaseData.js");

module.exports = {
    async registerFirebaseToken(registrationToken, dbConfig) {
        return new Promise(function(resolve) {
          resolve(firebaseData.createFirebaseTokenEntry(registrationToken, dbConfig));
        });
    },

    async sendWorkoutToFirebase(newWorkoutHistory, userName, dbConfig) {
      // Generate message
      var payload = {
        data: {
          "profile_img_uri": faker.image.imageUrl(),
          "name": userName,
          "posted": new Date(newWorkoutHistory.date_time_utc).toDateString(),
          "workout_history_id": newWorkoutHistory.id.toString(),
          "workout_history_actual_length_sec": newWorkoutHistory["actual_length_sec"].toString(),
          "workout_history_major_muscle_group": newWorkoutHistory["major_muscle_group_id"].toString(),
          "workout_history_spottr_points": newWorkoutHistory["spottr_points"].toString(),
          "workout_history_user_profile_id": newWorkoutHistory["user_profile_id"].toString(),
          "workout_history_workout_plan_id": newWorkoutHistory["workout_plan_id"].toString()
        }
      };

      var options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
      };

      // Collect tokens and send message
      let tokens = await firebaseData.getAllFirebaseTokens(dbConfig);
      let errorTokens = await firebaseData.sendFirebaseMessages(tokens, payload, options);
      
      if (errorTokens.length !== 0) { 
        throw ("Attempted to send firebase messages. Could not send messages to the following tokens: " + errorTokens.toString()); 
      }
      return new Promise(function(resolve) { resolve(1); });
    }
};
