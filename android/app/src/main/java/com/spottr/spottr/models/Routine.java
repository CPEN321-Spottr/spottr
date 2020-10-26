package com.spottr.spottr.models;

import androidx.annotation.Nullable;


public class Routine {
    private String id;
    private String exerciseID;
    private Exercise exercise;
    private Boolean durationExercise;
    private int sets;
    private int reps;
    private int duration;
    private int rest;

    /**
     * Constructor
     */
    public Routine(String id, Exercise exercise, int sets, int reps, int rest, int duration) {
        this.id = id;
        this.exercise = exercise;
        this.exerciseID = this.exercise.getId();
        this.durationExercise = duration != 0;
        this.sets = sets;
        this.reps = reps;
        this.rest = rest;
        this.duration = duration;
    }
    /**
     * Getters
     */
    public String getId() {return id;}

    public Exercise getExercise() {return exercise;}

    public Boolean getDurationExercise() {return durationExercise;}

    public int getSets() {return sets;}

    public int getReps() {return reps;}

    public int getDuration() {return duration;}

    public int getRest() {return rest;}

    /**
     * Setters
     */
    public void setExercise(Exercise exercise) {this.exercise = exercise;}

    public void setDurationExercise(int duration) {
        this.durationExercise = duration != 0;
        this.duration = duration;
    }

    public void setSets(int sets) {this.sets = sets;}

    public void setReps(int reps) {this.reps = reps;}

    public void setDuration(int duration) {this.duration = duration; }

    public void setRest(int rest) {this.rest = rest;}
}
