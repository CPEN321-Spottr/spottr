package com.spottr.spottr.activities;

import android.os.Bundle;
import android.util.Log;
import android.widget.ImageView;

import androidx.appcompat.app.AppCompatActivity;

import com.bumptech.glide.Glide;

import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.spottr.spottr.R;

import static com.bumptech.glide.load.resource.drawable.DrawableTransitionOptions.withCrossFade;

public class MainActivity extends AppCompatActivity {

    private ImageView imgProfilePic;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        ImageView imgProfilePic = (ImageView) findViewById(R.id.profile_pic);

        Bundle extras = getIntent().getExtras();

        GoogleSignInAccount account = (GoogleSignInAccount) extras.get("account");
        Log.d("ACCOUNT", account.getDisplayName());
        Log.d("ACCOUNT", account.getPhotoUrl().toString());

//        Glide.with(this)
//                .load(account.getPhotoUrl())
//                .into(imgProfilePic);

    }
}