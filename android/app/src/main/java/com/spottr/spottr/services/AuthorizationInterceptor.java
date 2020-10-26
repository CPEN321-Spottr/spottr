package com.spottr.spottr.services;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import com.google.android.gms.auth.api.Auth;
import com.google.android.gms.auth.api.signin.GoogleSignInResult;
import com.google.android.gms.common.ConnectionResult;
import com.spottr.spottr.R;

import org.jetbrains.annotations.NotNull;

import java.io.IOException;

import okhttp3.Authenticator;
import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.Route;

public class AuthorizationInterceptor implements Interceptor, Authenticator {

    private final Context ctx;
    public String token;

    public AuthorizationInterceptor(Context ctx) {
        this.ctx = ctx;
        this.updateToken();
    }

    @NotNull
    @Override
    public Response intercept(@NotNull Chain chain) throws IOException {
        Request request = chain.request();

        Request newRequest = request.newBuilder()
                .addHeader("Content-Type", "application/json")
                .addHeader("Accept", "application/json")
                .addHeader("Authorization", this.token)
                .build();
        return chain.proceed(newRequest);
    }

    @NotNull
    @Override
    public Request authenticate(@NotNull Route route, Response response) throws IOException {
        Request requestAvailable = null;
        try {
            AuthorizationService.silentSignIn(this.ctx);
            this.updateToken();

            requestAvailable = response.request().newBuilder()
                    .addHeader("Authorization", this.token)
                    .build();
            return requestAvailable;
        } catch (Exception ex) { }

        return requestAvailable;
    }

    private void updateToken() {
        SharedPreferences preferences = ctx.getSharedPreferences(ctx.getString(R.string.user_credential_store), Context.MODE_PRIVATE);
        this.token = preferences.getString("oauth_token", "");
    }

}
