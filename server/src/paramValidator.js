function validateInObject(expected, allParameters, nameOfLocation) {
    if (!(expected in allParameters)) {
        throw ("'" + expected + "' is expected in the " + nameOfLocation + " but was not found!");
    }
}

function validateInt(value, param) {
    if (isNaN(parseInt(value, 10))) {
        throw ("Expected '" + param + "' to be an int, but was not!");
    }
}

function validateNonInt(value, param) {
    if (value === "") {
        throw ("'" + param + "' was present, but had no value. A value must be provided");
    }
}

function confirmNotEmpty(paramsToCheck, presentParams, nameOfLocation) {
    if (Object.keys(presentParams).length === 0) {
        throw ("Expected the parameters: [" + paramsToCheck.toString() + "] but found 0 parameters in the " + nameOfLocation);
    }
}

function confirmPresent(paramsToCheck, presentParams, nameOfLocation, checkInt) {
    for (let param of paramsToCheck) {
        validateInObject(param, presentParams, nameOfLocation);

        let value = presentParams[`${param}`];
        if (checkInt) {
            validateInt(value, param);
        }
        else {
            validateNonInt(value, param);
        }
    }
}

module.exports = {
    // Checks if all parameters are present. If integer check is enabled, then it will check if each value
    // can be casted to an integer successfully. Throws exceptions on any validation issues which should be 
    // caught by caller.
    checkIsPresent(paramsToCheck, presentParams, nameOfLocation="body", checkInt=false) {
        confirmNotEmpty(paramsToCheck, presentParams, nameOfLocation);
        confirmPresent(paramsToCheck, presentParams, nameOfLocation, checkInt);
    }
};
