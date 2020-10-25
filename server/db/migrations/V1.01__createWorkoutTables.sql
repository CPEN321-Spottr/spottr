/* Represents a workout_plan. Use 'id' in the 'workout_exercise' table to find exercises */
CREATE TABLE workout_plan (
    id INT PRIMARY KEY IDENTITY (1,1),
    user_profile_id INT NOT NULL,
    FOREIGN KEY (user_profile_id) REFERENCES user_profile (id),
);

/* Each entry in the 'workout_exercise' table corresponds to a single exercise in a workout */
CREATE TABLE workout_exercise (
    id INT PRIMARY KEY IDENTITY (1,1),
    workout_plan_id INT NOT NULL,
    exercise_id INT NOT NULL,
    num_reps INT NOT NULL,
    num_sets INT NOT NULL,
    FOREIGN KEY (exercise_id) REFERENCES exercise (id),
    FOREIGN KEY (workout_plan_id) REFERENCES workout_plan (id),
);

ALTER TABLE exercise ADD std_sets INT;
ALTER TABLE exercise ALTER COLUMN description VARCHAR(500);
