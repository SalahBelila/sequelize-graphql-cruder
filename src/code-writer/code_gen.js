const fs = require('fs');
const path = require('path');

const writeCode = (schema, resolvers, customScalars, outputPath) => {
    let filesStrings = {};
    for (const modelKey in schema) {
        filesStrings[modelKey] =[
            `const schema = {\n${generateSchemaObjectString(schema[modelKey]).join(',\n')}\n}`,
            `const resolvers = {\n${resolvers[modelKey].join(',\n')}\n};`,
            'module.exports = {schema, resolvers};'
        ].join('\n');
    }
    if (customScalars.length > 0) {
        filesStrings['custom_scalars'] = `module.exports = \`\n${customScalars.map(scalar => `scalar ${scalar.name}`)}\n\``;
    }
    for (const modelKey in filesStrings) {
        fs.writeFileSync(path.resolve(outputPath, `${modelKey}.js`), filesStrings[modelKey], (err) => console.log(err));
    }
    fs.writeFileSync(path.resolve(outputPath, 'index.js'), generateIndexFileString(), (err) => console.log(err));
    return filesStrings;
}

const generateSchemaObjectString = (obj) => {
    list = [];
    for (key in obj) {
        list.push(`${key}: \`\n${obj[key]}\n\``);
    }
    return list;
}

const generateIndexFileString = () => {
    return `const fs = require("fs");
const customScalars = require('./custom_scalars');
const normalizedPath = __dirname;
const rawTypeDefs = []
fs.readdirSync(normalizedPath).forEach((file) => (file === 'custom_scalars.js') || rawTypeDefs.push(require(\`./\${file}\`)));

let allResolvers = {}
// This will hold resolvers from all files.

let merged = {};
// merged variable will look like {
//     Query: 'Combined Queries text from all files',
//     Mutation: 'Combined Mutations text from all files',
//     ...
// }
let typeDefs = '';
// typeDefs will contain custom types only, since everything else is in merged variable.

rawTypeDefs.forEach(rawType => {
    const {schema, resolvers} = rawType;
    if (!schema || !resolvers) {
        console.warn("One file skipped, Does not hava a schema.");
        return;
    }
    allResolvers = { ...allResolvers, ...resolvers };
    for (const operation in schema){
        preparedString = schema[operation];
        if (operation == 'typeDefs') {
            typeDefs += preparedString;
            continue;
        }
        merged[operation] ? merged[operation] += preparedString.trim() : merged[operation] = preparedString.trim() + '\\n';
    }
});
// Add custom scalars
typeDefs += '\\n' + customScalars + '\\n'

let schema = '';
for (k in merged) {
    schema += '\\n\\t' + 'type ' + k + '{\\n\\t' + merged[k] + '}\\n';
}
schema = '\\n' + typeDefs + '\\n' + schema;
module.exports = { schema, resolvers: allResolvers };
`
}

module.exports = writeCode;
