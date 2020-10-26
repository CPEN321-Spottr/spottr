package com.spottr.spottr.services;

public enum RequestCodes {
    RC_SIGN_IN(1);

    private final int value;
    private RequestCodes(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
