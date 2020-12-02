package com.spottr.spottr.activities;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ListView;

import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.gson.Gson;
import com.spottr.spottr.apis.APIFactory;
import com.spottr.spottr.apis.WorkoutAPI;
import com.spottr.spottr.models.Exercise;
import com.spottr.spottr.models.ExerciseAdapter;
import com.spottr.spottr.models.Plan;
import com.spottr.spottr.R;

import java.util.ArrayList;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class GeneratePlan extends AppCompatActivity {

    private Call<Plan> call;

    private Plan workoutPlan;
    private String workoutId;
    private String muscleId;
    private int userId;
    private ArrayList<Exercise> exercises = new ArrayList<Exercise>();

    private ExerciseAdapter adapter;

    private Button oneupButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_generate_plan);

        Bundle extras = getIntent().getExtras();

        APIFactory apiFactory = new APIFactory(this);
        final WorkoutAPI workoutAPI = apiFactory.getWorkoutAPI();

        //return button
        Button returnButton = (Button) findViewById(R.id.workoutcreation_returnButton);
        returnButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });

        // one up button
        oneupButton = (Button) findViewById(R.id.workoutcreation_one_up_button);
        oneupButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                oneUp(workoutAPI);
            }
        });

        // start button
        Button startButton = (Button) findViewById(R.id.workoutcreation_startButton);
        startButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                passInfo();
            }
        });

        SharedPreferences preferences = getSharedPreferences(getString(R.string.user_credential_store), Context.MODE_PRIVATE);
        userId = preferences.getInt("userID", -1);

        // determine if we should display an existing plan or
        String planID = extras.getString("planID");
        if(planID != null) {
            call = workoutAPI.getPlanByID(planID);
        } else {
            Log.d("GENERATE", "Generating new plan");

            muscleId = "1";
            call = workoutAPI.getRecommendedPlan(userId, 5, Integer.valueOf(muscleId));

            oneupButton.setVisibility(View.INVISIBLE);
            oneupButton.setClickable(false);
        }

        ListView listView = findViewById(R.id.plan_list);

        //creation of adapter
        adapter = new ExerciseAdapter(this, exercises);
        listView.setAdapter(adapter);

        getPlan(call);
    }

    private void passInfo() {
        Intent newIntent = new Intent(GeneratePlan.this, WorkoutActivity.class);

        Gson gson = new Gson();
        String gsonString = gson.toJson(workoutPlan);
        newIntent.putExtra("PLAN", gsonString);
        newIntent.putExtra("muscleId", muscleId);
        newIntent.putExtra("userId", userId);
        newIntent.putExtra("workoutId", workoutId);
        Log.d("TEST", gsonString);

        GoogleSignInAccount account = (GoogleSignInAccount) getIntent().getExtras().get("account");
        newIntent.putExtra("account", account);

        startActivity(newIntent);
    }

    private void oneUp(WorkoutAPI workoutAPI) {

        call = workoutAPI.getOneUpPlan(userId, workoutPlan.workout_plan_id);
        getPlan(call);

        oneupButton.setVisibility(View.INVISIBLE);
        oneupButton.setClickable(false);

    }

    private void getPlan(Call<Plan> call) {
        call.enqueue(new Callback<Plan>() {
            @Override
            public void onResponse(Call<Plan> call, Response<Plan> response) {
                if(response.code() == 200) {
                    Log.d("GENERATE", "Successfully generated a workout");
                    Log.d("GENERATE", response.body().toString());
                    workoutPlan = response.body();
                    workoutId = workoutPlan.workout_plan_id;
                    Log.d("TEST", workoutPlan.toString());
                    exercises.clear();
                    exercises.addAll(workoutPlan.exercises);
                    adapter.notifyDataSetChanged();
                } else {
                    Log.d("GENERATE", response.toString());
                }
            }

            @Override
            public void onFailure(Call<Plan> call, Throwable t) {
                Log.d("GENERATE", "Workout generation failed", t);
            }
        });
    }

}