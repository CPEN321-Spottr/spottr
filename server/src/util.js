module.exports = {
    roundToTwo : function (num) {    
        return +(Math.round(num + "e+2")  + "e-2");
    },

    clone : function (obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    sleep : function (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}