module.exports = {
    firebaseTokenVerify: function(registrationToken) {
        //this code follows the tutorial here: https://www.techotopia.com/index.php/Sending_Firebase_Cloud_Messages_from_a_Node.js_Server

        var admin = require("firebase-admin");
        var serviceAccount = require("../firebaseKey.json");
        
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: "sqlserver://eu-az-sql-serv1.database.windows.net:1433;database=dkxp1krn55tloca"
        });
        
        var payload = {
          notification: {
            title: "This is a Notification",
            body: "This is the body of the notification message."
          }
        };
        
         var options = {
          priority: "high",
          timeToLive: 60 * 60 *24
        };
        
        admin.messaging().sendToDevice(registrationToken, payload, options)
          .then(function(response) {
            console.log("Successfully sent message:", response);
          })
          .catch(function(error) {
            console.log("Error sending message:", error);
          });
    }
}
