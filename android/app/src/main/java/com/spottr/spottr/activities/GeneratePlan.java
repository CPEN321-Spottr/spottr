package com.spottr.spottr.activities;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;

import com.spottr.spottr.apis.APIFactory;
import com.spottr.spottr.apis.WorkoutAPI;
import com.spottr.spottr.models.Plan;
import com.spottr.spottr.R;
import com.spottr.spottr.models.User;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class GeneratePlan extends AppCompatActivity {

    ListView listView;
    User user;
    Plan workoutPlan;
    //temp Values
    String[] names = {"Pushup", "Squat", "Lunge", "Crunch", "Pushup2", "Squat2", "Lunge2", "Crunch2"};
    int[] reps = {10, 10, 10, 10, 10, 10, 10, 10};
    int[] sets = {4, 5, 6, 7, 4, 5, 6, 7};

    Button returnButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_generate_plan);

        APIFactory apiFactory = new APIFactory(this);

        WorkoutAPI workoutAPI = apiFactory.getWorkoutAPI();

        //userID 6 was given to
        Call<Plan> call = workoutAPI.getRecommendedPlan("6", 45, 1);

        listView = findViewById(R.id.plan_list);

        //creation of adapter
        final Adapter adapter = new Adapter(GeneratePlan.this, names, reps, sets);
        listView.setAdapter(adapter);

        call.enqueue(new Callback<Plan>() {
            @Override
            public void onResponse(Call<Plan> call, Response<Plan> response) {
                if(response.code() == 200) {
                    Log.d("GENERATE", "Successfully generated a workout");
                    Log.d("GENERATE", response.body().toString());
                    workoutPlan = response.body();
                    adapter.names = workoutPlan.getRoutineNames();
                    adapter.reps = workoutPlan.getRoutineReps();
                    adapter.sets = workoutPlan.getRoutineSets();
                    adapter.notifyDataSetChanged();
                } else {
                    Log.d("GENERATE", response.toString());
                }

            }

            @Override
            public void onFailure(Call<Plan> call, Throwable t) {
                Log.d("GENERATE", "Workout generation failed");
            }
        });

        //return button
        returnButton = (Button) findViewById(R.id.workoutcreation_returnButton);
        returnButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });
    }

    class Adapter extends ArrayAdapter<String> {

        Context context;
        String names[];
        int sets[];
        int reps[];

        Adapter (Context c, String names[], int reps[], int sets[]) {
            super(c, R.layout.list_item, R.id.exercise_title, names);
            this.context = c;
            this.names = names;
            this.reps = reps;
            this.sets = sets;

        }

        @NonNull
        @Override
        public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {
            LayoutInflater layoutInflater = (LayoutInflater)getApplicationContext().getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            View row = layoutInflater.inflate(R.layout.list_item, parent, false);
            TextView exerciseTitle = row.findViewById(R.id.exercise_title);
            TextView repNum = row.findViewById(R.id.reps_num);
            TextView setNum = row.findViewById(R.id.sets_num);
            ImageView img = row.findViewById(R.id.message_photo);

            exerciseTitle.setText(names[position]);
            repNum.setText(String.valueOf(reps[position]));
            setNum.setText(String.valueOf(sets[position]));
            img.setImageResource(R.drawable.ic_baseline_directions_run_24);

            return row;
        }

    }
}