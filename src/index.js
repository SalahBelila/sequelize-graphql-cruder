const cruder = require('../src/cruder');
const { writeCode } = require('../src/code-writer');
const customScalarsDefs = require('./custom-scalars');

const codeGen = (sequelizeModels, outputDir) => {
    const { schema, resolvers, customScalars } = cruder(sequelizeModels);
    files = writeCode(schema, resolvers, customScalars, outputDir);
};

const plugCustomScalars = (executableSchema, customScalars) => {
    customScalars.forEach(cs => Object.assign(executableSchema._typeMap[cs] = customScalarsDefs[`${cs}Scalar`]()));
}

module.exports = {
    codeGen,
    plugCustomScalars,
}
