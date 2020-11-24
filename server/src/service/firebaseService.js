var faker = require("faker");

const firebaseData = require("../data/firebaseData.js");

module.exports = {
    generateWorkoutHistoryMessage(name, profileImg, userProfileId, datePosted, length, muscleGroup, 
      spottrPoints, planId) {
        return {
          "user_name": name,
          "user_profile_img_url": profileImg,
          "user_profile_id": userProfileId,
          "posted": datePosted,
          "workout_history_actual_length_sec": length,
          "workout_history_major_muscle_group": muscleGroup,
          "workout_history_spottr_points": spottrPoints,
          "workout_plan_id": planId
        };
    },
  
    async registerFirebaseToken(registrationToken, dbConfig) {
        return new Promise(function(resolve) {
          resolve(firebaseData.createFirebaseTokenEntry(registrationToken, dbConfig));
        });
    },

    async sendWorkoutToFirebase(newWorkoutHistory, userName, profileImg, dbConfig) {
      // Generate message
      var payload = {
        data: this.generateWorkoutHistoryMessage(
          userName,
          profileImg,
          newWorkoutHistory["user_profile_id"].toString(),
          new Date(newWorkoutHistory.date_time_utc).toDateString(),
          newWorkoutHistory["actual_length_sec"].toString(),
          newWorkoutHistory["major_muscle_group_id"].toString(),
          newWorkoutHistory["spottr_points"].toString(),
          newWorkoutHistory["workout_plan_id"].toString()
        )
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
