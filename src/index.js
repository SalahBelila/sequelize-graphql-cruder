const cruder = require('../src/cruder');
const { writeCode } = require('../src/code-writer');

const codeGen = (sequelizeModels, outputDir) => {
    const { schema, resolvers, customScalars } = cruder(sequelizeModels);
    files = writeCode(schema, resolvers, customScalars, outputDir);
    return customScalars;
};

const plugCustomScalars = (executableSchema, customScalars) => {
    customScalars.forEach(cs => Object.assign(executableSchema._typeMap[cs.name] = cs.value));
}

module.exports = {
    codeGen,
    plugCustomScalars,
}
