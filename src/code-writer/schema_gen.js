const { typeString, operationString, camelCase } = require('./strings_generators');

const generateSchema = (types) => {
    schema = {};
    for (const typeKey in types) {
        const type = types[typeKey];
        const typeDef = typeString(type, typeKey);
        const inputDef = typeString(type, typeKey, 'input');
        const operations = ['r', 'c', 'u', 'd'].map(operType => operationString(type, typeKey, operType, false));
        schema[typeKey] = {
            typeDefs: [typeDef, inputDef],
            Query: [operations.shift()],
            Mutation: operations,
        }
    }
    return schema;
}

module.exports = generateSchema;
