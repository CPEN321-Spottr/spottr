package com.spottr.models;

import android.location.Location;

/**
 * A workout represents the execution of some exercise Plan by a specific User
 */
public class Workout {
    String id;
    String userID;
    String planID;
    Number duration;
    Location location;
}
