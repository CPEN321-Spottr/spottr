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
        if (connectionData.length == 0) throw 'Invalid connection data!';
        return util.clone(connectionData);
    }
}