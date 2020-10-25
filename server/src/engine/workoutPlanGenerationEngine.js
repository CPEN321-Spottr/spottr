const { MAX } = require('mssql');
const util = require('../../util.js');
const workoutData = require('../data/workoutData.js');

const MAX_REST_SEC = 45;
const STD_REST_TIME_SEC = 20;
const TIME_ESTIMATE_SHIFT_FACTOR = 0.5;

module.exports = {
    generateWorkoutPlan: function(lengthMinutes, possibleExercises, multiplier, planId) {
        var workoutPlan = {
            workout_plan_id: planId
        };

        var adjustedExercises = [];

        // Calculate adjusted standard time and reps 
        for (var i = 0; i < possibleExercises.length; ++i) {
            adjustedExercises.push({});
            adjustedExercises[i]['name'] = util.clone(possibleExercises[i]['name']);
            adjustedExercises[i]['exercise_id'] = util.clone(possibleExercises[i]['id']);
            adjustedExercises[i]['description'] = util.clone(possibleExercises[i]['description']);
            adjustedExercises[i]['major_muscle_group_id'] = util.clone(possibleExercises[i]['major_muscle_group_id']);
            adjustedExercises[i]['sets'] = util.clone(possibleExercises[i]['std_sets']);

            adjustedExercises[i]['reps'] = util.clone(Math.round(possibleExercises[i]['std_reps'] * multiplier));

            if (multiplier <= 1) {
                // Lower than 1 multipliers est time does not scale linearly as we expect these users to need more time per rep
                adjustedExercises[i]['reps_time_sec'] = util.clone(util.roundToTwo(possibleExercises[i]['std_reps_time_sec'] 
                                                            * (((1 - multiplier) * TIME_ESTIMATE_SHIFT_FACTOR) + multiplier)));
            } else {
                // Greater than 1 multipliers est time scales linearly
                adjustedExercises[i]['reps_time_sec'] = util.clone(util.roundToTwo(possibleExercises[i]['std_reps_time_sec'] * (multiplier + 1)));
            }
        }

        // Calculate the time in between different exercises based upon the multiplier
        var restTime = STD_REST_TIME_SEC * ((1 - multiplier) + 1);
        restTime = restTime < MAX_REST_SEC ? restTime : MAX_REST_SEC;

        // Randomly select exercises to meet the target length of workout (+-10% seconds)
        // Only repeats exercises once all of them have been selected once
        var exerciseNum = 0;
        var planIndex = 0;
        var curLenSeconds = 0;
        var minimumLenSeconds = (lengthMinutes * 60) - 45;

        while (curLenSeconds < minimumLenSeconds) {
            var remainingIds = [];
            for (var i = 0; i < adjustedExercises.length; i++) {
                remainingIds[i] = i;
            }

            while (remainingIds.length > 0 && curLenSeconds < minimumLenSeconds) {
                // Randomly select an unselected exercise
                var selectedIdx = Math.floor(Math.random() * remainingIds.length);
                var selectedExercise = util.clone(adjustedExercises[remainingIds[selectedIdx]]);

                // Modulate the sets (+-1) to make things more interesting for the user
                selectedExercise.sets = Math.floor(Math.random() * 2) - 1 + selectedExercise.sets;

                // Update the workout plan
                workoutPlan[planIndex] = selectedExercise;
                planIndex++;
                exerciseNum++;

                // Add a rest if there is another exercise next, else add one more set to the last 
                // exercise to finish workout if theres still time to spare
                curLenSeconds += selectedExercise['reps_time_sec'] * selectedExercise['sets'];

                if ((curLenSeconds + restTime) < minimumLenSeconds) {
                    workoutPlan[planIndex] = {
                        name: "Rest",
                        duration_sec: restTime
                    };
                    planIndex++;
                } else if (curLenSeconds < minimumLenSeconds) {
                    workoutPlan[planIndex - 1]['sets'] += 1;
                }

                // Update the workout length and the list of remaning unselected exercises
                curLenSeconds += restTime;
                remainingIds.splice(selectedIdx, 1);

                // Cleanup some data fields
                delete selectedExercise['reps_time_sec'];
            } 
        }

        // Finalization steps
        workoutPlan['estimated_time_mins'] = util.roundToTwo(curLenSeconds / 60);
        workoutPlan['num_exercises'] = exerciseNum;
        workoutPlan['num_parts'] = planIndex;

        return workoutPlan;
    }
}
