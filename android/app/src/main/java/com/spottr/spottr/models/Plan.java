package com.spottr.spottr.models;

import android.util.Log;

import java.util.ArrayList;

/**
 * A plan represents a group of exercises, including the number of repetitions, duration, or any
 * other information required to contextualize the exercises it contains
 */
public class Plan {
    public String workout_plan_id;
    public Double estimated_time_mins;
    public Integer num_exercises;
    public Integer num_parts;

    public ArrayList<Exercise> exercises;

    /**
     * Constructor
     */
    public Plan(String id, Double estimated_time_mins, Integer num_exercises, Integer num_parts) {
        this.workout_plan_id = id;
        this.estimated_time_mins = estimated_time_mins;
        this.num_exercises = num_exercises;
        this.num_parts = num_parts;
        this.exercises = new ArrayList<Exercise>();
    }

    /**
     * Getters
     */
    public String[] getRoutineNames() {
        ArrayList<String> retList = new ArrayList<String>();
        for (Exercise exercise : exercises) {
            Log.d("TEST", exercise.name);
            retList.add(exercise.name);
        }
        String[] ret = new String[retList.size()];
        for (int i = 0; i < retList.size(); i++) {
            ret[i] = retList.get(i);
        }
        return ret;
    }

    public int[] getRoutineReps() {
        ArrayList<Integer> retList = new ArrayList<Integer>();
        Log.d("TEST", exercises.toString());
        for (Exercise exercise : exercises) {
            retList.add(exercise.reps);
        }
        int[] ret = new int[retList.size()];
        for (int i = 0; i < retList.size(); i++) {
            ret[i] = retList.get(i).intValue();
        }
        return ret;
    }

    public int[] getRoutineSets() {
        ArrayList<Integer> retList = new ArrayList<Integer>();
        for (Exercise exercise : exercises) {
            retList.add(exercise.sets);
        }
        int[] ret = new int[retList.size()];
        for (int i = 0; i < retList.size(); i++) {
            ret[i] = retList.get(i).intValue();
        }
        return ret;
    }

    public void addExercise(Exercise ex) {
        this.exercises.add(ex);
    }

    @Override
    public String toString() {
        return "Plan{" +
                "workout_plan_id='" + workout_plan_id + '\'' +
                ", estimated_time_mins=" + estimated_time_mins +
                ", num_exercises=" + num_exercises +
                ", num_parts=" + num_parts +
                ", exercises=" + exercises +
                '}';
    }
}
