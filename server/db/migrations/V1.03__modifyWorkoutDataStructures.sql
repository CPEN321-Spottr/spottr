/*
 * Modify workout data structure in database to facilate new features
 */

ALTER TABLE workout_plan
    ADD est_length_sec INT,
        major_muscle_group_id INT,
        associated_multiplier DECIMAL(4,3),
        spottr_points INT,
        CONSTRAINT FK_wp_major_muscle_group_id FOREIGN KEY (major_muscle_group_id) REFERENCES major_muscle_group (id);

/* remove unnamed FK constraint on user_profile_id in workout_plan */
DECLARE @ConstraintName nvarchar(200)
IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE where TABLE_NAME = 'workout_plan' AND COLUMN_NAME = 'user_profile_id')
BEGIN
SELECT @ConstraintName = CONSTRAINT_NAME FROM INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE where TABLE_NAME = 'workout_plan' AND COLUMN_NAME = 'user_profile_id'
EXEC('ALTER TABLE workout_plan DROP CONSTRAINT ' + @ConstraintName)
END

ALTER TABLE workout_plan
    DROP 
        COLUMN user_profile_id;

CREATE TABLE workout_history (
    id INT PRIMARY KEY IDENTITY (1,1),
    user_profile_id INT,
    workout_plan_id INT,
    actual_length_sec INT,
    major_muscle_group_id INT,
    spottr_points INT,
    date_time_utc DATETIME,
    CONSTRAINT FK_wh_major_muscle_group_id FOREIGN KEY (major_muscle_group_id) REFERENCES major_muscle_group (id),
    CONSTRAINT FK_wh_workout_plan_id FOREIGN KEY (workout_plan_id) REFERENCES workout_plan (id),
    CONSTRAINT FK_wh_user_profile_id FOREIGN KEY (user_profile_id) REFERENCES user_profile (id)
);

ALTER TABLE user_profile
    ADD
        spottr_points INT;
