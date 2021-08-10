const fs = require('fs');
const path = require('path');
const { block } = require('./strings_generators');

const writeCode = (schema, resolvers, customScalars, outputPath) => {
    let filesStrings = {};
    for (const modelKey in schema) {
        filesStrings[modelKey] = block([
            `const schema = ${block(generateSchemaObjectString(schema[modelKey]), '{', '}', ',\n\n', false, 1)}`,
            `const resolvers = ${block(resolvers[modelKey], '{', '}', ',\n\n', false, 1)}`,
            'module.exports = { schema, resolvers };'
        ], '', '', '\n', true);
    }
    if (customScalars.length > 0) {
        filesStrings['custom_scalars'] = `module.exports = ${block(customScalars, '[', ']', '\n,', false, 1)}`;
    }
    for (const modelKey in filesStrings) {
        fs.writeFileSync(path.resolve(outputPath, `${modelKey}.js`), filesStrings[modelKey], (err) => console.log(err));
    }
    fs.writeFileSync(path.resolve(outputPath, 'index.js'), generateIndexFileString(), (err) => console.log(err));
    return filesStrings;
}

const generateSchemaObjectString = (obj) => {
    const list = Object.keys(obj).map(key => `${key}: ${block(obj[key], '\`', '\`', '\n', false, 2)}`);
    return list;
}

const generateIndexFileString = () => {
    return `const fs = require('fs');
const path = require('path');
let customScalars = [];

let allResolvers = {};
const merged = {};
let typeDefs = '';
fs.readdirSync(__dirname).forEach(fileName => {
    if (fileName === 'custom_scalars.js' || fileName === 'index.js') return;
    const { schema, resolvers } = require('./' + fileName);
    if (!schema || !resolvers) {
        console.warn('File skipped ' + fileName + '. Missing Schema or Resolvers.');
        return;
    }
    allResolvers = { ...allResolvers, ...resolvers };
    for (const operation in schema){
        preparedString = schema[operation];
        if (operation == 'typeDefs') typeDefs += preparedString + '\\n';
        else if (merged[operation]) merged[operation] += preparedString.trim() + '\\n';
        else merged[operation] = preparedString.trim() + '\\n';
    }
});
// Add custom scalars
if (fs.existsSync(path.resolve(__dirname, './custom_scalars.js'))) {
    customScalars = require('./custom_scalars');
    const customScalarsText = customScalars.map(cs => 'scalar ' + cs).join('\\n');
    typeDefs += '\\n' + customScalarsText + '\\n';
}
// generate the schema string from the merged object.
let schema = '';
for (k in merged) {
    schema += '\\n\\t' + 'type ' + k + '{\\n\\t' + merged[k] + '}\\n';
}
schema = '\\n' + typeDefs + '\\n' + schema;
module.exports = { schema, resolvers: allResolvers, customScalars };
`
}
module.exports = writeCode;
