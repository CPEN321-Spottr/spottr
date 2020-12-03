package com.spottr.spottr;

import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.filters.LargeTest;
import androidx.test.rule.ActivityTestRule;

import com.spottr.spottr.activities.ReviewActivity;

import org.junit.FixMethodOrder;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import static org.junit.Assert.assertNotNull;

@RunWith(AndroidJUnit4.class)
@LargeTest
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class ReviewTests {
    @Rule
    public ActivityTestRule<ReviewActivity> mActivityTestRule = new ActivityTestRule<>(ReviewActivity.class);

    @Test
    public void testReviewPageDisplay() {
        assertNotNull("review_toohard was found", R.id.review_toohard);
        assertNotNull("review_difficult was found", R.id.review_difficult);
        assertNotNull("review_justright was found", R.id.review_justright);
        assertNotNull("review_fair was found", R.id.review_fair);
        assertNotNull("review_tooeasy was found", R.id.review_tooeasy);
    }
}
