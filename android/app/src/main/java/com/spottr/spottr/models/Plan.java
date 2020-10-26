package com.spottr.spottr.models;

import android.accessibilityservice.FingerprintGestureController;

import com.spottr.spottr.models.Routine;

import java.util.ArrayList;
import java.util.List;

/**
 * A plan represents a group of exercises, including the number of repetitions, duration, or any
 * other information required to contextualize the exercises it contains
 */
public class Plan {
    private String id;
    private String name;
    private String authorID;
    private Boolean isPublic;
    private ArrayList<Routine> routines;

    /**
     * Constructor
     */
    public Plan(String id, String name, String authorID, Boolean isPublic, ArrayList<Routine> routines) {
        this.id = id;
        this.name = name;
        this.authorID = authorID;
        this.isPublic = isPublic;
        this.routines = routines;
    }

    /**
     * Getters
     */
    public String getId() {return id;}

    public String getName() {return name;}

    public String getAuthorID() {return authorID;}

    public Boolean getPublic() {return isPublic;}

    public ArrayList<Routine> getRoutines() {return routines;}

    public String[] getRoutineNames() {
        ArrayList<String> retList = new ArrayList<String>();
        for (Routine routine : routines) {
            retList.add(routine.getExercise().getName());
        }
        String[] ret = new String[retList.size()];
        for (int i = 0; i < retList.size(); i++) {
            ret[i] = retList.get(i);
        }
        return ret;
    }

    public int[] getRoutineReps() {
        ArrayList<Integer> retList = new ArrayList<Integer>();
        for (Routine routine : routines) {
            retList.add(routine.getReps());
        }
        int[] ret = new int[routines.size()];
        for (int i = 0; i < retList.size(); i++) {
            ret[i] = retList.get(i).intValue();
        }
        return ret;
    }

    public int[] getRoutineSets() {
        ArrayList<Integer> retList = new ArrayList<Integer>();
        for (Routine routine : routines) {
            retList.add(routine.getSets());
        }
        int[] ret = new int[retList.size()];
        for (int i = 0; i < retList.size(); i++) {
            ret[i] = retList.get(i).intValue();
        }
        return ret;
    }

    /**
     * Setters
     */
    public void setName(String name) {
        this.name = name;
    }

    public void setPublic(Boolean aPublic) {
        isPublic = aPublic;
    }

    public void setRoutines(ArrayList<Routine> routines) {
        this.routines = routines;
    }
}
