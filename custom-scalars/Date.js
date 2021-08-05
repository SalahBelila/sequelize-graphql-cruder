const { GraphQLScalarType, Kind } = require('graphql');
const { toISOString, invalidDateMessage, mustBeAStringMessage } = require('../utils/date-time');

module.exports = new GraphQLScalarType({
    name: 'Date',
    description: 'A custom Date type, uses ISO format',
    serialize: toISOString,
    parseValue: toISOString,
    parseLiteral: (ast) => {
        if (!(ast.kind == Kind.STRING)) throw new Error(mustBeAStringMessage);
        return toISOString(ast.value);
    }
});