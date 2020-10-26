package com.spottr.spottr.apis;

import android.content.Context;

import com.spottr.spottr.services.AuthorizationInterceptor;

import okhttp3.OkHttpClient;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class APIFactory {

    private final Context ctx;
    private final Retrofit retrofit;

    public APIFactory(Context ctx) {
        this.ctx = ctx;

        AuthorizationInterceptor authInterceptor = new AuthorizationInterceptor(this.ctx);

        OkHttpClient okHttpClient = new OkHttpClient()
                .newBuilder()
                .addInterceptor(authInterceptor)
                .build();

        retrofit = new Retrofit.Builder()
                .client(okHttpClient)
                .addConverterFactory(GsonConverterFactory.create())
                .baseUrl("https://spottr-be.herokuapp.com/")
                .build();
    }

    public CommunityAPI getCommunityAPI() {
        return this.retrofit.create(CommunityAPI.class);
    }

}
