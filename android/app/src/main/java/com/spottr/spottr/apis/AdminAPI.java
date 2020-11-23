package com.spottr.spottr.apis;

import com.spottr.spottr.models.User;

import retrofit2.Call;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.POST;

public interface AdminAPI {

    @POST("/token")
    Call<User> registerToken();

    @FormUrlEncoded
    @POST("/firebase-token")
    Call<Void> registerFirebaseDeviceToken(@Field("firebase-token") String token);
}
