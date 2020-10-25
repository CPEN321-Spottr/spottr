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
                return result.recordset;
              })
        } catch(ex) {
            console.log(ex);
            return ex;
        }
    },

    getUserMultiplier: function(targetMuscleGroup, multiplierId, dbConfig) {
        try {
            return sql
              .connect(dbConfig)
              .then((pool) => {
                // Should probably be checking the database instead of hardcoding this,
                // but it is okay for now...
                if (targetMuscleGroup == 1) {
                    return pool
                  .request()
                  .input("multiplierId", sql.Int, multiplierId)
                  .query(
                    "SELECT arms FROM user_multiplier WHERE id = @multiplierId"
                  );
                } else {
                    throw 'Invalid requested targetMuscleGroup value!';
                }
              })
              .then((result) => {
                return result.recordset[0]['arms'];
              })
        } catch(ex) {
            console.log(ex);
            return ex;
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
            return ex;
        }
    },

    createWorkoutExerciseEntries: function(workoutPlan, dbConfig) {
      try {
        return sql
          .connect(dbConfig)
          .then((pool) => {
            var lastPool;

            for (var i = 0; i < workoutPlan['num_exercises'] * 2; i += 2) {
              lastPool = pool
                          .request()
                          .input("wpid", sql.Int, workoutPlan['workout_plan_id'])
                          .input("eid", sql.Int, workoutPlan[i]['exercise_id'])
                          .input("nr", sql.Int, workoutPlan[i]['reps'])
                          .input("ns", sql.Int, workoutPlan[i]['sets'])
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
        return ex;
    }
  }
}