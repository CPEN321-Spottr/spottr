package com.spottr.spottr.services;

import android.net.Uri;
import android.util.Log;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import com.spottr.spottr.events.NewsfeedPostEvent;
import com.spottr.spottr.models.NewsfeedPost;

import org.greenrobot.eventbus.EventBus;

import java.math.BigInteger;
import java.util.Date;

import static android.content.ContentValues.TAG;

public class NewsfeedNotificationService extends FirebaseMessagingService {

    /**
     * Called if FCM registration token is updated. This may occur if the security of
     * the previous token had been compromised. Note that this is called when the
     * FCM registration token is initially generated so this is where you would retrieve
     * the token.
     */
    @Override
    public void onNewToken(String tkn) {
        Log.d(TAG, "Refreshed token: " + tkn);

        // If you want to send messages to this application instance or
        // manage this apps subscriptions on the server side, send the
        // FCM registration token to your app server.
        sendRegistrationToServer(tkn);
    }

    /**
     * Persists token to Spottr back end
     *
     * @param tkn The new token.
     */
    private void sendRegistrationToServer(String tkn) {
        // TODO: Implement this method to send token to your app server.
    }

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        // ...

        // TODO(developer): Handle FCM messages here.
        // Not getting messages here? See why this may be: https://goo.gl/39bRNJ
        Log.d("FIREBASE", "From: " + remoteMessage.getFrom());

        // Check if message contains a data payload.
        if (remoteMessage.getData().size() > 0) {
            Log.d("FIREBASE", "Message data payload: " + remoteMessage.getData());

            String name = remoteMessage.getData().getOrDefault("name", "NAME_PLACEHOLDER");
            Date posted = new Date(new BigInteger(remoteMessage.getData().get("posted")).longValue());
            Uri profile_img_uri = Uri.parse(remoteMessage.getData().get("profile_img_uri"));
            NewsfeedPost newsfeedPost = new NewsfeedPost(name, posted, profile_img_uri);

            EventBus.getDefault().post(new NewsfeedPostEvent(newsfeedPost));
        }

        // Check if message contains a notification payload.
        if (remoteMessage.getNotification() != null) {
            Log.d(TAG, "Message Notification Body: " + remoteMessage.getNotification().getBody());
        }

        // Also if you intend on generating your own notifications as a result of a received FCM
        // message, here is where that should be initiated. See sendNotification method below.
    }
}
