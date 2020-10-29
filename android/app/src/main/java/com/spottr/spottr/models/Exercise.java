package com.spottr.spottr.models;

/**
 * An exercise represents a single type of fitness activity that can be performed
 */
public class Exercise {
    public String exercise_id;
    public String name;
    public String description;
    public Integer major_muscle_group_id;
    public Integer sets;
    public Integer reps;
    public Integer breaks;

    /**
     * Constructor
     */
    public Exercise(String exercise_id, String name, String description, Integer sets, Integer reps, Integer major_muscle_group_id, Integer breaks) {
        this.exercise_id = exercise_id;
        this.name = name;
        this.description = description;
        this.sets = sets;
        this.reps = reps;
        this.major_muscle_group_id = major_muscle_group_id;
        this.breaks = breaks;
    }
}
