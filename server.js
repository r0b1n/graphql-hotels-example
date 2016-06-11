var express = require('express');
var graphqlHTTP = require('express-graphql');


var schema = require('./graphql/schema');


var app = express();

// GraphQL entry point
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));

app.use(express.static('.'));

app.listen(3000, function () {
  console.log("\n* * * * * * * * * * * * * * * * * *");
  console.log("* GraphQL example app listening on port 3000! Usually at http://localhost:3000/");
  console.log("* * * * * * * * * * * * * * * * * *\n");
});
