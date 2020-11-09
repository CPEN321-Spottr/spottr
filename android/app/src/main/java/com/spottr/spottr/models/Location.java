package com.spottr.spottr.models;

/**
 * A Location represents the geographic coordinates of a named location
 */
public class Location {
    private String name;
    private double latitude;
    private double longitude;

    /**
     * Constructor
     */
    public Location(String name, double latitude, double longitude) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    /**
     * Getters
     */
    public String getName() {return this.name;}

    /**
     * Setters
     */
    public void setName(String name) {this.name = name;}

    /**
     * Copy
     */
    public static Location hardCopy(Location loc) {return new Location(loc.name, loc.latitude, loc.longitude);}
}
