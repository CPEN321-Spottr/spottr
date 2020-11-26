package com.spottr.spottr.models;

import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.DataSource;
import com.bumptech.glide.load.engine.GlideException;
import com.bumptech.glide.request.RequestListener;
import com.bumptech.glide.request.RequestOptions;
import com.bumptech.glide.request.target.Target;
import com.spottr.spottr.R;

import java.util.List;

import static android.content.ContentValues.TAG;
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

        posttext.setText(post.user_name + " just completed a workout!");
        posttime.setText(getRelativeTimeSpanString(post.posted.getTime()));

        Glide.with(parent)
            .load(post.user_profile_img_url)
            .override(200, 200)
            .apply(RequestOptions.circleCropTransform())
            .listener(new RequestListener() {
                @Override
                public boolean onLoadFailed(@Nullable GlideException e, Object model, Target target, boolean isFirstResource) {
                    Log.d("NEWSFEED", "Load failed", e);
                    return false;
                }

                @Override
                public boolean onResourceReady(Object resource, Object model, Target target, DataSource dataSource, boolean isFirstResource) {
                    return false;
                }

            })
            .into(userimg);

        return internal_convertView;
    }
}

