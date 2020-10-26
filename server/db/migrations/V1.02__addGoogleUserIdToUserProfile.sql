/*
 * Add Google user id to user profile to support authentication
 */
ALTER TABLE user_profile 
    ADD 
        google_user_id CHAR(256),
        CONSTRAINT uk_google_user_id UNIQUE(google_user_id);
