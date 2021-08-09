module.exports = () => {
    const { GraphQLScalarType, Kind } = require('graphql');
    const { validateTime, mustBeAStringMessage } = require('../utils/date-time');

    return new GraphQLScalarType({
        name: 'Time',
        description: 'A custom time scalar.',
        serialize: (value) => {
            validateTime(value);
            return value.toString();
        },
        parseValue: (value) => value.toString(),
        parseLiteral: (ast) => {
            if (!(ast.kind === Kind.STRING)) throw new Error(mustBeAStringMessage);
            validateTime(ast.value);
            return ast.value;
        }
    });
}