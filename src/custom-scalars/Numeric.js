module.exports = () => {
    const { GraphQLScalarType, Kind } = require('graphql');
    const regex = require('../utils/regex');

    const errorMessage = 'Not A Valid Numeric.';

    const getNumeric = (value) => {
        if(!(regex.FLOAT.test(value))) throw Error(errorMessage);
        return value.toString();
    }

    return new GraphQLScalarType({
        name: 'Numeric',
        description: 'A custom numeric scalar (usually for values outside the range of float4).',
        serialize: getNumeric,
        parseValue: getNumeric,
        parseLiteral: (ast) => getNumeric(ast.value),
    });
}