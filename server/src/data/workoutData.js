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

    getWorkoutPlanById: function(workoutPlanId, dbConfig) {
      try {
        return sql
          .connect(dbConfig)
          .then((pool) => {
            return pool
              .request()
              .input("wpid", sql.Int, workoutPlanId)
              .query(
                "SELECT * FROM workout_plan WHERE id = @wpid"
              );
          })
          .then((result) => {
            if (result.recordset.length == 0) throw ('No workout plan found for given workout plan id: ' + workoutPlanId);
            return result.recordset[0];
          })
      } catch(ex) {
          console.log(ex);
          throw ex;
      }
    },

    getWorkoutHistoryById: function(workoutHistoryId, dbConfig) {
      try {
        return sql
          .connect(dbConfig)
          .then((pool) => {
            return pool
              .request()
              .input("whid", sql.Int, workoutHistoryId)
              .query(
                "SELECT * FROM workout_history WHERE id = @whid"
              );
          })
          .then((result) => {
            if (result.recordset.length == 0) throw ('No workout history found for given workout history id: ' + workoutHistoryId);
            return result.recordset[0];
          })
      } catch(ex) {
          console.log(ex);
          throw ex;
      }
    },

    createWorkoutHistoryEntry: function(workoutPlan, lengthOfWorkoutSec, userId, dbConfig) {
      try {
          return sql
            .connect(dbConfig)
            .then((pool) => {
              return pool
                .request()
                .input("upid", sql.Int, userId)
                .input("wpid", sql.Int, workoutPlan['id'])
                .input("als", sql.Int, lengthOfWorkoutSec)
                .input("mmgid", sql.Int, workoutPlan['major_muscle_group_id'])
                .input("sp", sql.Int, workoutPlan['spottr_points'])
                .input("dtu", sql.DateTime, new Date().toLocaleString())
                .query(
                  "INSERT INTO workout_history(user_profile_id, workout_plan_id, actual_length_sec, major_muscle_group_id, spottr_points, date_time_utc) OUTPUT Inserted.id VALUES (@upid, @wpid, @als, @mmgid, @sp, @dtu)"
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

    createWorkoutPlanEntry: function(dbConfig) {
        try {
            return sql
              .connect(dbConfig)
              .then((pool) => {
                return pool
                  .request()
                  .query(
                    "INSERT INTO workout_plan OUTPUT Inserted.id DEFAULT VALUES"
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

            for (var i = 0; i < workoutPlan['exercises'].length; i += 1) {
                lastPool = pool
                          .request()
                          .input("wpid", sql.Int, workoutPlan['workout_plan_id'])
                          .input("eid", sql.Int, workoutPlan['exercises'][i]['exercise_id'])
                          .input("nr", sql.Int, workoutPlan['exercises'][i]['reps'])
                          .input("ns", sql.Int, workoutPlan['exercises'][i]['sets'])
                          .input("won", sql.Int, workoutPlan['exercises'][i]['workout_order_num'])
                          .query(
                            "INSERT INTO workout_exercise(workout_plan_id, exercise_id, num_reps, num_sets, workout_order_num) VALUES (@wpid, @eid, @nr, @ns, @won)"
                          );

                if (i < workoutPlan['breaks'].length) {
                  lastPool = pool
                          .request()
                          .input("wpid", sql.Int, workoutPlan['workout_plan_id'])
                          .input("eid", sql.Int, workoutPlan['breaks'][i]['exercise_id'])
                          .input("len", sql.Int, workoutPlan['breaks'][i]['duration_sec'])
                          .input("won", sql.Int, workoutPlan['breaks'][i]['workout_order_num'])
                          .query(
                            "INSERT INTO workout_exercise(workout_plan_id, exercise_id, num_reps, num_sets, workout_order_num) VALUES (@wpid, @eid, @len, 1, @won)"
                          );
                }
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

  updateUserMultiplier : function(targetMuscleGroup, newMultiplier, userMultiplierId, dbConfig) {
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
  },

  updateWorkoutPlan : function(workoutPlanId, estLenSec, majorMuscleGroupId, associatedMultiplier, spottrPoints, dbConfig) {
    try {
      return sql
        .connect(dbConfig)
        .then((pool) => {
          return pool
              .request()
              .input("wpid", sql.Int, workoutPlanId)
              .input("esl", sql.Int, estLenSec)
              .input("mmgpi", sql.Int, majorMuscleGroupId)
              .input("sp", sql.Int, spottrPoints)
              .input("am", sql.Decimal(4,3), associatedMultiplier)
              .query(
                "UPDATE workout_plan SET est_length_sec = @esl, major_muscle_group_id = @mmgpi, associated_multiplier = @am, spottr_points = @sp WHERE id = @wpid"
            );
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