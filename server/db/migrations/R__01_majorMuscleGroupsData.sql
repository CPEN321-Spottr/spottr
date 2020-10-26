/*
 * Repeatable migration script for managing static data within the "major_muscle_group" database table
 */

INSERT INTO major_muscle_group(name)
    VALUES
        ('Arms');