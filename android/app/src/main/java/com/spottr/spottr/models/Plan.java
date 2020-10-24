package com.spottr.spottr.models;

import com.spottr.spottr.models.Routine;

import java.util.List;

/**
 * A plan represents a group of exercises, including the number of repetitions, duration, or any
 * other information required to contextualize the exercises it contains
 */
public class Plan {
    String id;
    String name;
    String authorID;
    Boolean isPublic;
    List<Routine> routines;
}
