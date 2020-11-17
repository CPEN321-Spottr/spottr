const util = require("./util.js");
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
        admin.initializeApp({
            credential: admin.credential.cert({
                type: "service_account",
                project_id: "spottr-1603580674508",
                private_key_id: process.env.FIREBASE_PRIVATEKEY_ID,
                private_key: process.env.FIREBASE_PRIVATEKEY,
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
