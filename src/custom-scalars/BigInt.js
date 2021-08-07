const { GraphQLScalarType, Kind } = require('graphql');
const regex = require('../utils/regex');

const errorMessage = 'Not A Valid Integer.';

const getInteger = (value) => {
    if(!(regex.INT.test(value))) throw Error(errorMessage);
    return value.toString();
}

module.exports = new GraphQLScalarType({
    name: 'BigInt',
    description: 'A custom BigInt scalar (usually for values outside the range of int4).',
    serialize: getInteger,
    parseValue: getInteger,
    parseLiteral: (ast) => getInteger(ast.value),
});