var sql = require("mssql");
var admin = require("firebase-admin");

module.exports = {
    // Returns 1 if fully successful, 0 otherwise
    async sendFirebaseMessages(tokens, payload, options) {
        var errorTokens = [];

        for (var token of tokens) {
            var tokenData = token["token"];
            await admin.messaging().sendToDevice(tokenData, payload, options)
            .then(function(response) { 
                // Do nothing on success
                })
            .catch(function(error) {
                errorTokens.push(error);
            });
        }

        return errorTokens;
    },

    async getAllFirebaseTokens(dbConfig) {
        return sql
            .connect(dbConfig)
            .then((pool) => {
                return pool
                    .request()
                    .query(
                    "SELECT token FROM firebase_token"
                    );
                })
                .then((result) => {
                    return result.recordset;
                })
                .catch((ex) => {
                    throw ex;
                });
    },

    async createFirebaseTokenEntry(token, dbConfig) {
        return sql
            .connect(dbConfig)
            .then((pool) => {
                return pool
                    .request()
                    .input("token", sql.VarChar(255), token)
                    .query(
                    "INSERT INTO firebase_token(token) OUTPUT Inserted.id VALUES (@token)"
                    );
                })
                .then((result) => {
                    return result.recordset[0];
                })
                .catch((ex) => {
                    throw ex;
                });
    }
};