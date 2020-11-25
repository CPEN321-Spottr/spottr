module.exports = {
    async registerFirebaseToken(registrationToken) {
        if(registrationToken === "badToken"){
          throw ("Invalid Token");
        }
        return new Promise(function(resolve) {
          resolve("Registration of token successful");
        });
    },
    async sendWorkoutToFirebase(newWorkoutHistory, userName, dbConfig) {
      return new Promise(function(resolve) { resolve(1); });
    },
    generateWorkoutHistoryMessage(name, profileImg, userProfileId, datePosted, length, muscleGroup, 
      spottrPoints, planId) {
        let retData = {
          "user_name": name,
          "user_profile_img_url": profileImg,
          "user_profile_id": userProfileId,
          "posted": datePosted,
          "workout_history_actual_length_sec": length,
          "workout_history_major_muscle_group": muscleGroup,
          "workout_history_spottr_points": spottrPoints,
          "workout_plan_id": planId
        };

        return retData;
    }
};