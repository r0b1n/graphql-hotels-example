
const fs = require('fs');
const path = require('path');

const Schema = require('../graphql/schema');
const graphql = require('graphql').graphql;
const utils = require('graphql/utilities');
const introspectionQuery  = utils.introspectionQuery;
const printSchema  = utils.printSchema;


// Save JSON of full schema introspection for Babel Relay Plugin to use
graphql(Schema, introspectionQuery)
  .then((result) => {
    if (result.errors) {
      console.error(
        'ERROR introspecting schema: ',
        JSON.stringify(result.errors, null, 2)
      );
    } else {
      fs.writeFileSync(
        path.join(__dirname, '../graphql/schema.json'),
        JSON.stringify(result, null, 2)
      );
    }  
  })

// Save user readable type system shorthand of schema
fs.writeFileSync(
  path.join(__dirname, '../graphql/schema.graphql'),
  printSchema(Schema)
);