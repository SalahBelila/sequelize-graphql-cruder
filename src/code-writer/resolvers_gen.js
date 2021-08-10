const { camelCase, block, CRUD } = require('./strings_generators');

const resolversFunctions = {
    c: (typeName) => [
        `const transaction = await sequelize.transaction();`,
        `try ${block([
        `const result = await models.${typeName}.create(args, {transaction});`,
        `await transaction.commit();`,
        `return result;`
    ], '{', '}', '\n', false, 3)} catch { await transaction.rollback(); }`],
    r: (typeName) => [
        `const transaction = await sequelize.transaction();`,
        `try ${block([
        `const result = await models.${typeName}.findAll({ where: args, transaction });`,
        `await transaction.commit();`,
        `return result;`
    ], '{', '}', '\n', false, 3)} catch { await transaction.rollback(); }`],
    u: (typeName) => [
        `const transaction = await sequelize.transaction();`,
        `try ${block([
        `const result = await models.${typeName}.update`, block([
            'args.updateInput', '{ where: args.searchInput, transaction }'
        ], '(', ');', ',\n', false, 4),
        `await transaction.commit();`,
        `return result[0];`
    ], '{', '}', '\n', false, 3)} catch { await transaction.rollback(); }`],
    d: (typeName) => [
        `const transaction = await sequelize.transaction();`,
        `try ${block([
        `const result = await models.${typeName}.destroy({where: args, transaction});`,
        `await transaction.commit();`,
        `return result;`
    ], '{', '}', '\n', false, 3)} catch { await transaction.rollback(); }`]
};

const generateResolvers = (types) => {
    let resolvers = {};
    for (const typeKey in types) {
        resolvers[typeKey] = ['c', 'r', 'u', 'd'].map( operType => {
            const operName = camelCase(typeKey, CRUD[operType]);
            let resolver = `${operName}: async (args, { models, sequelize }) => `;
            resolver += `${block(resolversFunctions[operType](typeKey), '{', '}', '\n', false, 2)}`;
            return resolver;
        });
    }
    return resolvers;
}

module.exports = generateResolvers;
