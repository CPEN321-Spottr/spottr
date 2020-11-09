package com.spottr.spottr.apis;

import android.content.Context;

import com.spottr.spottr.services.AuthorizationInterceptor;

import okhttp3.OkHttpClient;

import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class APIFactory {

    private final Context ctx;
    private final Retrofit retrofit;
    private final AuthorizationInterceptor authInterceptor;
    private final OkHttpClient okHttpClient;

    public APIFactory(Context ctx) {
        this.ctx = ctx;

        authInterceptor = new AuthorizationInterceptor(this.ctx);

        okHttpClient = new OkHttpClient
                .Builder()
                .addInterceptor(authInterceptor)
                .authenticator(authInterceptor)
                .build();

        retrofit = new Retrofit.Builder()
                .client(okHttpClient)
                .addConverterFactory(GsonConverterFactory.create())
                .baseUrl("https://spottr-be.herokuapp.com/")
                .build();
    }

    public CommunityAPI getCommunityAPI() {
        return retrofit.create(CommunityAPI.class);
    }

    public WorkoutAPI getWorkoutAPI() {
        return retrofit.create(WorkoutAPI.class);
    }
    public AdminAPI getAdminAPI() {
        return retrofit.create(AdminAPI.class);
    }

}
