package com.spottr.spottr.activities;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.bumptech.glide.Glide;

import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.bumptech.glide.request.RequestOptions;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.spottr.spottr.R;
import com.spottr.spottr.apis.APIFactory;
import com.spottr.spottr.apis.CommunityAPI;
import com.spottr.spottr.events.NewsfeedPostEvent;
import com.spottr.spottr.models.NewsfeedPost;
import com.spottr.spottr.models.NewsfeedPostAdapter;
import com.spottr.spottr.models.User;
import com.spottr.spottr.services.AuthorizationService;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Objects;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import static com.bumptech.glide.load.resource.drawable.DrawableTransitionOptions.withCrossFade;

public class MainActivity extends AppCompatActivity {

    private ImageView imgProfilePic;
    private Button workoutButton;
    private TextView welcomeBackText;
    private ListView newsfeed;
    private NewsfeedPostAdapter adapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        ImageView imgProfilePic = (ImageView) findViewById(R.id.profile_pic);
        TextView welcomeBackText = findViewById(R.id.welcome_back_text);
        ListView newsfeed = findViewById(R.id.newsfeed);
        Button workoutButton = (Button) findViewById(R.id.get_workout_button);
        workoutButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                startActivity(new Intent(MainActivity.this, GeneratePlan.class));
            }
        });

        Bundle extras = getIntent().getExtras();

        GoogleSignInAccount account = (GoogleSignInAccount) extras.get("account");
        assert account != null;
        Log.d("ACCOUNT", Objects.requireNonNull(account.getDisplayName()));
        Log.d("ACCOUNT", Objects.requireNonNull(account.getPhotoUrl()).toString());

        if(account.getIdToken() != null) {
            Log.d("ACCOUNT", Objects.requireNonNull(account.getIdToken()));
        } else {
            Log.d("ACCOUNT", "Could not get ID token");
        }

        Glide.with(this)
                .load(account.getPhotoUrl())
                .override(400, 400)
                .apply(RequestOptions.circleCropTransform())
                .into(imgProfilePic);

        AuthorizationService.silentSignIn(this);

        APIFactory apiFactory = new APIFactory(this);

        CommunityAPI communityAPI = apiFactory.getCommunityAPI();

        Call<User> call = communityAPI.registerToken();
        call.enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if(response.code() == 200) {
                    Log.d("TOKEN", "Successfully registered token");
                }
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                Log.d("TOKEN", "Token registration failed");
            }
        });

        welcomeBackText.setText(account.getDisplayName());

        ArrayList<NewsfeedPost> arrayOfPosts = new ArrayList<NewsfeedPost>();

        adapter = new NewsfeedPostAdapter(this, arrayOfPosts);

        newsfeed.setAdapter(adapter);

        NewsfeedPost testpost = new NewsfeedPost(account.getDisplayName(), Calendar.getInstance().getTime(), account.getPhotoUrl());
        adapter.add(testpost);
    }

    @Override
    public void onStart() {
        super.onStart();
        EventBus.getDefault().register(this);
    }

    @Override
    public void onStop() {
        EventBus.getDefault().unregister(this);
        super.onStop();
    }

    @Subscribe
    public void handleNewsfeedPostEvent(NewsfeedPostEvent newsfeedPostEvent) {
        adapter.add(newsfeedPostEvent.newsfeedPost);
    }
}