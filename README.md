# graphql-hotels-example
GraphQL example. Country/City/Hotel structure.

* To keep it simple this example uses in-memory storage. Initial data stored in [data.json](/storage/data.json) file.
* It runs on node v4 and v5 without babel.
* There is no frontend part, but it would be good to implement client using Relay.
* [GraphiQL](https://github.com/graphql/graphiql) tool enabled and it is a way to play with GraphQL requests.

## How to run
1. Install dependencies:
```npm install```


2. Run the server
```npm start```

3. Go to [http://localhost:3000/](http://localhost:3000/?query=query%20%7B%0A%20%20country(id%3A%20%222%22)%20%7B%0A%20%20%20%20name%0A%20%20%20%20cities%20%7B%0A%20%20%20%20%20%20name%2C%0A%20%20%20%20%20%20hotelsCount%2C%0A%20%20%20%20%20%20population%2C%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A%0A&variables=) to open [GraphiQL](https://github.com/graphql/graphiql). 

## Requests examples

Requests country by `id` with list of cities. [Open at localhost](http://localhost:3000/?query=query%20%7B%0A%20%20country(id%3A%20%221%22)%20%7B%0A%20%20%20%20name%0A%20%20%20%20cities%20%7B%0A%20%20%20%20%20%20name%2C%0A%20%20%20%20%20%20population%2C%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D&variables=)
```graphql
query {
  country(id: "1") {
    name
    cities {
      name,
      population,
    }
  }
}
```

Request country by `id` with list of cities and list of hotels in each. [Open at localhost](http://localhost:3000/?query=query%20%7B%0A%20%20country(id%3A%20%222%22)%20%7B%0A%20%20%20%20name%0A%20%20%20%20cities%20%7B%0A%20%20%20%20%20%20name%2C%0A%20%20%20%20%20%20hotelsCount%2C%0A%20%20%20%20%20%20population%2C%0A%20%20%20%20%20%20hotels%20%7B%0A%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20stars%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D&variables=)
```graphql
query {
  country(id: "2") {
    name
    cities {
      name,
      hotelsCount,
      population,
      hotels {
        name
        stars
      }
    }
  }
}
```