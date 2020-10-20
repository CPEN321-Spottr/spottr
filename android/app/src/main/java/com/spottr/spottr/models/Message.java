package com.spottr.models;

import java.util.Date;

/**
 * A message from User A to User B
 */
public class Message {
    String id;
    String senderID;
    String recipientID;
    String body;
    Date ts;
}
