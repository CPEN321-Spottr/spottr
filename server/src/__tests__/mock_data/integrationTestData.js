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
    "spottr_points": 940
};
exports.mockUser1Multiplier = 1.2;
exports.mockWorkoutPlan1 = {
    "workout_plan_id": 93,
    "exercises": [], // not needed 
    "breaks": [], // not needed
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
        "id": 1,
        "name": "Plank Tap",
        "description": "description",
        "std_reps": 20,
        "std_reps_time_sec": 45,
        "major_muscle_group_id": 1,
        "std_sets": 3
    },
    {
        "id": 2,
        "name": "Push Ups",
        "description": "description",
        "std_reps": 10,
        "std_reps_time_sec": 30,
        "major_muscle_group_id": 1,
        "std_sets": 3
    },
    {
        "id": 3,
        "name": "Arm Circles",
        "description": "description",
        "std_reps": 20,
        "std_reps_time_sec": 20,
        "major_muscle_group_id": 1,
        "std_sets": 4
    }
];