package com.spottr.spottr.models;

import java.util.Date;

/**
 * A message from User A to User B
 */
public class Message {
    private String id;
    private String senderID;
    private String recipientID;
    private String body;
    private Date ts;

    /**
     * Constructor
     */
    public Message(String id, String senderID, String recipientID) {
        this.id = id;
        this.senderID = senderID;
        this.recipientID = recipientID;
    }

    /**
     * Getters
     */
    public String getId() {return this.id;}

    /**
     * Setters
     */
    public void setBody(String body) {this.body = body;}

    public void setTs(Date ts) {this.ts = ts;}

    /**
     * Copy
     */
    public static Message hardCopy(Message mssg) {
        Message ret = new Message(mssg.id, mssg.senderID, mssg.recipientID);
        ret.setBody(mssg.body);
        ret.setTs(mssg.ts);
        return ret;
    }
}
