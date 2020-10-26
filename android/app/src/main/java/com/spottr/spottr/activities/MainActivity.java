package com.spottr.spottr.activities;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.widget.ImageView;

import androidx.appcompat.app.AppCompatActivity;

import com.bumptech.glide.Glide;

import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.bumptech.glide.request.RequestOptions;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.spottr.spottr.R;
import com.spottr.spottr.apis.APIFactory;
import com.spottr.spottr.apis.CommunityAPI;
import com.spottr.spottr.models.User;
import com.spottr.spottr.services.AuthorizationService;

import java.util.Objects;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

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
        assert account != null;
        Log.d("ACCOUNT", Objects.requireNonNull(account.getDisplayName()));
        Log.d("ACCOUNT", Objects.requireNonNull(account.getPhotoUrl()).toString());

        if(account.getIdToken() != null) {
            Log.d("ACCOUNT", Objects.requireNonNull(account.getIdToken()));
        } else {
            Log.d("ACCOUNT", "Could not get ID token");
        }

        Glide.with(this)
                .load(account.getPhotoUrl())
                .override(400, 400)
                .apply(RequestOptions.circleCropTransform())
                .into(imgProfilePic);

        AuthorizationService.silentSignIn(this);

        APIFactory apiFactory = new APIFactory(this);

        CommunityAPI communityAPI = apiFactory.getCommunityAPI();

        Call<User> call = communityAPI.registerToken();

        call.enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if(response.code() == 200) {
                    Log.d("TOKEN", "Successfully registered token");
                }
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                Log.d("TOKEN", "Token registration failed");
            }
        });
    }
}