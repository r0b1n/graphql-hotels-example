var types = require('graphql/type');

var relay = require('graphql-relay');

//import {
//  connectionArgs,
//  connectionDefinitions,
//  connectionFromArray,
//  fromGlobalId,
//  globalIdField,
//  mutationWithClientMutationId,
//  nodeDefinitions,
//} from 'graphql-relay';

var storage = require('../storage');


// === GraphQL Types ===
var node = relay.nodeDefinitions(
  (globalId) => {
    var global = relay.fromGlobalId(globalId);
    if (global.type === 'Faction') {
      return getFaction(global.id);
    } else if (global.type === 'Ship') {
      return getShip(global.id);
    } else {
      return null;
    }
  },
  (obj) => {
    return obj.ships ? factionType : shipType;
  }
);

// Declaring types here in one file because they have circular dependencies.

var imageType = new types.GraphQLObjectType({
  name: "Image",
  description: "Image of city",
  
  fields: function () {
    return {
      id: relay.globalIdField('Image'),
      url: {
        type: types.GraphQLString,
        description: "Image url. Relative to server address.",
      },
    }
  },
  interfaces: [node.nodeInterface],
})

// <editor-fold desc="countryType" defaultState="collapsed">
var countryType = new types.GraphQLObjectType({
  name: 'Country',
  description: 'Country object',

  // all fields available on GraphQL should be declared here
  // descriptions are needed for introspection.
  fields: function () {
    return {
      id: relay.globalIdField('Country'),
      _id: {
        type: types.GraphQLString,
        description: "Country id",
        resolve: (data) => {
          return data.id;
        }
      },
      name: {
        type: types.GraphQLString,
        description: 'The name of the country.',
      },
      slug: {
        type: types.GraphQLString,
        description: "Country slug",
      },
      coverImageUrl: {
        type: types.GraphQLString,
        description: "Cover image for country",
      },
      cities: {
        type: new types.GraphQLList(cityType),
        description: 'The list of the cities in the country.',
        resolve: (country, params, source, fieldASTs) => {
          return country.cities;
        },
      },
      citiesList: {
        type: cityConnection.connectionType,
        description: 'The cities on the country under list.',
        args: relay.connectionArgs,
        resolve: (country, args) => {
          console.log(country);
          console.log(args);
          return relay.connectionFromArray(
            country.cities.map((id) => storage.getCity(id)),
            args
          );
        }
      }
    };
  },
  interfaces: [node.nodeInterface],
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
      id: relay.globalIdField('City'),
      _id: {
        type: types.GraphQLString,
        description: "City id",
        resolve: (data) => {
          return data.id;
        }
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
      images: {
        type: new types.GraphQLList(imageType),
        description: "The list of Images of the City",
        resolve: function (city, params, source, fieldASTs) {
          return city.images.map((image, c) => {return {url: image, id: '' + city.id + c}})
        },
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
  interfaces: [node.nodeInterface],
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
      id: relay.globalIdField('Hotel'),
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
  interfaces: [node.nodeInterface],
});
// </editor-fold>


var cityConnection = relay.connectionDefinitions({name: 'City', nodeType: cityType});
console.log(cityConnection);

// === End GraphQL Types ===


// Declaring the heart of our GraphQL, the Schema.
var userType =  new types.GraphQLObjectType({
  name: 'ViewerQueryType',
  description: "Root of all queries",

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

    countries: {
      type: new types.GraphQLList(countryType),
      description: "The list of Countries",
      resolve: function (root, params, source, fieldASTs) {
        // TODO: add sort/filter
        return storage.getCountries();
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
});

module.exports = new types.GraphQLSchema({
  query: new types.GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    // Add your own root fields here
    viewer: {
      type: userType,
      resolve: () => {return {}},
    },
  }),
}),
});