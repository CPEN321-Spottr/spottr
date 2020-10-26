package com.spottr.spottr.services;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import androidx.annotation.NonNull;

import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.spottr.spottr.R;

public class AuthorizationService  {

    public static GoogleSignInClient getDefaultSignInClient(Context ctx) {
        // Configure sign-in to request the user's ID, email address, and basic
        // profile. ID and basic profile are included in DEFAULT_SIGN_IN.
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestIdToken(ctx.getString(R.string.server_client_id))
                .requestEmail()
                .build();

        return GoogleSignIn.getClient(ctx, gso);
    }

    public static void silentSignIn(final Context ctx) {
        // Configure sign-in to request the user's ID, email address, and basic
        // profile. ID and basic profile are included in DEFAULT_SIGN_IN.
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestIdToken(ctx.getString(R.string.server_client_id))
                .requestEmail()
                .build();

        GoogleSignInClient mGoogleSignInClient =  GoogleSignIn.getClient(ctx, gso);
        Task<GoogleSignInAccount> opr = mGoogleSignInClient.silentSignIn();

        opr.addOnCompleteListener(new OnCompleteListener<GoogleSignInAccount>() {
            @Override
            public void onComplete(@NonNull Task<GoogleSignInAccount> task) {
                if(task.isSuccessful()) {
                    Log.d("LOGIN", "User successfully logged in (silent)");
                    Log.d("LOGIN", task.getResult().getIdToken());
                    SharedPreferences preferences = ctx.getSharedPreferences(ctx.getString(R.string.user_credential_store), Context.MODE_PRIVATE);
                    preferences.edit().putString("oauth_token", task.getResult().getIdToken()).apply();
                } else {
                    Log.d("LOGIN", "User login unsuccessful (silent)");
                }
            }
        });
    }
}
