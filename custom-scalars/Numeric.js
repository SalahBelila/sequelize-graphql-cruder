const { GraphQLScalarType, Kind } = require('graphql');
const regex = require('../utils/regex');
const { mustBeAStringMessage } = require('../utils/date-time');

const errorMessage = 'Not A Valid Numeric.';

const getNumeric = (value) => {
    if(!(regex.FLOAT.test(value))) throw Error(errorMessage);
    return value.toString();
}

module.exports = new GraphQLScalarType({
    name: 'Numeric',
    description: 'A custom numeric scalar (usually for values outside the range of float4).',
    serialize: getNumeric,
    parseValue: getNumeric,
    parseLiteral: (ast) => {
        if (!(ast.kind === Kind.STRING)) throw new Error(mustBeAStringMessage);
        return getNumeric(ast.value);
    }
});