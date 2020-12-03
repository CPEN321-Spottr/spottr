package com.spottr.spottr.activities;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import com.google.android.gms.auth.api.Auth;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInResult;
import com.google.android.gms.common.SignInButton;

import com.spottr.spottr.R;
import com.spottr.spottr.services.AuthorizationServiceHelper;

public class LoginActivity extends AppCompatActivity {

    private static final int RC_SIGN_IN = 1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_spottr_login);

        final GoogleSignInClient mGoogleSignInClient = AuthorizationServiceHelper.getDefaultSignInClient(this);

        SignInButton signInButton = findViewById(R.id.sign_in_button);
        signInButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = mGoogleSignInClient.getSignInIntent();
                startActivityForResult(intent, RC_SIGN_IN);
            }
        });
    }

    @Override
    protected void onStart() {
        super.onStart();

        GoogleSignInAccount account = GoogleSignIn.getLastSignedInAccount(this);

        if(account != null) {
            handleUserAccount(account);
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if(requestCode==RC_SIGN_IN){
            GoogleSignInResult result = Auth.GoogleSignInApi.getSignInResultFromIntent(data);
            handleSignInResult(result);
        }
    }
    private void handleSignInResult(GoogleSignInResult result){
        if(result.isSuccess()){
            Log.d("LOGIN", "User successfully logged in");
            handleUserAccount(result.getSignInAccount());
        }else{
            Log.d("LOGIN", result.getStatus().toString());
            Toast.makeText(getApplicationContext(),"Google Sign-In Unsuccessful",Toast.LENGTH_LONG).show();
        }
    }

    private void handleUserAccount(GoogleSignInAccount account) {
        Intent intent = new Intent(LoginActivity.this, MainActivity.class);
        intent.putExtra("account", account);

        SharedPreferences preferences = getSharedPreferences(getString(R.string.user_credential_store), Context.MODE_PRIVATE);
        preferences.edit().putString("oauth_token", account.getIdToken()).apply();

        startActivity(intent);
    }
}