var sql = require("mssql");

module.exports = {
    getExercisesByTargetMuscleGroups: function(targetMuscleGroup, dbConfig) {
        try {
            return sql
              .connect(dbConfig)
              .then((pool) => {
                return pool
                  .request()
                  .input("targetMuscleGroup", sql.Int, targetMuscleGroup)
                  .query(
                    "SELECT * FROM exercise WHERE major_muscle_group_id = @targetMuscleGroup"
                  );
              })
              .then((result) => {
                if (result.recordset.length == 0) throw ('No exercises found for given target muscle group: ' + targetMuscleGroup);
                return result.recordset;
              })
        } catch(ex) {
            console.log(ex);
            throw ex;
        }
    },

    getUserMultiplier: function(targetMuscleGroup, multiplierId, dbConfig) {
        try {
            return sql
              .connect(dbConfig)
              .then((pool) => {
                // Should probably be checking the database instead of hardcoding this,
                // but it is okay for now... Will need to update db structure to fix properly
                if (targetMuscleGroup == 1) {
                    return pool
                  .request()
                  .input("multiplierId", sql.Int, multiplierId)
                  .query(
                    "SELECT arms FROM user_multiplier WHERE id = @multiplierId"
                  );
                } else {
                    throw 'Invalid requested targetMuscleGroup value! Only muscleGroupId 1 is being handled!';
                }
              })
              .then((result) => {
                if (result.recordset.length == 0) throw ('No user multiplier records found for given user with multiplier id: ' + multiplierId);
                return result.recordset[0]['arms'];
              })
        } catch(ex) {
            console.log(ex);
            throw ex;
        }
    },

    createWorkoutPlanEntry: function(userId, dbConfig) {
        try {
            return sql
              .connect(dbConfig)
              .then((pool) => {
                return pool
                  .request()
                  .input("userId", sql.Int, userId)
                  .query(
                    "INSERT INTO workout_plan(user_profile_id) OUTPUT Inserted.id VALUES (@userId)"
                  );
              })
              .then((result) => {
                return result.recordset[0]['id'];
              })
        } catch(ex) {
            console.log(ex);
            throw ex;
        }
    },

    createWorkoutExerciseEntries: function(workoutPlan, dbConfig) {
      try {
        return sql
          .connect(dbConfig)
          .then((pool) => {
            var lastPool;

            for (var i = 0; i < workoutPlan['exercises'].length; i += 2) {
              lastPool = pool
                          .request()
                          .input("wpid", sql.Int, workoutPlan['workout_plan_id'])
                          .input("eid", sql.Int, workoutPlan['exercises'][i]['exercise_id'])
                          .input("nr", sql.Int, workoutPlan['exercises'][i]['reps'])
                          .input("ns", sql.Int, workoutPlan['exercises'][i]['sets'])
                          .query(
                            "INSERT INTO workout_exercise(workout_plan_id, exercise_id, num_reps, num_sets) VALUES (@wpid, @eid, @nr, @ns)"
                          );
            }

            return lastPool;
          })
          .then((result) => {
            return result;
          })
      } catch(ex) {
          console.log(ex);
          throw ex;
      }
  },

  upsertNewMultiplier : function(targetMuscleGroup, newMultiplier, userMultiplierId, dbConfig) {
    try {
      return sql
        .connect(dbConfig)
        .then((pool) => {
          // Should probably be checking the database instead of hardcoding this,
          // but it is okay for now... Will need to update db structure to fix properly
          if (targetMuscleGroup == 1) {
            return pool
              .request()
              .input("umid", sql.Int, userMultiplierId)
              .input("nm", sql.Decimal(4,3), newMultiplier)
              .query(
                "UPDATE user_multiplier SET arms = @nm WHERE id = @umid"
              );
          } else {
              throw 'Invalid requested targetMuscleGroup value! Only muscleGroupId 1 is being handled!';
          }
        })
        .then((result) => {
          return result;
        })
    } catch(ex) {
        console.log(ex);
        throw ex;
    }
  }
  
}