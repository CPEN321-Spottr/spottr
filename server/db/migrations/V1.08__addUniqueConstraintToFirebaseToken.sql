ALTER TABLE firebase_token
    ADD CONSTRAINT token_unique UNIQUE (token);
