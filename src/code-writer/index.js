const generateSchemaString = require('./schema_gen');
const generateResolversString = require('./resolvers_gen');
const writeCode = require('./code_gen');
module.exports = {
    generateSchemaString,
    generateResolversString,
    writeCode,
};
