/**
 * Tests for the message-form helper methods.
 */

var expect = require('chai').expect;
var lodash = require('lodash');
var nestedDescribe = require('nested-describe');

var helpers = require('../../../www/js/helpers/message-form');
var models = require('../../../models');


nestedDescribe('www.helpers.message-form', function() {

  it('should get county options', function() {
    var legislatorsFormElements = [];
    var addressCounty = '';

    var countyData = helpers.getCountyData(legislatorsFormElements, addressCounty);
  })

});
