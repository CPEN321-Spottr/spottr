package com.spottr.spottr;

import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.filters.LargeTest;
import androidx.test.rule.ActivityTestRule;

import com.spottr.spottr.activities.GeneratePlan;

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
public class GenerateTests {
    @Rule
    public ActivityTestRule<GeneratePlan> mActivityTestRule = new ActivityTestRule<>(GeneratePlan.class);

    @Test
    public void testReturnToMain() {
        assertNotNull("workoutcreation_returnButton was found", R.id.workoutcreation_returnButton);
        assertNotNull("workoutcreation_startButton was found", R.id.workoutcreation_startButton);
        onView(withId(R.id.workoutcreation_returnButton)).perform(click());
        onView(withId(R.id.layout_main)).check(matches(isDisplayed()));
    }

    @Test
    public void testStartWorkout() {
        assertNotNull("workoutcreation_returnButton was found", R.id.workoutcreation_returnButton);
        assertNotNull("workoutcreation_startButton was found", R.id.workoutcreation_startButton);
        onView(withId(R.id.workoutcreation_startButton)).perform(click());
        onView(withId(R.id.layout_workout)).check(matches(isDisplayed()));
    }

}
