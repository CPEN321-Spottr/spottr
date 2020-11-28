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

import com.spottr.spottr.R;

import java.util.ArrayList;

public class ExerciseAdapter extends ArrayAdapter {

    public ExerciseAdapter(Context context, ArrayList<Exercise> exercises) {
        super(context, 0, exercises);
    }

    @NonNull
    @Override
    public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {
        Exercise exercise = (Exercise) getItem(position);

        if(convertView == null) {
            convertView = LayoutInflater.from(getContext()).inflate(R.layout.list_item, parent, false);
        }

        TextView exerciseTitle = convertView.findViewById(R.id.exercise_title);
        TextView repNum = convertView.findViewById(R.id.reps_num);
        TextView setNum = convertView.findViewById(R.id.sets_num);
        ImageView img = convertView.findViewById(R.id.message_photo);

        exerciseTitle.setText(exercise.name);
        repNum.setText(String.valueOf(exercise.reps));
        setNum.setText(String.valueOf(exercise.sets));
        img.setImageResource(R.drawable.ic_baseline_directions_run_24);

        return convertView;
    }
}
