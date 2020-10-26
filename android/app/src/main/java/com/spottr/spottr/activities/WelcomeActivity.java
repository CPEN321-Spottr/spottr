package com.spottr.spottr.activities;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import com.spottr.spottr.R;

public class WelcomeActivity extends AppCompatActivity {

    Button generatePlan, chat;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_welcome);

        generatePlan = (Button) findViewById(R.id.main_generate);
        generatePlan.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(WelcomeActivity.this, GeneratePlan.class);
                startActivity(intent);
            }
        });


    }
}