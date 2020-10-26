package com.spottr.spottr.activities;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;

import com.spottr.spottr.models.Plan;
import com.spottr.spottr.R;

import org.jetbrains.annotations.NonNls;

public class GeneratePlan extends AppCompatActivity {

    ListView listView;
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
        listView = findViewById(R.id.plan_list);

        //creation of adapter
        Adapter adapter = new Adapter(this, names, reps, sets);
        listView.setAdapter(adapter);

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
            ImageView img = row.findViewById(R.id.list_icon);

            exerciseTitle.setText(names[position]);
            repNum.setText(String.valueOf(reps[position]));
            setNum.setText(String.valueOf(sets[position]));
            img.setImageResource(R.drawable.ic_baseline_directions_run_24);

            return row;
        }

    }
}