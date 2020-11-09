package com.spottr.spottr.models;

import android.net.Uri;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Date;

public class NewsfeedPost {
    public Uri profile_img_uri;
    public String name;
    public Date posted;

    public NewsfeedPost(String name, Date posted, Uri image) {
        this.profile_img_uri = image;
        this.name = name;
        this.posted = posted;
    }

    public NewsfeedPost(JSONObject object){
        try {
            this.profile_img_uri = Uri.parse(object.getString("profile_img_uri"));
            this.name = object.getString("name");
            this.posted = new Date(object.getInt("posted"));
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
}
