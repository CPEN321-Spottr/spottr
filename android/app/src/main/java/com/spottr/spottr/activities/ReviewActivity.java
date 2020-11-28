package com.spottr.spottr.activities;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import androidx.appcompat.app.AppCompatActivity;

import com.spottr.spottr.R;

public class ReviewActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_review);

        Button tooHard = (Button) findViewById(R.id.review_toohard);
        Button difficult = (Button) findViewById(R.id.review_difficult);
        Button justRight = (Button) findViewById(R.id.review_difficult);
        Button fair = (Button) findViewById(R.id.review_difficult);
        Button tooEasy = (Button) findViewById(R.id.review_difficult);

        tooHard.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                long timeDiff = now.getTime() - startTime;
                Intent newIntent = new Intent(WorkoutActivity.this, ReviewActivity.class);
                newIntent.putExtra("time", timeDiff);
                startActivity(newIntent);
            }
        });
        difficult.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                long timeDiff = now.getTime() - startTime;
                Intent newIntent = new Intent(WorkoutActivity.this, ReviewActivity.class);
                newIntent.putExtra("time", timeDiff);
                startActivity(newIntent);
            }
        });
        justRight.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                long timeDiff = now.getTime() - startTime;
                Intent newIntent = new Intent(WorkoutActivity.this, ReviewActivity.class);
                newIntent.putExtra("time", timeDiff);
                startActivity(newIntent);
            }
        });
        fair.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                long timeDiff = now.getTime() - startTime;
                Intent newIntent = new Intent(WorkoutActivity.this, ReviewActivity.class);
                newIntent.putExtra("time", timeDiff);
                startActivity(newIntent);
            }
        });
        tooEasy.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                long timeDiff = now.getTime() - startTime;
                Intent newIntent = new Intent(WorkoutActivity.this, ReviewActivity.class);
                newIntent.putExtra("time", timeDiff);
                startActivity(newIntent);
            }
        });

    }
}
