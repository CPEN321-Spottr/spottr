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
    public double getLatitude() {return this.latitude;}

    public double getLongitude() {return this.longitude;}

    public String getName() {return this.name;}

    /**
     * Setters
     */
    public void setName(String name) {this.name = name;}

    public void setLatitude(double latitude) {this.latitude = latitude;}

    public void setLongitude(double longitude) {this.longitude = longitude;}

    /**
     * Copy
     */
    public static Location hardCopy(Location loc) {return new Location(loc.name, loc.latitude, loc.longitude);}
}
