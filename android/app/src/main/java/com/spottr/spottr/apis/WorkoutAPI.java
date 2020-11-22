package com.spottr.spottr.apis;

import com.spottr.spottr.constants.MuscleGroup;
import com.spottr.spottr.models.Exercise;
import com.spottr.spottr.models.Plan;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface WorkoutAPI {

    @GET("/exercises")
    Call<List<Exercise>> getExercises(
            @Query("mgroup") MuscleGroup mgroup
    );

    @GET("/plans")
    Call<List<Plan>> getPlans();

    @POST("/plans")
    Call<Plan> createPlan(@Body Plan plan);

    @GET("/plans/{planID}")
    Call<Plan> getPlanByID(@Path("planID") String planID);

    @GET("/users/{userID}/plans")
    Call<List<Plan>> getSavedPlansByUser(@Path("userID") String userID);

    @GET("/users/{userID}/workout/generate-plan/{lengthMinutes}&{targetMuscleGroup}")
    Call<Plan> getRecommendedPlan(
            @Path("userID") String userID,
            @Query("length-minutes") Integer minutes,
            @Query("target-muscle-group") Integer group
    );
}
