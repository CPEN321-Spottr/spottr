const util = require("./util.js");
var serviceAccount = require("../firebaseKey.json");
var admin = require("firebase-admin");

const connectionData = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE
};

// Note: An exception will occur here if you are trying to run the app locally and have not replaced
// the "const dbConfig" line in server.js as specified in the Google Doc file
module.exports = {
    getDbConfig() {
        return util.clone(connectionData);
    },

    initializeFirebaseApp() {
        const private_firebase_key = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDRs8J41crGSInO\nbtA4vsJop0Fp3r1D3K2HG9CygxC9wyQdFhLzQavbwJC+MxwdqTDQVcU17VTncFUh\nmyu99Ymou8YWZhzEL20sNN4GZw0tySriWYCGcRfx2TUKeIA3qvwS10FvR5I8cdhI\n5e4AKHPQnFTySWhxhnQ6tz2JLMXO3cgwbidu/R28fN3aRkmrmTgrPGugtBpZ340w\nghNC9SDDPI8oSq0uU/zD4KQhNefiKNu/Ffg1Z4WvUxOGxYt9AEzCj9S/iEbfEAJ9\ncmlqED6msGSy+fbwjVq95u/IEIUuWbiwTb/xH/MxL595U71HjFGMg3TLkNCZXXt8\nCbxFuH5PAgMBAAECggEAQOyxSJ0Uf0hlFhs7712sLh+egos6OOEBfsOvXR10GPRq\nYXD8pADQlyRrC+AiE9LWsKHlgXk94LvoN5PlupXjLXEZdsTdoiX23IlvtjbAn0zZ\nsKO6RaWNHs07fUbql5GiIqkvcqcLkRhEOOmrQrRDizJjoHH22rMgmC80Z5yLj6yO\nHrURL8WqYlTSr/N+y79ry8C6qDnnXLPVuEwMjHNFzIi/rkHZwOP8UZvtDu9G6iS2\nHXAcXs+BEb+rhDpgQxU0N7nzIdBTerhtvVvP9iNGtjmfmDyhLEwI6a2+LuqjhxCL\n5oDO3clLdYbl5f/99Xt0JtkLIAT3zwL+9AVhs8XJAQKBgQDxgnVz35CI5b21STFK\nQLtAOFtbmDJLt+QDG2iyp3NmGx9pccjLDJUVjECKt0taloEkEC8qbI+5JIYrPQlc\nTsP0SQgnzwNBYiHdaAjO16E4UWdIPr/872OUDaWugcgJSY784ScHMSis+XN7emLU\nsYKNp30S8U9gKe0471Z1id4RTwKBgQDeSL649lWfjot3qfdbnhaaw/65ySa9B/LX\nU6ZIeLy9pJsVvXPVnojutEG8jmfp7bwKMd+FJQddmZjKYzwhfFPVjTqaBhHNORqT\nQXaVFzWTiIyrddHVM9K2Lt/jE3CeV1ag5aTvVcMwdMHx/ACy680yZQG24d5f7TLH\nbc3RsVGDAQKBgDO5URZkBzyKl7q/1kKk4nW6nDZdvkfhNoBD2oSIwHpZzLx0liCG\nrVdUFm6fGxBns3jZzoAziASLAgE4rUyLwgQLsCd2eqgCMGaO5XQHUowRQyGB7vRp\nANawpY9eVE1I58rZHda4fJGvS0Bi0c/jxKY5/NuVuv5JfHj5KXc688iZAoGBAJyA\nXzfex/4k4HEKDAxHS+b/Y5Lu2wVwWTvdu09/InPrNv2he7LFged+pmHZabQ8G46Z\n+qPFpF/0Sq0EHUv+OxA59S6IY3Q4ZkuTZagmxSPwmgoGVAxmBk8axasc/sec+nMh\n/HQ9z8WIDx0OrndKqhh3ITPf5y9m07+xwZ2H2LoBAoGBANTKeLByf46R0GZJ2hi/\nAstBc4dFpeBOg+uwt+Wx/stTDivJb27okWl+lMHOfbrsv9rxIWSRNrHQWiZx9hTK\nTv6YsSOsoPxz5j3F9QEJLxE2mZFSgoQH90AURcypQonyVWPcMElcNYPJilSsYe5S\nYrbtrVWPDp8frzMUiB3x4VgX\n-----END PRIVATE KEY-----\n";
        //const private_firebase_key = process.env.FIREBASE_PRIVATEKEY;

        admin.initializeApp({
            credential: admin.credential.cert({
                type: "service_account",
                project_id: "spottr-1603580674508",
                private_key_id: process.env.FIREBASE_PRIVATEKEY_ID,
                private_key: private_firebase_key,
                client_email: "firebase-adminsdk-gfhkd@spottr-1603580674508.iam.gserviceaccount.com",
                client_id: "100129969434392598267",
                auth_uri: "https://accounts.google.com/o/oauth2/auth",
                token_uri: "https://oauth2.googleapis.com/token",
                auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
                client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-gfhkd%40spottr-1603580674508.iam.gserviceaccount.com"
              }),
            databaseURL: "sqlserver://eu-az-sql-serv1.database.windows.net:1433;database=dkxp1krn55tloca"
        });
    },

    getGoogleAuthClientID() {
        // backend client ID - USE THIS
        return "347900541097-0g1k5jd34m9189jontkd1o9mpv8b8o1o.apps.googleusercontent.com";
    }
};
