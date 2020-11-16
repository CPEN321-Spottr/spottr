package com.spottr.spottr;

import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.filters.LargeTest;
import androidx.test.rule.ActivityTestRule;

import com.spottr.spottr.activities.WorkoutActivity;

import org.junit.FixMethodOrder;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static org.junit.Assert.assertNotNull;

@RunWith(AndroidJUnit4.class)
@LargeTest
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class WorkoutTests {
    @Rule
    public ActivityTestRule<WorkoutActivity> mActivityTestRule = new ActivityTestRule<>(WorkoutActivity.class);

    @Test
    public void testReturnToGenerate() {
        assertNotNull("workout_exit was found", R.id.workout_exit);
        assertNotNull("workout_next was found", R.id.workout_next);
        assertNotNull("workout_prev was found", R.id.workout_prev);
        assertNotNull("workout_pause was found", R.id.workout_pause);
        onView(withId(R.id.workout_exit)).perform(click());
        onView(withId(R.id.generate_plan_layout)).check(matches(isDisplayed()));
    }

    @Test
    public void testNextExercise() {
        assertNotNull("workout_exit was found", R.id.workout_exit);
        assertNotNull("workout_next was found", R.id.workout_next);
        assertNotNull("workout_prev was found", R.id.workout_prev);
        assertNotNull("workout_pause was found", R.id.workout_pause);
        onView(withId(R.id.workout_next)).perform(click());
        onView(withId(R.id.layout_workout)).check(matches(isDisplayed()));
    }

    @Test
    public void testPreviousExercise() {
        assertNotNull("workout_exit was found", R.id.workout_exit);
        assertNotNull("workout_next was found", R.id.workout_next);
        assertNotNull("workout_prev was found", R.id.workout_prev);
        assertNotNull("workout_pause was found", R.id.workout_pause);
        onView(withId(R.id.workout_prev)).perform(click());
        onView(withId(R.id.layout_workout)).check(matches(isDisplayed()));
    }

}
