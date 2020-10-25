/*
 * Repeatable migration script for managing static data within the "exercise" database table
 */

INSERT INTO exercise(name, description, std_reps, std_reps_time_sec, major_muscle_group_id, std_sets)
    VALUES 
        ('Tricep Dips (chair)', 'Find a chair, and perform a tricep dip.', 12, 30, 1, 3),
        ('Plank Tap', 'While holding a high plank, tap the alternating shoulder with one of your hands. Alternate shoulders each tap.', 20, 45, 1, 3),
        ('Push Up', 'Perform a standard push-up. Use your knees for an easier alterative.', 10, 30, 1, 3),
        ('Plank With Spinal Rotation', 'Hold a low plank for 2 seconds. Then, rotate your spine so one arm is in the air. Alternate arms after each plank', 20, 60, 1, 3),
        ('Burpee With Push-up', 'Perform a burpee with a push-up.', 10, 30, 1, 3),
        ('Floor Dips', 'Sit on the floor with your knees bent and hands at your sides, directly underneath your shoulders. Hoist your hips off the floor, like a crab. Next, bend your elbows and lower yourself toward the floor (without touching it), then straighten your arms.', 15, 30, 1, 3),
        ('Half-Cobra Push-Up', 'Get into Half-Cobra position, and perform push-ups from there.', 10, 30, 1, 3),
        ('Arm Circles', 'Perform arm circles. Alternate directions for each set.', 20, 20, 1, 4),
        ('Diamond Push-up', 'Perform push-ups with your hands together forming a diamond shape.', 10, 30, 1, 3);