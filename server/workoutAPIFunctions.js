const generator = require('./workoutPlanGenerationEngine.js');
const data = require('./workoutData.js');

module.exports = {
    generateWorkoutPlan: function(userId, lengthMin, targetMuscleGroups, dbConfig) {
        var workoutPlan = generator.generateWorkoutPlan(
            lengthMin, 
            data.getExercisesByTargetMuscleGroups(targetMuscleGroups, dbConfig), 
            multiplier, 
            data.createWorkoutPlanEntry(userId, dbConfig)
        );

        data.createWorkoutExerciseEntries(workoutPlan);

        return workoutPlan;
    }
}
