const generateSchema = (types) => {
    let schema = {};
    for (const typeKey in types) {
        const type = types[typeKey];
        let typeDefs = `type ${typeKey}{\n${getFieldsDefs(type).join('\n')}\n}\n`;
        typeDefs += `input ${typeKey}Input{\n${getInputDefs(type).join('\n')}\n}`;
        const query = `${getCRUDQueries(type, typeKey).join('\n')}`;
        const mutation = `${getCRUDMutations(type, typeKey).join('\n')}`;
        schema[typeKey] = {
            typeDefs,
            Query: query,
            Mutation: mutation,
        }
    }
    return schema;
}

const getFieldsDefs = (type) => {
    let types = [];
    for (const fieldKey in type) {
        if (fieldKey === "hasMany" || fieldKey === "foreignKeys") continue;
        const field = type[fieldKey];
        const foreignKey = type.foreignKeys[fieldKey];
        if (foreignKey) {
            types.push(`${foreignKey.fieldName}: ${field.required ? `${foreignKey.references}!`: foreignKey.references}`);
        } else {
            types.push(`${fieldKey}: ${field.required ? `${field.type}!` : field.type}`);
        }
    }
    for (const fieldKey in type.hasMany) {
        const field = type.hasMany[fieldKey];
        types.push(`${fieldKey}: [${field.references}!]`)
    }
    return types;
}

const getInputDefs = (type, strict=false) => {
    let types = [];
    for (const fieldKey in type) {
        if (fieldKey === "hasMany" || fieldKey === "foreignKeys") continue;
        const field = type[fieldKey];
        if (strict) {
            types.push(`${fieldKey}: ${field.required ? `${field.type}!` : field.type}`);
        } else {
            types.push(`${fieldKey}: ${field.type}`);
        }
    }
    return types;
}

const getCRUDQueries = (type, typeName) => {
    let inputs = [];
    for (const fieldKey in type) {
        const field = type[fieldKey];
        inputs.push(`${fieldKey}: ${field.type}`);
    }
    const name = typeName.toLowerCase();
    return [`${name}Get(searchInput: ${typeName}Input): [${typeName}]`];
}

const getCRUDMutations = (type, typeName) => {
    mutations = [];
    let inputs = getInputDefs(type);
    const name = typeName.toLowerCase();
    mutations.push(`${name}Add(${inputs.join(', ')}): ${typeName}`);
    mutations.push(`${name}Delete(searchInput: ${typeName}Input): ${typeName}`);
    mutations.push(`${name}Update(searchInput: ${typeName}Input, updateInput: ${typeName}Input): ${typeName}`);
    return mutations;
}

module.exports = generateSchema;

