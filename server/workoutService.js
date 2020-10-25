const generator = require('./workoutPlanGenerationEngine.js');
const data = require('./workoutData.js');
const userData = require('./userData.js');

module.exports = {
    generateWorkoutPlan: async function (userId, lengthMinutes, targetMuscleGroup, dbConfig) {
        // Collect required data from different parts of the database
        const user = await userData.getUserByUserId(userId, dbConfig);
        const userMultiplier = await data.getUserMultiplier(targetMuscleGroup, user.user_multiplier_id, dbConfig);
        const possibleExercises = await data.getExercisesByTargetMuscleGroups(targetMuscleGroup, dbConfig);
        //const workoutPlanId = await data.createWorkoutPlanEntry(userId, dbConfig); TODO: ADD BACK LATER
        const workoutPlanId = 1;

        var workoutPlan = generator.generateWorkoutPlan(
            lengthMinutes, 
            possibleExercises, 
            userMultiplier, 
            workoutPlanId
        );

        data.createWorkoutExerciseEntries(workoutPlan, dbConfig);

        return workoutPlan;
    }
}
