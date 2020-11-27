exports.mockTokenUser1 = {
    "sub": "12312321312312",
    "email": "test.user@gmail.com",
    "name": "Jim Bob Joe John Jake"
};
exports.mockUser1 = {
    "id": 37,
    "name": this.mockTokenUser1.name,
    "email": this.mockTokenUser1.email,
    "user_multiplier_id": 23,
    "google_user_id": "12131231231221233",
    "spottr_points": 940,
    "google_profile_image": "https://img.apmcdn.org/768cb350c59023919f564341090e3eea4970388c/normal/5034f3-20180309-rick-astley.jpg"
};
exports.mockUser1Multiplier = 1.2;
exports.mockWorkoutPlan1 = {
    "workout_plan_id": 93,
    "exercises": [
        {
            "name": "Plank Tap",
            "exercise_id": 2,
            "description": "While holding a high plank, tap the alternating shoulder with one of your hands. Alternate shoulders each tap.",
            "major_muscle_group_id": 1,
            "sets": 2,
            "reps": 18,
            "workout_order_num": 0
        },
        {
            "name": "Arm Circles",
            "exercise_id": 8,
            "description": "Perform arm circles. Alternate directions for each set.",
            "major_muscle_group_id": 1,
            "sets": 4,
            "reps": 18,
            "workout_order_num": 2
        },
        {
            "name": "Diamond Push-up",
            "exercise_id": 9,
            "description": "Perform push-ups with your hands together forming a diamond shape.",
            "major_muscle_group_id": 1,
            "sets": 2,
            "reps": 9,
            "workout_order_num": 4
        },
        {
            "name": "Tricep Dips (chair)",
            "exercise_id": 1,
            "description": "Find a chair, and perform a tricep dip.",
            "major_muscle_group_id": 1,
            "sets": 3,
            "reps": 11,
            "workout_order_num": 6
        },
        {
            "name": "Push Up",
            "exercise_id": 3,
            "description": "Perform a standard push-up. Use your knees for an easier alterative.",
            "major_muscle_group_id": 1,
            "sets": 2,
            "reps": 9,
            "workout_order_num": 8
        },
        {
            "name": "Half-Cobra Push-Up",
            "exercise_id": 7,
            "description": "Get into Half-Cobra position, and perform push-ups from there.",
            "major_muscle_group_id": 1,
            "sets": 3,
            "reps": 9,
            "workout_order_num": 10
        },
        {
            "name": "Plank With Spinal Rotation",
            "exercise_id": 4,
            "description": "Hold a low plank for 2 seconds. Then, rotate your spine so one arm is in the air. Alternate arms after each plank",
            "major_muscle_group_id": 1,
            "sets": 3,
            "reps": 18,
            "workout_order_num": 12
        },
        {
            "name": "Floor Dips",
            "exercise_id": 6,
            "description": "Sit on the floor with your knees bent and hands at your sides, directly underneath your shoulders. Hoist your hips off the floor, like a crab. Next, bend your elbows and lower yourself toward the floor (without touching it), then straighten your arms.",
            "major_muscle_group_id": 1,
            "sets": 3,
            "reps": 13,
            "workout_order_num": 14
        },
        {
            "name": "Burpee With Push-up",
            "exercise_id": 5,
            "description": "Perform a burpee with a push-up.",
            "major_muscle_group_id": 1,
            "sets": 3,
            "reps": 9,
            "workout_order_num": 16
        },
        {
            "name": "Plank Tap",
            "exercise_id": 2,
            "description": "While holding a high plank, tap the alternating shoulder with one of your hands. Alternate shoulders each tap.",
            "major_muscle_group_id": 1,
            "sets": 3,
            "reps": 18,
            "workout_order_num": 18
        },
        {
            "name": "Burpee With Push-up",
            "exercise_id": 5,
            "description": "Perform a burpee with a push-up.",
            "major_muscle_group_id": 1,
            "sets": 2,
            "reps": 9,
            "workout_order_num": 20
        }
    ],
    "breaks": [
        {
            "name": "Rest",
            "exercise_id": 20,
            "duration_sec": 19,
            "workout_order_num": 1
        },
        {
            "name": "Rest",
            "exercise_id": 20,
            "duration_sec": 17,
            "workout_order_num": 3
        },
        {
            "name": "Rest",
            "exercise_id": 20,
            "duration_sec": 15,
            "workout_order_num": 5
        },
        {
            "name": "Rest",
            "exercise_id": 20,
            "duration_sec": 19,
            "workout_order_num": 7
        },
        {
            "name": "Rest",
            "exercise_id": 20,
            "duration_sec": 15,
            "workout_order_num": 9
        },
        {
            "name": "Rest",
            "exercise_id": 20,
            "duration_sec": 19,
            "workout_order_num": 11
        },
        {
            "name": "Rest",
            "exercise_id": 20,
            "duration_sec": 38,
            "workout_order_num": 13
        },
        {
            "name": "Rest",
            "exercise_id": 20,
            "duration_sec": 19,
            "workout_order_num": 15
        },
        {
            "name": "Rest",
            "exercise_id": 20,
            "duration_sec": 19,
            "workout_order_num": 17
        },
        {
            "name": "Rest",
            "exercise_id": 20,
            "duration_sec": 28,
            "workout_order_num": 19
        }
    ],
    "est_length_sec": 1184,
    "associated_multiplier": 0.875,
    "spottr_points": 235
};
exports.mockWorkoutHistory1 = {
    "id": 1,
    "user_profile_id": this.mockUser1.id,
    "workout_plan_id": this.mockWorkoutPlan1.workout_plan_id,
    "actual_length_sec": 1100,
    "major_muscle_group_id": 1,
    "spottr_points": 235,
    "date_time_utc": "2020-10-29T08:42:10.000Z"
};
exports.mockPossibleExercises1 = [
    {
        "name": "Plank Tap",
        "id": 2,
        "description": "While holding a high plank, tap the alternating shoulder with one of your hands. Alternate shoulders each tap.",
        "major_muscle_group_id": 1,
        "std_sets": 2,
        "std_reps": 20,
        "std_reps_time_sec": 30
    },
    {
        "name": "Arm Circles",
        "id": 8,
        "description": "Perform arm circles. Alternate directions for each set.",
        "major_muscle_group_id": 1,
        "std_sets": 3,
        "std_reps": 20,
        "std_reps_time_sec": 30
    },
    {
        "name": "Diamond Push-up",
        "id": 9,
        "description": "Perform push-ups with your hands together forming a diamond shape.",
        "major_muscle_group_id": 1,
        "std_sets": 3,
        "std_reps": 10,
        "std_reps_time_sec": 30
    },
    {
        "name": "Tricep Dips (chair)",
        "id": 1,
        "description": "Find a chair, and perform a tricep dip.",
        "major_muscle_group_id": 1,
        "std_sets": 3,
        "std_reps": 12,
        "std_reps_time_sec": 30
    },
    {
        "name": "Push Up",
        "id": 3,
        "description": "Perform a standard push-up. Use your knees for an easier alterative.",
        "major_muscle_group_id": 1,
        "std_sets": 3,
        "std_reps": 10,
        "std_reps_time_sec": 30
    },
    {
        "name": "Half-Cobra Push-Up",
        "id": 7,
        "description": "Get into Half-Cobra position, and perform push-ups from there.",
        "major_muscle_group_id": 1,
        "std_sets": 3,
        "std_reps": 10,
        "std_reps_time_sec": 30
    },
    {
        "name": "Plank With Spinal Rotation",
        "id": 4,
        "description": "Hold a low plank for 2 seconds. Then, rotate your spine so one arm is in the air. Alternate arms after each plank",
        "major_muscle_group_id": 1,
        "std_sets": 3,
        "std_reps": 20,
        "std_reps_time_sec": 30
    },
    {
        "name": "Floor Dips",
        "id": 6,
        "description": "Sit on the floor with your knees bent and hands at your sides, directly underneath your shoulders. Hoist your hips off the floor, like a crab. Next, bend your elbows and lower yourself toward the floor (without touching it), then straighten your arms.",
        "major_muscle_group_id": 1,
        "std_sets": 3,
        "std_reps": 15,
        "std_reps_time_sec": 30
    },
    {
        "name": "Burpee With Push-up",
        "id": 5,
        "description": "Perform a burpee with a push-up.",
        "major_muscle_group_id": 1,
        "std_sets": 3,
        "std_reps": 10,
        "std_reps_time_sec": 30
    }
];
exports.mockWorkoutPlan1DatebaseVersion = {
    "id": 93,
    "exercises": [
        {
            "name": "Plank Tap",
            "exercise_id": 2,
            "description": "While holding a high plank, tap the alternating shoulder with one of your hands. Alternate shoulders each tap.",
            "major_muscle_group_id": 1,
            "num_sets": 2,
            "num_reps": 18,
            "workout_order_num": 0
        },
        {
            "name": "Arm Circles",
            "exercise_id": 8,
            "description": "Perform arm circles. Alternate directions for each set.",
            "major_muscle_group_id": 1,
            "num_sets": 4,
            "num_reps": 18,
            "workout_order_num": 2
        },
        {
            "name": "Diamond Push-up",
            "exercise_id": 9,
            "description": "Perform push-ups with your hands together forming a diamond shape.",
            "major_muscle_group_id": 1,
            "num_sets": 2,
            "num_reps": 9,
            "workout_order_num": 4
        },
        {
            "name": "Tricep Dips (chair)",
            "exercise_id": 1,
            "description": "Find a chair, and perform a tricep dip.",
            "major_muscle_group_id": 1,
            "num_sets": 3,
            "num_reps": 11,
            "workout_order_num": 6
        },
        {
            "name": "Push Up",
            "exercise_id": 3,
            "description": "Perform a standard push-up. Use your knees for an easier alterative.",
            "major_muscle_group_id": 1,
            "num_sets": 2,
            "num_reps": 9,
            "workout_order_num": 8
        },
        {
            "name": "Half-Cobra Push-Up",
            "exercise_id": 7,
            "description": "Get into Half-Cobra position, and perform push-ups from there.",
            "major_muscle_group_id": 1,
            "num_sets": 3,
            "num_reps": 9,
            "workout_order_num": 10
        },
        {
            "name": "Plank With Spinal Rotation",
            "exercise_id": 4,
            "description": "Hold a low plank for 2 seconds. Then, rotate your spine so one arm is in the air. Alternate arms after each plank",
            "major_muscle_group_id": 1,
            "num_sets": 3,
            "num_reps": 18,
            "workout_order_num": 12
        },
        {
            "name": "Floor Dips",
            "exercise_id": 6,
            "description": "Sit on the floor with your knees bent and hands at your sides, directly underneath your shoulders. Hoist your hips off the floor, like a crab. Next, bend your elbows and lower yourself toward the floor (without touching it), then straighten your arms.",
            "major_muscle_group_id": 1,
            "num_sets": 3,
            "num_reps": 13,
            "workout_order_num": 14
        },
        {
            "name": "Burpee With Push-up",
            "exercise_id": 5,
            "description": "Perform a burpee with a push-up.",
            "major_muscle_group_id": 1,
            "num_sets": 3,
            "num_reps": 9,
            "workout_order_num": 16
        },
        {
            "name": "Plank Tap",
            "exercise_id": 2,
            "description": "While holding a high plank, tap the alternating shoulder with one of your hands. Alternate shoulders each tap.",
            "major_muscle_group_id": 1,
            "num_sets": 3,
            "num_reps": 18,
            "workout_order_num": 18
        },
        {
            "name": "Burpee With Push-up",
            "exercise_id": 5,
            "description": "Perform a burpee with a push-up.",
            "major_muscle_group_id": 1,
            "num_sets": 2,
            "num_reps": 9,
            "workout_order_num": 20
        },
        {
            "name": "Rest",
            "exercise_id": 20,
            "num_reps": 19,
            "workout_order_num": 1
        },
        {
            "name": "Rest",
            "exercise_id": 20,
            "num_reps": 17,
            "workout_order_num": 3
        },
        {
            "name": "Rest",
            "exercise_id": 20,
            "num_reps": 15,
            "workout_order_num": 5
        },
        {
            "name": "Rest",
            "exercise_id": 20,
            "num_reps": 19,
            "workout_order_num": 7
        },
        {
            "name": "Rest",
            "exercise_id": 20,
            "num_reps": 15,
            "workout_order_num": 9
        },
        {
            "name": "Rest",
            "exercise_id": 20,
            "num_reps": 19,
            "workout_order_num": 11
        },
        {
            "name": "Rest",
            "exercise_id": 20,
            "num_reps": 38,
            "workout_order_num": 13
        },
        {
            "name": "Rest",
            "exercise_id": 20,
            "num_reps": 19,
            "workout_order_num": 15
        },
        {
            "name": "Rest",
            "exercise_id": 20,
            "num_reps": 19,
            "workout_order_num": 17
        },
        {
            "name": "Rest",
            "exercise_id": 20,
            "num_reps": 28,
            "workout_order_num": 19
        }
    ],
    "est_length_sec": 1184,
    "associated_multiplier": 0.875,
    "spottr_points": 235
};
exports.mockMuscleGroups = [
    {
        "id": 1,
        "name": "Arms"
    },
    {
        "id": 3,
        "name": "Rest"
    }
];
exports.mockWorkoutHistoryExpected = {
    "posted": "Thu, 29 Oct 2020 08:42:10 GMT",
    "user_profile_id": "37",
    "workout_history_actual_length_sec": "1100",
    "workout_history_major_muscle_group": "1",
    "workout_history_spottr_points": "235",
    "workout_plan_id": "93"
};