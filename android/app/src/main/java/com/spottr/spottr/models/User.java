package com.spottr.models;

import java.util.Date;

public class User {
    private String id;
    private String name;
    private String email;
    Date created;
    Integer workouts;

    /**
     * Constructors
     */
    public User(String id, String name, Date created, String email) {
        this.id = id;
        this.name = name;
        this.created = created;
        this.email = email;
        this.workouts = 0;
    }

    public User(String name, Date created, String email) {
        this.id = ""; //Call DB to create new id for the new user
        this.name = name;
        this.created = created;
        this.email = email;
        this.workouts = 0;
    }

    /**
     * Getters
     */
    public String getId() {return this.id;}

    public String getName() {return this.name;}

    public Date getCreated() {return this.created;}

    public String getEmail() {return this.email;}

    public Integer getWorkouts() {return this.workouts;}

    /**
     * Setters
     */
    public void setName(String name) {
        this.name = name;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setWorkouts(Integer workouts) {
        this.workouts = workouts;
    }

    /**
     * Copy
     */
    public static User hardCopy(User user) {
        User ret = new User(user.id, user.name, user.created, user.email);
        ret.setWorkouts(user.workouts);
        return ret;
    }
}
