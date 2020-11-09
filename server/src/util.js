module.exports = {
    roundToTwo(num) {
        return +(Math.round(num + "e+2")  + "e-2");
    },

    roundToThree(num) {
        return +(Math.round(num + "e+3")  + "e-3");
    },

    clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};
