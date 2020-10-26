package com.spottr.spottr.apis;

import com.spottr.spottr.models.Message;
import com.spottr.spottr.models.User;
import com.spottr.spottr.models.Workout;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Headers;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface CommunityAPI {

    @Headers("Cache-Control: max-age=640000")
    @POST("/token")
    Call<User> registerToken();

    @GET("/users")
    Call<List<User>> getUsers();

    @POST("/users")
    Call<User> createUser(@Body User user);

    @GET("/users/{userID}")
    Call<User> getUser(@Path("userID") String userID);

    @DELETE("/users/{userID}")
    Call<Void> deleteUser(@Path("userID") String userID);

    @GET("/users/{userID}/messages")
    Call<List<Message>> getMessages(@Path("userID") String userID);

    @POST("/users/{userID}/messages")
    Call<Message> sendMessage(@Body Message message);

    @GET("/users/{userID}/workouts")
    Call<List<Workout>> getWorkouts(@Path("userID") String userID);

    @POST("/users/{userID}/workouts")
    Call<Workout> createWorkout(@Path("userID") String userID);
}

