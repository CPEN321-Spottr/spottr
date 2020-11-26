package com.spottr.spottr.activities;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.os.CountDownTimer;
import android.util.Log;
import android.view.View;

import android.widget.Button;
import android.widget.TextView;

import com.google.gson.Gson;
import com.spottr.spottr.R;
import com.spottr.spottr.models.Exercise;
import com.spottr.spottr.models.Plan;
import com.spottr.spottr.models.Rest;

import java.text.SimpleDateFormat;
import java.util.Date;

public class WorkoutActivity extends AppCompatActivity {

    private boolean isExercise = true;

    private int exerciseCounter = 0;
    private int restCounter = 0;

    private Exercise currentExercise;
    private Rest currentRest;
    private Plan workoutPlan;

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_workout);

        Gson gson = new Gson();
        String gsonString = getIntent().getStringExtra("PLAN");
        workoutPlan = gson.fromJson(gsonString, Plan.class);
        workoutPlan.num_exercises = workoutPlan.exercises.size();
        Log.d("TEST", String.valueOf(workoutPlan.exercises.get(exerciseCounter)));
        Log.d("TEST", String.valueOf(workoutPlan.exercises.get(exerciseCounter).name));


        currentExercise = workoutPlan.exercises.get(exerciseCounter);
        currentRest = workoutPlan.breaks.get(restCounter);

        TextView exerciseTitle = (TextView) findViewById(R.id.workout_title);
        exerciseTitle.setText(currentExercise.name);
        TextView clock = (TextView) findViewById(R.id.workout_clock);
        clock.setText("Sets: " + currentExercise.sets + "  Reps: " + currentExercise.reps);

        findViewById(R.id.workout_prev).setVisibility(View.INVISIBLE);

        //Buttons
        Button exitButton = (Button) findViewById(R.id.workout_exit);
        exitButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });

        Button nextButton = (Button) findViewById(R.id.workout_next);
        nextButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                nextExercise();
            }
        });

        Button prevButton = (Button) findViewById(R.id.workout_prev);
        prevButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                prevExercise();
            }
        });


    }

    public void nextExercise() {
        //check if changing to the last exercise
        if (isExercise) {
            currentRest = workoutPlan.breaks.get(restCounter);
            TextView exerciseTitle = (TextView) findViewById(R.id.workout_title);
            exerciseTitle.setText(currentRest.name);


            findViewById(R.id.workout_next).setVisibility(View.INVISIBLE);
            findViewById(R.id.workout_prev).setVisibility(View.INVISIBLE);

            final TextView clock = (TextView) findViewById(R.id.workout_clock);
            new CountDownTimer(currentRest.duration_sec.intValue() * 1000, 10) {

                public void onTick(long millisUntilFinished) {
                    clock.setText("" + new SimpleDateFormat("mm:ss:SS").format(new Date(millisUntilFinished)));
                }

                public void onFinish() {
                    clock.setText("Next exercise!");
                    findViewById(R.id.workout_next).setVisibility(View.VISIBLE);
                    findViewById(R.id.workout_prev).setVisibility(View.VISIBLE);
                }
            }.start();

            isExercise = !isExercise;
        } else {
            //increment both the rest and exercise counter to the next only if pressing next on a break
            this.exerciseCounter++;
            this.restCounter++;
            currentExercise = workoutPlan.exercises.get(exerciseCounter);
            TextView exerciseTitle = (TextView) findViewById(R.id.workout_title);
            exerciseTitle.setText(String.valueOf(currentExercise.name));
            TextView clock = (TextView) findViewById(R.id.workout_clock);
            clock.setText("Sets: " + currentExercise.sets + "  Reps: " + currentExercise.reps);

            findViewById(R.id.workout_prev).setVisibility(View.VISIBLE);
            findViewById(R.id.workout_next).setVisibility(View.VISIBLE);
            isExercise = !isExercise;
        }

        if (exerciseCounter == workoutPlan.exercises.size() - 1) {
            findViewById(R.id.workout_next).setVisibility(View.INVISIBLE);
        }


    }

    public void prevExercise() {
        //check if at the last exercise
        //if so, remove the next button

        if (isExercise) {
            //shift the rest and exercise counter back only if on an exercise
            this.exerciseCounter--;
            this.restCounter--;

            currentRest = workoutPlan.breaks.get(restCounter);
            TextView exerciseTitle = (TextView) findViewById(R.id.workout_title);
            exerciseTitle.setText(currentRest.name);

            findViewById(R.id.workout_next).setVisibility(View.INVISIBLE);
            findViewById(R.id.workout_prev).setVisibility(View.INVISIBLE);

            final TextView clock = (TextView) findViewById(R.id.workout_clock);
            new CountDownTimer(currentRest.duration_sec.intValue() * 1000, 10) {

                public void onTick(long millisUntilFinished) {
                    clock.setText("" + new SimpleDateFormat("mm:ss:SS").format(new Date(millisUntilFinished)));
                }

                public void onFinish() {
                    findViewById(R.id.workout_next).setVisibility(View.VISIBLE);
                    findViewById(R.id.workout_prev).setVisibility(View.VISIBLE);
                    clock.setText("Next exercise!");
                }
            }.start();

            isExercise = !isExercise;
        } else {

            currentExercise = workoutPlan.exercises.get(exerciseCounter);
            TextView exerciseTitle = (TextView) findViewById(R.id.workout_title);
            exerciseTitle.setText(String.valueOf(currentExercise.name));
            TextView clock = (TextView) findViewById(R.id.workout_clock);
            clock.setText("Sets: " + currentExercise.sets + "  Reps: " + currentExercise.reps);

            findViewById(R.id.workout_next).setVisibility(View.VISIBLE);
            findViewById(R.id.workout_prev).setVisibility(View.VISIBLE);

            isExercise = !isExercise;
        }

        if (exerciseCounter == 0 && isExercise) {
            findViewById(R.id.workout_prev).setVisibility(View.INVISIBLE);
        }
    }
}