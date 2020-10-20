package com.spottr.models;

import android.location.Location;

/**
 * A workout represents the execution of some exercise Plan by a specific User
 */
public class Workout {
    private String id;
    private String planID;
    private Number duration;
    private String userID;
    private Location location;

    /**
     * Constructor
     */
    public Workout(String id, String planID, Number duration, String userID, Location location) {
        this.id = id;
        this.planID = planID;
        this.duration = duration;
        this.userID = userID;
        this.location = location;
    }

    /**
     * Getters
     */
    public String getId() {
        return this.id;
    }

    public String getPlanID() {
        return this.planID;
    }

    public Number getDuration() {
        return this.duration;
    }

    public String getUserID() {
        return this.userID;
    }

    public Location getLocation() {
        return Location.hardCopy(this.location);
    }

    /**
     * Setters
     */
    public void setId(String id) {
        this.id = id;
    }

    public void setPlanID(String planID) {
        this.planID = planID;
    }

    public void setDuration(Number duration) {
        this.duration = duration;
    }

    public void setUserID(String userID) {
        this.userID = userID;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    /**
     * Copy
     */
    public static Workout hardCopy(Workout workout) {
        return new Workout(workout.id, workout.planID, workout.duration, workout.userID, Location.hardCopy(workout.location));
    }
}
