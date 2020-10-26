package com.spottr.spottr.models;

/**
 * An exercise represents a single type of fitness activity that can be performed
 */
public class Exercise {
    private String id;
    private String name;
    private String mGroup;

    /**
     * Constructor
     */
    public Exercise(String id, String name, String mGroup) {
        this.id = id;
        this.name = name;
        this.mGroup = mGroup;
    }

    /**
     * Getters
     */
    public String getId() {
        return id;
    }

    public String getName() {return name;}

    public String getmGroup() {
        return mGroup;
    }

    /**
     * Setters
     */
    public void setName(String name) {this.name = name;}

    public void setmGroup(String mGroup) {
        this.mGroup = mGroup;
    }
}
