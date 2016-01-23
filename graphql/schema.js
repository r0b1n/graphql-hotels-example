var types = require('graphql/type');

var storage = require('../storage');


// === GraphQL Types ===
// Declaring types here in one file because they have circular dependencies.

// <editor-fold desc="countryType" defaultState="collapsed">
var countryType = new types.GraphQLObjectType({
  name: 'Country',
  description: 'Country object',

  // all fields available on GraphQL should be declared here
  // descriptions are needed for introspection.
  fields: function () {
    return {
      id: {
        type: new types.GraphQLNonNull(types.GraphQLString),
        description: 'The id of the country.',
      },
      name: {
        type: types.GraphQLString,
        description: 'The name of the country.',
      },
      slug: {
        type: types.GraphQLString,
        description: "Country slug",
      },
      cities: {
        type: new types.GraphQLList(cityType),
        description: 'The list of the cities in the country.',
        resolve: (country, params, source, fieldASTs) => {
          return country.cities;
        },
      }
    };
  },
});
// </editor-fold>
// <editor-fold desc="cityType" defaultState="collapsed">
var cityType = new types.GraphQLObjectType({
  name: 'City',
  description: 'City object',

  // all fields available on GraphQL should be declared here
  // descriptions are needed for introspection.
  fields: function () {
    return {
      id: {
        type: new types.GraphQLNonNull(types.GraphQLString),
        description: 'City ID',
      },
      name: {
        type: types.GraphQLString,
        description: 'City name.',
      },
      population: {
        type: types.GraphQLInt,
        description: "Population if the city",
      },
      hotelsCount: {
        type: types.GraphQLInt,
        resolve: function (city, params, source, fieldASTs) {
          return city.hotels.length;
        }
      },
      country: {
        type: countryType,
        description: "Country where the City is located",
        resolve: function (city, params, source, fieldASTs) {
          return city.country;
        }
      },
      hotels: {
        type: new types.GraphQLList(hotelType),
        description: "The list of hotels located in the City",
        resolve: function (city, params, source, fieldASTs) {
          return city.hotels;
        }
      }
    };
  },
});
// </editor-fold>
// <editor-fold desc="hotelType" defaultState="collapsed">
var hotelType = new types.GraphQLObjectType({
  name: 'Hotel',
  description: 'Hotel object',

  // all fields available on GraphQL should be declared here
  // descriptions are needed for introspection.
  fields: function () {
    return {
      id: {
        type: new types.GraphQLNonNull(types.GraphQLString),
        description: 'City ID',
      },
      name: {
        type: types.GraphQLString,
        description: 'City name.',
      },
      address: {
        type: types.GraphQLString,
        description: 'City address.',
      },
      stars: {
        type: types.GraphQLInt,
        description: "Population if the city",
      },
      city: {
        type: cityType,
        description: "City where the Hotel is located",
        resolve: function (city, params, source, fieldASTs) {
          return city.city;
        }
      }
    };
  },
});
// </editor-fold>

// === End GraphQL Types ===


// Declaring the heart of our GraphQL, the Schema.
module.exports = new types.GraphQLSchema({
  query: new types.GraphQLObjectType({
    name: 'RootQueryType',

    // all fields will be available from root query
    // Like: `query { country (id: '10') { name }}`, etc.
    fields: {
      country: {
        type: countryType,
        args: {
          // this is attributes for fetching node, they will should be passed in query.
          // For example *id*: `query { country (id: '10') { name }}`
          id: {
            name: 'id',
            type: new types.GraphQLNonNull(types.GraphQLString) // this attribute declared as is NonNull, so is is required.
          }
        },
        // Important function which returns needed object, object will be converted to graphQL response.
        // NOTE: we may return object with fill fields set, and GraphQL will deal with it and will trim not requested fields.
        resolve: (root, params, source, fieldASTs) => {
          // NOTE: `root` is a parent for current node, but because our node is inside root query `root` is undefined here

          // NOTE: params here is hash with requested args (described above)
          //  example: {id: '10'}

          // simple function returns needed data.
          return storage.getCountry(params);
        }
      },

      city: {
        type: cityType,
        args: {
          id: {
            name: 'id',
            type: new types.GraphQLNonNull(types.GraphQLString)
          }
        },
        resolve: (root, params, source, fieldASTs) => {
          return storage.getCity(params);
        }
      },

      hotel: {
        type: hotelType,
        args: {
          id: {
            name: 'id',
            type: new types.GraphQLNonNull(types.GraphQLString)
          }
        },
        resolve: (root, params, source, fieldASTs) => {
          return storage.getHotel(params);
        }
      },
    }
  })
});