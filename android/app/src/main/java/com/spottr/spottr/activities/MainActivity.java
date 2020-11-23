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

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.RequestOptions;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.messaging.FirebaseMessaging;
import com.spottr.spottr.R;
import com.spottr.spottr.apis.APIFactory;
import com.spottr.spottr.apis.AdminAPI;
import com.spottr.spottr.events.NewsfeedPostEvent;
import com.spottr.spottr.models.NewsfeedPost;
import com.spottr.spottr.models.NewsfeedPostAdapter;
import com.spottr.spottr.models.User;
import com.spottr.spottr.services.AuthorizationServiceHelper;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Objects;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MainActivity extends AppCompatActivity {

    private NewsfeedPostAdapter adapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        ImageView imgProfilePic = (ImageView) findViewById(R.id.profile_pic);
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

        AuthorizationServiceHelper.silentSignIn(this);

        APIFactory apiFactory = new APIFactory(this);
        final AdminAPI adminAPI = apiFactory.getAdminAPI();

        // Get device token for Firebase notifications
        FirebaseMessaging.getInstance().getToken()
                .addOnCompleteListener(new OnCompleteListener<String>() {
                    @Override
                    public void onComplete(@NonNull Task<String> task) {
                        if (!task.isSuccessful()) {
                            Log.w("FIREBASE", "Fetching FCM registration token failed", task.getException());
                            return;
                        }

                        // Get new FCM registration token
                        String token = task.getResult();

                        Log.d("FIREBASE", token);

                        Call<Void> firebasetokencall = adminAPI.registerFirebaseDeviceToken(token);

                        firebasetokencall.enqueue(new Callback<Void>() {
                            @Override
                            public void onResponse(Call<Void> call, Response<Void> response) {
                                if(response.code() == 200) {
                                    Log.d("TOKEN", "Successfully registered device token");
                                } else {
                                    Log.d("TOKEN", response.toString());
                                }
                            }

                            @Override
                            public void onFailure(Call<Void> call, Throwable t) {
                                Log.d("TOKEN", "Device token registration failed");
                                Log.d("TOKEN", t.toString());
                            }
                        });
                    }
                });

        Call<User> call = adminAPI.registerToken();
        call.enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if(response.code() == 200) {
                    SharedPreferences preferences = getSharedPreferences(getString(R.string.user_credential_store), Context.MODE_PRIVATE);
                    preferences.edit().putInt("userID", Integer.parseInt(response.body().getId())).apply();
                    Log.d("TOKEN", "Successfully registered ID token for user: " + response.body().getId());
                }else{
                    Log.d("TOKEN", "Failed to register ID token");
                }
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                Log.d("TOKEN", "Token registration failed");
            }
        });

        TextView welcomeBackText = findViewById(R.id.welcome_back_text);
        welcomeBackText.setText(account.getDisplayName());

        ArrayList<NewsfeedPost> arrayOfPosts = new ArrayList<NewsfeedPost>();

        adapter = new NewsfeedPostAdapter(this, arrayOfPosts);

        newsfeed.setAdapter(adapter);
    }

    @Override
    public void onStart() {
        super.onStart();
        EventBus.getDefault().register(this);
    }

    @Override
    public void onStop() {
        super.onStop();
        EventBus.getDefault().unregister(this);
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void handleNewsFeedPostEvent(NewsfeedPostEvent newsfeedPostEvent) {
        Log.d("LIVE", newsfeedPostEvent.newsfeedPost.toString());
        adapter.insert(newsfeedPostEvent.newsfeedPost, 0);
        adapter.notifyDataSetChanged();
    }
}