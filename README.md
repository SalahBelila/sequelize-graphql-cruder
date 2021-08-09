# Sequelize GraphQL Cruder
Automatically generate GraphQL schema and CRUD operations from Sequelize models

# Quick Start
The first thing to do is generating the schema. the code below shows you how:
```javascript
const sequelizeModels = require('./models');
const { codeGen } = require('sequelize-graphql-cruder');

const OUTPUT_DIR = './schema';
codeGen(sequelizeModels, OUTPUT_DIR);
```
Now that the schema is generated, you can build your server by following the common steps:  
import schema > build executable schema > use the executable schema.  
In this example we use `express-graphql` to serve the GraphQL API endpoint:
```javascript
const { plugCustomScalars } = require('sequelize-graphql-cruder');
const { Sequelize } = require('sequelize');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const sequelizeModels = require('./models');
const sequelizeConfig = require('./sequelize_config');
const { schema, resolvers, customScalars } = require('./schema');

// Build the schema.
const executableSchema = buildSchema(schema);
// Add the generated custom scalars to graphql type mapper.
plugCustomScalars(executableSchema, customScalars);

const sequelize = new Sequelize(sequelizeConfig);

const app = express();
// the models and the sequelize instance must provided to the resolvers through the context;
app.use('/graphql', graphqlHTTP({
    schema: executableSchema,
    context: {
        models: sequelizeModels,
        sequelize
    },
    rootValue: resolvers,
    graphiql: true
}));

app.listen(5000, () => console.log("The Server is Running..."));
```

# The Generated Files
## Schema & Resolvers
The package will generate the schema based on the given models and put them in the given directory. After the generation the schema directory will have serveral files, each of which corresponds to a data model except for two files `custom_scalars.js` and `index.js`.  


Since each file corresponds to a data model it makes sense that the file contains the schema and the CRUD resolvers for that model.  
## Custom Scalars
Depending on the case a file named `custom_scalars.js` may be generated. This file contains a list of the custom scalars used in the generated schema. Databases have data types that are not natively supported by GraphQL. Thus, some Sequelize data types will be represented by the corresponding custom scalars. 

**Note:** if a mapping could not be found for a Sequelize data type, a string scalar will be used.  

the table below shows all provided custom scalars and mapping rules:  

|Custom Scalar  | Sequelize data type|
|:-------------:|:--------:|
|Date           | `DATE` `DATEONLY`|
|Time           | `TIME`|  
|Numeric        | `NUMERIC` `DECIMAL` `DOUBLE` `DOUBLE PRECISION`|
|BigInt         | `BIGINT`|

### Adding Custom Scalars to the Schema
Importing the generated schema yeilds an object with 3 keys `schema`, `resolvers` and `customScalars`. The package provides the function `plugCustomScalars`, calling this function with the built schema and the custom scalars respectively will add the custom scalars to the built schema.
