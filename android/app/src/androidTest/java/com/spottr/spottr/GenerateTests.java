package com.spottr.spottr;

import android.content.Intent;

import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.filters.LargeTest;
import androidx.test.rule.ActivityTestRule;

import com.spottr.spottr.activities.GeneratePlan;
import org.junit.FixMethodOrder;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;

import static org.junit.Assert.assertNotNull;

@RunWith(AndroidJUnit4.class)
@LargeTest
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class GenerateTests {
    @Rule
    public ActivityTestRule<GeneratePlan> mActivityTestRule = new ActivityTestRule<GeneratePlan>(GeneratePlan.class) {
        @Override
        protected Intent getActivityIntent() {
            Intent newIntent = new Intent();
            newIntent.putExtra("planID", "2005");
            return newIntent;
        }
    };

    @Test
    public void testGeneratePage() {
        assertNotNull("workoutcreation_returnButton was found", R.id.workoutcreation_returnButton);
        assertNotNull("workoutcreation_one_up_button was found", R.id.workoutcreation_one_up_button);
        assertNotNull("workoutcreation_startButton was found", R.id.workoutcreation_startButton);
    }
}
