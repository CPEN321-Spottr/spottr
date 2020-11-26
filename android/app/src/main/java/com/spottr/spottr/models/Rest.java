package com.spottr.spottr.models;

public class Rest {

    public String name;
    public Integer execise_id;
    public Integer duration_sec;
    public Integer workout_order_num;

    public Rest(String name, Integer execise_id, Integer duration_sec, Integer workout_order_num) {
        this.name = name;
        this.execise_id = execise_id;
        this.duration_sec = duration_sec;
        this.workout_order_num = workout_order_num;
    }
}
