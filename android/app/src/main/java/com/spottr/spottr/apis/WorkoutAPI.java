package com.spottr.spottr.apis;

import com.spottr.spottr.models.NewsfeedPost;
import com.spottr.spottr.models.Plan;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface WorkoutAPI {

    @GET("/workout/history")
    Call<List<NewsfeedPost>> getGlobalWorkoutHistory(
            @Query("entries") Integer entries
    );

    @GET("/plans")
    Call<List<Plan>> getPlans();

    @POST("/plans")
    Call<Plan> createPlan(@Body Plan plan);

    @GET("/workout/plan/{workoutPlanId}")
    Call<Plan> getPlanByID(@Path("workoutPlanId") String workoutPlanId);

    @GET("/users/{userID}/plans")
    Call<List<Plan>> getSavedPlansByUser(@Path("userID") String userID);

    @GET("/users/{userID}/workout/generate-plan")
    Call<Plan> getRecommendedPlan(
            @Path("userID") Integer userID,
            @Query("length-minutes") Integer minutes,
            @Query("target-muscle-group") Integer group
    );
}
