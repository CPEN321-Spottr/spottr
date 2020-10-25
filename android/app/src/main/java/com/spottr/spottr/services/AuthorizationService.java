package com.spottr.spottr.services;

import okhttp3.Request;
import com.spottr.spottr.constants.AuthorizationType;

public class AuthorizationService {

    Request signWithToken(Request request, String token) {

        return request
                .newBuilder()
                .header("Authorization", String.format("Bearer %s", token))
                .build();
    }

    Request signByAuthorizationType(Request request) {

        /* TODO: Implement logic for various authorization types */
        switch (AuthorizationType.fromRequest(request)) {
            case ACCESS_TOKEN:
            case CLIENT_CREDENTIALS:
            case NONE:
                break;
        };

        return request;
    }
}
