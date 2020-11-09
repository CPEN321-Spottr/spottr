const { MAX } = require("mssql");
const util = require("../util.js");
const workoutData = require("../data/workoutData.js");

const MAX_REST_SEC = 45;
const MIN_REST_SEC = 15;
const WORKOUT_TO_REST_RATIO = 5;
const TIME_ESTIMATE_SHIFT_FACTOR = 0.5;

const ONE_UP_DIFFICULTY_INCREASE = 0.1;

module.exports = {
    // Generates a new workout plan with the given possible exercises to include, multiplier,
    // desired length in minutes, and the new plan id to associate with the generated plan
    generateNewWorkoutPlan(lengthMinutes, possibleExercises, multiplier, planId) {
        var workoutPlan = {
            workout_plan_id: planId,
            exercises: [],
            breaks: []
        };

        var adjustedExercises = [];

        // Calculate adjusted standard time and reps
        for (var i = 0; i < possibleExercises.length; ++i) {
            adjustedExercises.push({});
            adjustedExercises[i]["name"] = util.clone(possibleExercises[i]["name"]);
            adjustedExercises[i]["exercise_id"] = util.clone(possibleExercises[i]["id"]);
            adjustedExercises[i]["description"] = util.clone(possibleExercises[i]["description"]);
            adjustedExercises[i]["major_muscle_group_id"] = util.clone(possibleExercises[i]["major_muscle_group_id"]);
            adjustedExercises[i]["sets"] = util.clone(possibleExercises[i]["std_sets"]);

            adjustedExercises[i]["reps"] = util.clone(Math.round(possibleExercises[i]["std_reps"] * multiplier));

            if (multiplier <= 1) {
                // Lower than 1 multipliers est time does not scale linearly as we expect these users to need more time per rep
                adjustedExercises[i]["reps_time_sec"] = util.clone(util.roundToTwo(possibleExercises[i]["std_reps_time_sec"]
                                                            * (((1 - multiplier) * TIME_ESTIMATE_SHIFT_FACTOR) + multiplier)));
            } else {
                // Greater than 1 multipliers est time scales linearly
                adjustedExercises[i]["reps_time_sec"] = util.clone(util.roundToTwo(possibleExercises[i]["std_reps_time_sec"] * multiplier));
            }
        }

        // Randomly select exercises to meet the target length of workout (+-10% seconds)
        // Only repeats exercises once all of them have been selected once
        var exerciseNum = 0;
        var breakNum = 0;
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
                selectedExercise["workout_order_num"] = planIndex;
                workoutPlan["exercises"][exerciseNum] = selectedExercise;
                planIndex++;
                exerciseNum++;

                // Add a rest if there is another exercise next, else add one more set to the last
                // exercise to finish workout if theres still time to spare
                var lengthOfExercise = selectedExercise["reps_time_sec"] * selectedExercise["sets"];
                curLenSeconds += lengthOfExercise;

                // Calculate the rest time in between different exercises based upon the multiplier and length of past exercise
                var restTime = Math.round(lengthOfExercise / WORKOUT_TO_REST_RATIO * ((1 - multiplier) + 1));
                restTime = restTime < MIN_REST_SEC ? MIN_REST_SEC : restTime;
                restTime = restTime > MAX_REST_SEC ? MAX_REST_SEC : restTime;

                if ((curLenSeconds + restTime) < minimumLenSeconds) {
                    workoutPlan["breaks"][breakNum] = {
                        name: "Rest",
                        exercise_id: "20",
                        duration_sec: restTime,
                        workout_order_num: planIndex
                    };
                    breakNum++;
                    planIndex++;
                } else if (curLenSeconds < minimumLenSeconds) {
                    // Add one more set to the final exercise to fill the small gap (or at least get closer to the target)
                    workoutPlan["exercises"][exerciseNum - 1]["sets"] += 1;
                    curLenSeconds += selectedExercise["reps_time_sec"];
                }

                // Update the workout length and the list of remaning unselected exercises
                curLenSeconds += restTime;
                remainingIds.splice(selectedIdx, 1);

                // Cleanup some data fields
                delete selectedExercise["reps_time_sec"];
            }
        }

        // Finalization steps
        workoutPlan["est_length_sec"] = Math.round(curLenSeconds);
        workoutPlan["associated_multiplier"] = multiplier;
        workoutPlan["spottr_points"] = calculateSpottrPoints(curLenSeconds, multiplier);

        return workoutPlan;
    },


    // Generates a new "one-up" workout plan from a passed workout plan and multiplier.
    // Order of exercises does not change, only the number of reps.
    //
    // The multiplier determines how much harder to make the "one-up" workout. Larger
    // multiplier will lead to a more difficult workout being generated.
    generateOneUpWorkoutPlan: function(oldWorkoutPlan, multiplier, newPlanId) {
        var actualDifficultyIncrease = ONE_UP_DIFFICULTY_INCREASE * multiplier;
        var newPlan = util.clone(oldWorkoutPlan);

        for (var i = 0; i < newPlan.exercises.length; i++) {
            newPlan.exercises[i].reps = Math.ceil(newPlan.exercises[i].reps * (1 + actualDifficultyIncrease));
        }

        newPlan.workout_plan_id = newPlanId;
        newPlan.associated_multiplier = util.roundToThree(newPlan.associated_multiplier * (1 + actualDifficultyIncrease));
        newPlan.spottr_points = calculateSpottrPoints(
            newPlan.est_length_sec,
            newPlan.associated_multiplier
        );

        return newPlan;
    }
}

const SEC_INCR = 20;
const POINT_PER_NORMALIZED_INCR = 5;
const MIN_POINTS = 25;
const MULTIPLIER_SHIFT_FACTOR = 0.9;

function calculateSpottrPoints(estimatedLengthSeconds, multiplier) {
    // Calculation is based upon both the workout"s multiplier and the estimated length in seconds. We use the
    // MULTIPLIER_SHIFT_FACTOR to further extenuate the difference in points for harder vs. easier workouts.
    //
    // Harder workouts == more Spottr Points
    if (multiplier <= 1) {
        return Math.max(
            MIN_POINTS,
            Math.round(estimatedLengthSeconds * multiplier * MULTIPLIER_SHIFT_FACTOR / SEC_INCR) * POINT_PER_NORMALIZED_INCR
        );
    } else {
        return Math.max(
            MIN_POINTS,
            Math.round(estimatedLengthSeconds * multiplier * (1 / MULTIPLIER_SHIFT_FACTOR) / SEC_INCR) * POINT_PER_NORMALIZED_INCR
        );
    }
}
