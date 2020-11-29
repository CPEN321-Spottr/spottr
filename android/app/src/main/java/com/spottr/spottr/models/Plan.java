package com.spottr.spottr.models;
import android.os.Parcel;
import android.os.Parcelable;

import java.util.ArrayList;

/**
 * A plan represents a group of exercises, including the number of repetitions, duration, or any
 * other information required to contextualize the exercises it contains
 */
public class Plan implements Parcelable {
    public String workout_plan_id;
    public Double estimated_time_mins;
    public Integer num_exercises;
    public Integer num_parts;
    public Integer est_length_sec;
    public Integer associated_multiplier;
    public Integer spottr_points;

    public ArrayList<Exercise> exercises;
    public ArrayList<Rest> breaks;

    /**
     * Constructor
     */
    public Plan(String id, Double estimated_time_mins, Integer num_exercises, Integer num_parts) {
        this.workout_plan_id = id;
        this.estimated_time_mins = estimated_time_mins;
        this.num_exercises = num_exercises;
        this.num_parts = num_parts;
        this.exercises = new ArrayList<Exercise>();
        this.breaks = new ArrayList<Rest>();
    }

    protected Plan(Parcel in) {
        workout_plan_id = in.readString();
        if (in.readByte() == 0) {
            estimated_time_mins = null;
        } else {
            estimated_time_mins = in.readDouble();
        }
        if (in.readByte() == 0) {
            num_exercises = null;
        } else {
            num_exercises = in.readInt();
        }
        if (in.readByte() == 0) {
            num_parts = null;
        } else {
            num_parts = in.readInt();
        }
        if (in.readByte() == 0) {
            est_length_sec = null;
        } else {
            est_length_sec = in.readInt();
        }
        if (in.readByte() == 0) {
            associated_multiplier = null;
        } else {
            associated_multiplier = in.readInt();
        }
        if (in.readByte() == 0) {
            spottr_points = null;
        } else {
            spottr_points = in.readInt();
        }
    }

    public static final Creator<Plan> CREATOR = new Creator<Plan>() {
        @Override
        public Plan createFromParcel(Parcel in) {
            return new Plan(in);
        }

        @Override
        public Plan[] newArray(int size) {
            return new Plan[size];
        }
    };

    /**
     * Getters
     */

    public String[] getRoutineNames() {
        ArrayList<String> retList = new ArrayList<String>();
        for (Exercise exercise : exercises) {
            //Log.d("TEST", exercise.name);
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

    @Override
    public String toString() {
        return "Plan{" +
                "workout_plan_id='" + workout_plan_id + '\'' +
                ", estimated_time_mins=" + estimated_time_mins +
                ", num_exercises=" + num_exercises +
                ", num_parts=" + num_parts +
                ", est_length_sec=" + est_length_sec +
                ", associated_multiplier=" + associated_multiplier +
                ", spottr_points=" + spottr_points +
                ", exercises=" + exercises.toString() +
                ", breaks=" + breaks +
                '}';
    }

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel parcel, int i) {
        parcel.writeString(workout_plan_id);
        if (estimated_time_mins == null) {
            parcel.writeByte((byte) 0);
        } else {
            parcel.writeByte((byte) 1);
            parcel.writeDouble(estimated_time_mins);
        }
        if (num_exercises == null) {
            parcel.writeByte((byte) 0);
        } else {
            parcel.writeByte((byte) 1);
            parcel.writeInt(num_exercises);
        }
        if (num_parts == null) {
            parcel.writeByte((byte) 0);
        } else {
            parcel.writeByte((byte) 1);
            parcel.writeInt(num_parts);
        }
        if (est_length_sec == null) {
            parcel.writeByte((byte) 0);
        } else {
            parcel.writeByte((byte) 1);
            parcel.writeInt(est_length_sec);
        }
        if (associated_multiplier == null) {
            parcel.writeByte((byte) 0);
        } else {
            parcel.writeByte((byte) 1);
            parcel.writeInt(associated_multiplier);
        }
        if (spottr_points == null) {
            parcel.writeByte((byte) 0);
        } else {
            parcel.writeByte((byte) 1);
            parcel.writeInt(spottr_points);
        }
    }
}
