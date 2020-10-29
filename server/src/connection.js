const util = require('./util.js');

const connectionData = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE
};

// Note: An exception will occur here if you are trying to run the app locally and have not replaced
// the "const dbConfig" line in server.js as specified in the Google Doc file
module.exports = {
    getDbConfig : function () {
        if (connectionData[0] === undefined) {
            console.log("RESORTING TO DEFAULT DB CONNECTION...\n");

            return {
                user: 'u0tri2ukfid8bnj',
                password: 'Udh!v6payG2cTwuVAXvta%0&y',
                server: 'eu-az-sql-serv1.database.windows.net', 
                database: 'dkxp1krn55tloca'
              };
        };
        return util.clone(connectionData);
    },

    initializeFirebaseApp : function (admin) {
        var serviceAccount = require("../firebaseKey.json");
        var admin = require("firebase-admin");

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "sqlserver://eu-az-sql-serv1.database.windows.net:1433;database=dkxp1krn55tloca"
        });
    },

    getGoogleAuthClientID : function () {
        // backend client ID - USE THIS
        return '347900541097-0g1k5jd34m9189jontkd1o9mpv8b8o1o.apps.googleusercontent.com';
    }
}