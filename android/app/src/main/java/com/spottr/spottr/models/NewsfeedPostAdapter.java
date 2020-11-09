package com.spottr.spottr.models;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.RequestOptions;
import com.spottr.spottr.R;

import java.util.List;

import static android.text.format.DateUtils.getRelativeTimeSpanString;

public class NewsfeedPostAdapter extends ArrayAdapter<NewsfeedPost> {

    public NewsfeedPostAdapter(@NonNull Context context, @NonNull List<NewsfeedPost> objects) {
        super(context, 0, objects);
    }

    @NonNull
    @Override
    public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {
        NewsfeedPost post = getItem(position);

        View internal_convertView = convertView;

        if (internal_convertView == null) {
            internal_convertView = LayoutInflater.from(getContext()).inflate(R.layout.newsfeed_entry, parent, false);
        }

        TextView posttext = internal_convertView.findViewById(R.id.newsfeed_post_text);
        TextView posttime = internal_convertView.findViewById(R.id.newsfeed_post_time);

        ImageView userimg = internal_convertView.findViewById(R.id.newsfeed_post_image);

        posttext.setText(post.name + " just completed a workout!");
        posttime.setText(getRelativeTimeSpanString(post.posted.getTime()));

        Glide.with(parent)
                .load(post.profile_img_uri)
                .override(200, 200)
                .apply(RequestOptions.circleCropTransform())
                .into(userimg);

        return internal_convertView;
    }
}

