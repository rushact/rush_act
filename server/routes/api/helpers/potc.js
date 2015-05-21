/**
 * Helper to construct a LegislatorFormElements model from a POTC response.
 */

var lodash = require('lodash');

var models = require('../../../../models');


var makePOTCMessage = function(message, campaignTag) {

  var addrComponents = message.canonicalAddress.components;

  var fields = {
    $NAME_PREFIX: message.sender.namePrefix,
    $NAME_FIRST: message.sender.firstName,
    $NAME_LAST: message.sender.lastName,
    $NAME_FULL: message.sender.fullName(),
    $ADDRESS_STREET: message.canonicalAddress.streetAddress(),
    $ADDRESS_STREET_2: null,
    $ADDRESS_CITY: addrComponents.cityName,
    $ADDRESS_STATE_POSTAL_ABBREV: addrComponents.stateAbbreviation,
    $ADDRESS_STATE_FULL: addrComponents.stateName,
    $ADDRESS_COUNTY: null,
    $ADDRESS_ZIP5: addrComponents.zipcode,
    $ADDRESS_ZIP4: addrComponents.plus4Code,
    $ADDRESS_ZIP_PLUS_4: addrComponents.fullZipCode(),
    $PHONE: message.sender.phone,
    $PHONE_PARENTHESES: message.sender.parenPhone,
    $EMAIL: message.sender.email,
    $TOPIC: message.topic,
    $SUBJECT: message.subject,
    $MESSAGE: message.message,
    $CAPTCHA_SOLUTION: null,
    $CAMPAIGN_UUID: message.campaign.uuid,
    // $PERMALINK: null,
    $ORG_URL: message.campaign.orgURL,
    $ORG_NAME: message.campaign.orgName
  };

  var campaignTag = lodash.isEmpty(message.campaign.uuid) ? campaignTag : message.campaign.uuid;
  return {
    'bio_id': message.bioguideId,
    fields: fields,
    'campaign_tag': campaignTag
  }
};


var makeLegislatorFormElements = function(potcResponse, bioguideId) {

  var formElems = lodash.map(potcResponse['required_actions'], function(action) {
    return {
      value: action.value,
      maxLength: action['maxlength'],
      optionsHash: action['options_hash']
    };
  });

  return new models.LegislatorFormElements({
    bioguideId: bioguideId,
    formElements: formElems
  });

};


module.exports.makePOTCMessage = makePOTCMessage;
module.exports.makeLegislatorFormElements = makeLegislatorFormElements;
