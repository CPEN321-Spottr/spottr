package com.spottr.spottr.constants;

import okhttp3.Request;

import static java.util.Objects.isNull;

public enum AuthorizationType {
    ACCESS_TOKEN,
    CLIENT_CREDENTIALS,
    NONE;


    public static AuthorizationType fromRequest(Request request) {
        AuthorizationType tag = request.tag(AuthorizationType.class);

        // Return the tag attached to the request, or ACCESS_TOKEN if the request is not tagged
        return isNull(tag) ? ACCESS_TOKEN : tag;
    }
}
