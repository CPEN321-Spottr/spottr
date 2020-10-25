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
        // TODO
    }
}