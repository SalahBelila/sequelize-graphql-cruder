const generateResolvers = (types) => {
    let resolvers = {};
    for (const typeKey in types) {
        const c = addFunctionDeclaration(generateCResolver(typeKey), typeKey, 'c');
        const r = addFunctionDeclaration(generateRResolver(typeKey), typeKey, 'r');
        const u = addFunctionDeclaration(generateUResolver(typeKey), typeKey, 'u');
        const d = addFunctionDeclaration(generateDResolver(typeKey), typeKey, 'd');
        resolvers[typeKey] = [c, r, u, d];
    }
    return resolvers;
}

const CRUD = { c: 'Add', r: 'Get', u: 'Update', d: 'Delete' }

const addFunctionDeclaration = (functionBody, typeName, operationType) => {
    typeName = typeName.charAt(0).toLowerCase() + typeName.slice(1);
    return `${typeName}${CRUD[operationType]}: async (args, { models }) => {\n${functionBody}\n}`
}

const generateCResolver = (typeName) => {
    return `return await models.${typeName}.create(args);`;
}

const generateRResolver = (typeName) => {
    return `return await models.${typeName}.findAll(args.searchInput);`;
}

const generateUResolver = (typeName) => {
    let resolver = ``;
    resolver += `return await models.${typeName}.update({\n`;
    resolver += `where: args.searchInput,\n`
    resolver += `values: args.updateInput`
    resolver += '\n});';
    return resolver;
}

const generateDResolver = (typeName) => {
    return `return await models.${typeName}.destroy({where: args.searchInput});`
}

module.exports = generateResolvers;
