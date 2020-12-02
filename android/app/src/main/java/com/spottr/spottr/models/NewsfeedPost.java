package com.spottr.spottr.models;

import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class NewsfeedPost {
    public String user_name;
    public String user_profile_img_url;
    public Integer user_profile_id;
    public Date posted;
    public Double workout_history_actual_length_sec;
    public Integer workout_history_major_muscle_group;
    public Integer workout_history_spottr_points;
    public Integer workout_plan_id;

    public NewsfeedPost(
            String user_name,
            String user_profile_image_url,
            Integer user_profile_id,
            Date posted,
            Double workout_history_actual_length_sec,
            Integer workout_history_major_muscle_group,
            Integer workout_history_spottr_points,
            Integer workout_plan_id
    ) {
        this.user_profile_img_url = user_profile_image_url;
        this.user_name = user_name;
        this.user_profile_id = user_profile_id;
        this.posted = posted;
        this.workout_history_actual_length_sec = workout_history_actual_length_sec;
        this.workout_history_major_muscle_group = workout_history_major_muscle_group;
        this.workout_history_spottr_points = workout_history_spottr_points;
        this.workout_plan_id = workout_plan_id;
    }

    public NewsfeedPost(JSONObject object){
        SimpleDateFormat dateFormat = new SimpleDateFormat("EEE, d MMM yyyy HH:mm:ss z");

        try {

            this.user_profile_img_url = object.getString("user_profile_img_url");
            this.user_name = object.getString("user_name");
            this.user_profile_id = object.getInt("user_profile_id");
            this.posted = dateFormat.parse(object.getString("posted"));
            this.workout_history_actual_length_sec = object.getDouble("workout_history_actual_length_sec");
            this.workout_history_major_muscle_group = object.getInt("workout_history_major_muscle_group");
            this.workout_history_spottr_points = object.getInt("workout_history_spottr_points");
            this.workout_plan_id = object.getInt("workout_plan_id");

        } catch (JSONException | ParseException e) {
            e.printStackTrace();
        }
    }
}
