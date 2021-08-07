const { introspectionFromSchema } = require("graphql");
const regex = require("./regex");

const invalidDateMessage = 'The provided value must be date-like. A date-like value is any value accepted by the Date constructor';
const toISOString = (value) => {
    try {
        return (new Date(value)).toISOString();
    } catch {
        throw new Error(invalidDateMessage);
    }
}
const invalidTimeFormatMessage = 'Invalid Time Format. The provided value must be in the format: HH:MM:SS.fff or HH:MM:SS';
const invalidTimeValueMessage = 'Invalid Time Value';
const mustBeAStringMessage = 'Invalid Time Value. Must be a string.';
const validateTime = (value) => {
    try {
        value = value.substring(0, 12); //trim the string to be of exact length;
    } catch {
        throw Error(mustBeAStringMessage);
    }

    let [h, m, s] = value.split(':');
    
    if (!regex.INT2DIGITS.test(h)) throw new Error(invalidTimeFormatMessage);
    if (!regex.INT2DIGITS.test(m)) throw new Error(invalidTimeFormatMessage);
    if (!regex.UNSIGNED_FLOAT.test(s)) throw new Error(invalidTimeFormatMessage);

    if (h > 23 || h < 00) throw new Error(invalidTimeValueMessage);
    if (m > 59 || m < 00) throw new Error(invalidTimeValueMessage);
    if (s > 59 || s < 00) throw new Error(invalidTimeValueMessage);

    return true;
}

module.exports = {
    toISOString,
    invalidDateMessage,
    validateTime,
    invalidTimeFormatMessage,
    invalidTimeValueMessage,
}