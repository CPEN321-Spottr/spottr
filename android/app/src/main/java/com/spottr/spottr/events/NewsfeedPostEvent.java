package com.spottr.spottr.events;

import com.spottr.spottr.models.NewsfeedPost;

public class NewsfeedPostEvent {
    public final NewsfeedPost newsfeedPost;

    public NewsfeedPostEvent(NewsfeedPost newsfeedPost) {
        this.newsfeedPost = newsfeedPost;
    }
}
