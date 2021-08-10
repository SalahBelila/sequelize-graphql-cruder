const { typeMapper } = require('./data_types_map');
const { generateSchemaString, generateResolversString } = require('./code-writer');

const cruder = (models) => {
    let customScalars = [];
    const types = {};
    for (const modelName in models) {
        const model = models[modelName];
        const {attributes, requiredCustomScalars} = retrieveAttributes(model);
        types[modelName] = attributes;
        customScalars = customScalars.concat(requiredCustomScalars);
    }
    const schema = generateSchemaString(types);
    const resolvers = generateResolversString(types);
    return {schema, resolvers, customScalars: [...new Set(customScalars)]};
};

const retrieveAttributes = (model) => {
    const modelattributes = model.rawAttributes;
    let attributes = {};
    const requiredCustomScalars = [];
    for (const attrKey in modelattributes) {
        const attr = modelattributes[attrKey];
        const type = typeMapper(attr.type.key);
        const required = !attr.allowNull;
        if (type.isCustom) requiredCustomScalars.push(`'${type.type}'`);
        attributes[attrKey] = {type: type.type, required };
    }
    const {hasMany, foreignKeys} = getAssociations(model);
    attributes = { ...attributes, hasMany, foreignKeys };
    return {attributes, requiredCustomScalars, hasMany, foreignKeys};
}

const getAssociations = (model) => {
    let foreignKeys = {};
    let hasMany = {};
    for (let associationKey in model.associations) {
        const association = model.associations[associationKey];
        const references = association.target;
        const associationType = association.associationType;
        if (associationType === 'HasMany') {
            hasMany[associationKey] = { references: references.name };
        } else if (associationType === 'BelongsTo') {
            const identifier = association.identifier;
            foreignKeys[identifier] = { references: references.name, fieldName: associationKey };
        }
    }
    return { hasMany, foreignKeys };
}

module.exports = cruder;
