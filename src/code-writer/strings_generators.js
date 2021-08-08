const CRUD = {c: 'Add', r: 'Get', u: 'Update', d: 'Delete'};

const typeString = (abstract, name, type='type', strict=false) => {
    const lines = fieldsDefsList(abstract, strict, type);
    name = type === 'input' ? `${name}Input` : name;
    const string = `${type} ${name} ${block(lines, '{', '}', '\n', false, 3)}`;
    return string;
}

const fieldsDefsList = (abstract, strict, type) => {
    const lines = Object.keys(abstract)
    .filter(key => !['foreignKeys', 'hasMany'].includes(key))
    .map(key => {
        const field = abstract[key];
        const foreignKey = abstract.foreignKeys[key];
        if (foreignKey && type !== 'input'){
            return `${foreignKey.fieldName}: ${field.required ? `${foreignKey.references}!`: foreignKey.references}`;
        } else{
            return `${key}: ${field.required && strict ? `${field.type}!` : field.type}`;
        }
    });
    const associates = type === 'input' ? [] : associationsFieldsDefsList(abstract);
    return [...lines, ...associates];
}

const associationsFieldsDefsList = ({ hasMany }) => {
    return Object.keys(hasMany || {}).map(key => `${key}: [${hasMany[key].references}!]`);
}

const operationString = (abstract, name, operType, strict) => {
    let argsList = '';
    const operName = camelCase(name, CRUD[operType]);
    if (operType === 'u') argsList = [`searchInput: ${name}Input`, `updateInput: ${name}Input`];
    else argsList = fieldsDefsList(abstract, strict, 'input')
    const returnType = operType === 'r' ? `[${name}!]` : (operType === 'd' ? 'Int' : name);
    return `${operName}${block(argsList, '(', ')', ', ', true)}: ${returnType}`;
}

const block = (list, blockStarter='{', blockEnder='}', delimiter='\n', inlineContent=false, tabLevel=0) => {
    if (!inlineContent) {
        blockStarter += '\n' + tabs(tabLevel);
        blockEnder = '\n' + tabs(tabLevel - 1) + blockEnder;
        delimiter += tabs(tabLevel);
    }
    return blockStarter + list.join(delimiter) + blockEnder;
}

const camelCase = (...strings) => {
    let firstString = strings.shift();
    firstString = firstString.charAt(0).toLowerCase() + firstString.slice(1);
    strings = strings.map(string => string.charAt(0).toUpperCase() + string.slice(1));
    return firstString + strings.join('');
}

const tabs = (numTabs) => {
    let tabs = '';
    for (let i = 0; i < numTabs; i++) tabs += '\t';
    return tabs;
}

module.exports = {
    block,
    operationString,
    typeString,
    camelCase,
    CRUD,
}
