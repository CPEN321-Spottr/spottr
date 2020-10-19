package com.spottr.spottr.activities;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.ButtonBarLayout;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import com.spottr.spottr.R;

public class LoginActivity extends AppCompatActivity {

    private Button signup_loginButton;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.spottr_login);

        //SIGN UP/LOGIN Button
        Button signup_loginButton = (Button) findViewById(R.id.login_submit);
        signup_loginButton.setOnClickListener(new View.OnClickListener () {
            @Override
            public void onClick(View v) {
                //code handling user login
            }
        });
    }
}