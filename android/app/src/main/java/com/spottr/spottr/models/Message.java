package com.spottr.spottr.models;

/**
 * A message from User A to User B
 */
public class Message {
    private String id;
    private String senderID;
    private String recipientID;
    private String body;
    private int ts;

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

    public String getSenderID() {return this.senderID;}

    public String getRecipientID() {return this.recipientID;}

    public String getBody() {return this.body;}

    public int getTs() {return this.ts;}

    /**
     * Setters
     */
    public void setBody(String body) {this.body = body;}

    public void setTs(int ts) {this.ts = ts;}

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
