var _ = require('lodash');

// Requiring initial data from json.
var data = require('./data.json');

// calculating hash objects here and linking child objects with parent
// We will have in memory full cross-linked tree of countries <--> cities <--> hotels.

var countriesHash = data.countries;

var citiesHash = _.flatMap(countriesHash, function (country) {
  return country.cities.map(city => {
    city.country = country; // linking city with parent country.
    return city;
  });
});

var hotelsHash = _.flatMap(citiesHash, function (city) {
  return city.hotels.map(hotel => {
    hotel.city = city; // linking hotel with parent city.
    return hotel;
  });
});


module.exports = {

  /**
   * Returns Country by params
   * @param {Object} values - params for search {field: value}
   * @return {Object}
   */
  getCountry: function (values) {
    return _.find(countriesHash, values);
  },

  /**
   * Returns City by params hash {field: value}
   * @param {Object} values - params for search {field: value}
   * @return {Object}
   */
  getCity: function (values) {
    return _.find(citiesHash, values);
  },

  /**
   * Returns Hotel by params hash {field: value}
   * @param {Object} values - params for search {field: value}
   * @return {Object}
   */
  getHotel: function (values) {
    return _.find(hotelsHash, values);
  },
};