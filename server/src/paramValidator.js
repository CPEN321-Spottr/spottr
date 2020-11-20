module.exports = {
    // Checks if all parameters are present and can be casted to integers successfully.
    // Throws exceptions that should be caught by caller.
    isPresentAndInteger(paramsToCheck, presentParams, nameOfLocation="body") {
        if (typeof presentParams === "undefined") {
            throw ("Expected the parameters: [" + paramsToCheck.toString() + "] but found 0 parameters");
        }

        for (let i in paramsToCheck) {
            let param = paramsToCheck[i];

            if (!(param in presentParams)) throw ("'" + param + "' is expected in the " + nameOfLocation + " but was not found!");
            if (isNaN(parseInt(presentParams[param]))) throw ("Expected '" + param + "' to be an int, but was not!");
        }
    }
}