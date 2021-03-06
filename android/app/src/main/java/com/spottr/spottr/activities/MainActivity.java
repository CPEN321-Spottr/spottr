package com.spottr.spottr.activities;

import android.content.Context;
import android.content.Intent;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
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
import com.spottr.spottr.apis.WorkoutAPI;
import com.spottr.spottr.events.NewsfeedPostEvent;
import com.spottr.spottr.models.NewsfeedPost;
import com.spottr.spottr.models.NewsfeedPostAdapter;
import com.spottr.spottr.models.User;
import com.spottr.spottr.services.AuthorizationServiceHelper;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;
import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MainActivity extends AppCompatActivity {

    private NewsfeedPostAdapter adapter;
    private TextView spottrPointsText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        ImageView imgProfilePic = (ImageView) findViewById(R.id.profile_pic);
        final ListView newsfeed = findViewById(R.id.newsfeed);

        Button workoutButton = (Button) findViewById(R.id.get_workout_button);
        workoutButton.setOnClickListener(this.getGenerateWorkoutOnClickListener(5));

        Button workoutButton2 = (Button) findViewById(R.id.get_workout_button2);
        workoutButton2.setOnClickListener(this.getGenerateWorkoutOnClickListener(10));

        Button workoutButton3 = (Button) findViewById(R.id.get_workout_button3);
        workoutButton3.setOnClickListener(this.getGenerateWorkoutOnClickListener(20));

        Bundle extras = getIntent().getExtras();
        GoogleSignInAccount account = (GoogleSignInAccount) extras.get("account");
        assert account != null;

        TextView welcomeBackText = findViewById(R.id.welcome_back_text);
        welcomeBackText.setText(account.getDisplayName());

        Glide.with(this)
                .load(account.getPhotoUrl())
                .override(400, 400)
                .apply(RequestOptions.circleCropTransform())
                .into(imgProfilePic);

        AuthorizationServiceHelper.silentSignIn(this);

        APIFactory apiFactory = new APIFactory(this);
        final AdminAPI adminAPI = apiFactory.getAdminAPI();

        this.handleFirebaseRegistration(adminAPI);
        this.handleGoogleIDTokenRegistration(adminAPI);


        // Configure Newsfeed
        newsfeed.setOnItemClickListener(new AdapterView.OnItemClickListener() {

            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                NewsfeedPost o = (NewsfeedPost) newsfeed.getItemAtPosition(position);

                Intent newIntent = new Intent(MainActivity.this, GeneratePlan.class);
                GoogleSignInAccount account = (GoogleSignInAccount) getIntent().getExtras().get("account");
                newIntent.putExtra("planID", o.workout_plan_id.toString());
                newIntent.putExtra("account", account);
                startActivity(newIntent);
            }
        });

        newsfeed.setClickable(true);

        adapter = new NewsfeedPostAdapter(this, new ArrayList<NewsfeedPost>());
        newsfeed.setAdapter(adapter);

        WorkoutAPI workoutAPI = apiFactory.getWorkoutAPI();

        Call<List<NewsfeedPost>> getNewsfeedPosts = workoutAPI.getGlobalWorkoutHistory(10);
        getNewsfeedPosts.enqueue(new Callback<List<NewsfeedPost>>() {
            @Override
            public void onResponse(Call<List<NewsfeedPost>> call, Response<List<NewsfeedPost>> response) {
                if(response.code() == 200) {
                    List<NewsfeedPost> arrayOfPosts = response.body();
                    adapter.addAll(arrayOfPosts);
                    adapter.notifyDataSetChanged();
                }else{
                    Log.d("NEWSFEED", "Failed to retrieve newsfeed posts " + response.code());
                }
            }

            @Override
            public void onFailure(Call<List<NewsfeedPost>> call, Throwable t) {
                Log.d("NEWSFEED", t.toString());
                Log.d("NEWSFEED", "Failed to retrieve newsfeed posts");
            }
        });
    }

    @NotNull
    @Contract(value = "_ -> new", pure = true)
    private View.OnClickListener getGenerateWorkoutOnClickListener(final Integer duration) {
        return new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent newIntent = new Intent(MainActivity.this, GeneratePlan.class);
                GoogleSignInAccount account = (GoogleSignInAccount) getIntent().getExtras().get("account");
                newIntent.putExtra("account", account);
                newIntent.putExtra("workout_length", duration);
                startActivity(newIntent);
            }
        };
    }

    private void handleFirebaseRegistration(final AdminAPI adminAPI) {
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
    }

    private void handleGoogleIDTokenRegistration(final AdminAPI adminAPI) {
        Call<User> call = adminAPI.registerToken();
        call.enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if(response.code() == 200) {
                    SharedPreferences preferences = getSharedPreferences(getString(R.string.user_credential_store), Context.MODE_PRIVATE);
                    preferences.edit().putInt("userID", Integer.parseInt(response.body().getId())).apply();
                    Log.d("TOKEN", "Successfully registered ID token for user: " + response.body().getId());
                    Log.d("TOKEN", "Successfully registered ID token for user: " + response.body());

                    spottrPointsText = findViewById(R.id.spottr_points_text);
                    String text = getString(R.string.spottr_points) + response.body().getSpottrPoints().toString();
                    spottrPointsText.setText(text);

                }else{
                    Log.d("TOKEN", "Failed to register ID token");
                }
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                Log.d("TOKEN", "Token registration failed");
            }
        });
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