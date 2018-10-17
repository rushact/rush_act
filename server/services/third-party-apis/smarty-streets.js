/**
 * Helpers for interacting with the Smarty Streets API.
 */

var path = require('path');
var url = require('url');

var makeRequest = require('./third-party-api').makeRequest;


var makeSmartyStreetsUrl = function(baseURL, pathname, params, ssCreds) {
  var ssURL = url.parse(baseURL);
  ssURL.pathname = pathname;

  params['auth-id'] = process.env.SMARTY_STREETS_ID || ssCreds.ID;
  params['auth-token'] = process.env.SMARTY_STREETS_TOKEN || ssCreds.TOKEN;
  ssURL.query = params;

  return url.format(ssURL);
};


var verifyAddress = function(params, config, cb) {
  const configDetails = process.env.SMARTY_STREETS_ID ?
    {
      ID: process.env.SMARTY_STREETS_ID,
      TOKEN: process.env.SMARTY_STREETS_TOKEN
    } : config.get('CREDENTIALS.SMARTY_STREETS');
  var ssURL = makeSmartyStreetsUrl(
    config.get('API.SMARTY_STREETS.ADDRESS_URL'),
    'street-address',
    params,
    configDetails
  );

  var requestParams = {
    method: 'GET',
    url: ssURL,
    json: true
  };
  makeRequest(requestParams, cb);
};


module.exports.makeSmartyStreetsUrl = makeSmartyStreetsUrl;
module.exports.verifyAddress = verifyAddress;
