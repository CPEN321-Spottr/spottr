package com.spottr.spottr.activities;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;

import androidx.appcompat.app.AppCompatActivity;

import com.spottr.spottr.R;
import com.spottr.spottr.apis.APIFactory;
import com.spottr.spottr.apis.ReviewAPI;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ReviewActivity extends AppCompatActivity {

    private String muscleId;
    private int duration;
    private String workoutId;
    private Integer userId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_review);

        muscleId = getIntent().getStringExtra("muscleId");
        duration = getIntent().getIntExtra("duration", -1);
        workoutId = getIntent().getStringExtra("workoutId");
        userId = new Integer(getIntent().getIntExtra("userId", -1));


        Button tooHard = (Button) findViewById(R.id.review_toohard);
        Button difficult = (Button) findViewById(R.id.review_difficult);
        Button justRight = (Button) findViewById(R.id.review_justright);
        Button fair = (Button) findViewById(R.id.review_fair);
        Button tooEasy = (Button) findViewById(R.id.review_tooeasy);

        tooHard.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                passResult(-2);
            }
        });
        difficult.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                passResult(-1);
            }
        });
        justRight.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                passResult(0);
            }
        });
        fair.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                passResult(1);
            }
        });
        tooEasy.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                passResult(2);
            }
        });
    }

    public void passResult(int rating) {

        APIFactory apiFactory = new APIFactory(this);

        final ReviewAPI reviewAPI = apiFactory.getReviewAPI();

        Call<Integer> completedWorkoutCall = reviewAPI.completedWorkout(userId ,workoutId, duration);
        Call<Integer> workoutReviewCall = reviewAPI.changeDifficulty(userId, muscleId, rating);

        completedWorkoutCall.enqueue(new Callback<Integer>() {
            @Override
            public void onResponse(Call<Integer> completedWorkoutCall, Response<Integer> response) {
                Log.d("GENERATE", "Successfully submitted the workout completion");
            }

            @Override
            public void onFailure(Call<Integer> call, Throwable t) {
                Log.d("GENERATE", "Workout completion failed");
            }
        });

        workoutReviewCall.enqueue(new Callback<Integer>() {
            @Override
            public void onResponse(Call<Integer> workoutReviewCall, Response<Integer> response) {
                Log.d("GENERATE", "Successfully completed the workout");
            }

            @Override
            public void onFailure(Call<Integer> call, Throwable t) {
                Log.d("GENERATE", "Workout completion failed");
            }
        });

        //Call the back-end with what button the user clicked
        Intent newIntent = new Intent(this, LoginActivity.class);

        newIntent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        startActivity(newIntent);

    }



}
