/**
 *
 */

var isEmpty = require('lodash.isEmpty');
var map = require('lodash.map');
var forEach = require('lodash.forEach');
var findWhere = require('lodash.findWhere')

var MessageFormController = function($scope, $location, $timeout, dioLegislatorData, dioApi) {

  $scope.loadingDelay = true;
  $scope.submitted = false;
  $scope.joinEmailList = false;
  
  $timeout(function(){
      $scope.loadingDelay = false;
    },
    350);

	//TODO fill out list of topics
	$scope.topics = [
		'Agriculture',
		'Technology'
	];

  $scope.formData = {
    '$NAME_FIRST': {
      'label': 'First Name',
      'maxlength': null,
      'value': '',
      'options_hash': null
    },
    '$NAME_LAST': {
      'label': 'Last Name',
      'maxlength': null,
      'value': '',
      'options_hash': null
    },
    '$SUBJECT': {
      'label': 'Subject',
      'maxlength': null,
      'value': '',
      'options_hash': null
    },
    '$MESSAGE': {
      'label': 'Message',
      'maxlength': null,
      'value': '',
      'options_hash': null
    },
    '$PREFIX': {
      'label': 'Prefix',
      'maxlength': null,
      'value': '',
      'options_hash': null
    },
    '$ADDRESS_STREET': {
      'label': 'Address',
      'maxlength': null,
      'value': '',
      'options_hash': null
    },
    '$ADDRESS_ZIP5': {
      'lable': 'Zip5',
      'maxlength': 5,
      'value': '',
      'options_hash': null
    }
  };
  $scope.formSubmissions = [];

  var attemptToFetchLegislatorData = function(params) {
    if (!angular.isUndefined(params.lat) && !angular.isUndefined(params.lng)) {
      var cb = function(legislators) {
        dioLegislatorData.setLegislators(legislators);
        $scope.setLegislators();
      };
      dioApi.findLegislatorsByLatLng(params.lat, params.lng, cb);
    } else {
      // send back
    }
  };

  var attemptToFetchLegislatorForm = function(selectedBioguideIds) {
    var selectedBioguideIds = map(dioLegislatorData.getSelectedLegislators(), function(legislator) {
      return legislator.bioguideId;
    });

    if (!isEmpty(selectedBioguideIds)){
      var cb = function(legislatorsFormElements) {
        dioLegislatorData.setLegislatorsFormElements(legislatorsFormElements);
        $scope.setLegislatorForm();
      };

      dioApi.legislatorFormElementsByBioguideIds(selectedBioguideIds, cb);
    } else {
      // TEMPORARY STUB FOR EASIER CODING
      selectedBioguideIds = ["P000197", "B000711", "F000062"]

      var cb = function(legislatorsFormElements) {
        dioLegislatorData.setLegislatorsFormElements(legislatorsFormElements);
        $scope.setLegislatorForm();
      };

      dioApi.legislatorFormElementsByBioguideIds(selectedBioguideIds, cb);

      // END TEMPORARY STUB

      // go back code
    }
  };

  var checkForCaptcha = function(){
    var hasCaptcha = false;
    forEach($scope.legislatorsFormElements, function(legislator){
      forEach(legislator.formElements, function(element){
        if (element.value === "$CAPTCHA_SOLUTION") {
          hasCaptcha = true;
        };
      });
    });

    return hasCaptcha;
  };

  $scope.setLegislators = function() {
    $scope.legislators = dioLegislatorData.getSelectedLegislators();
    $scope.selectedLegislators = dioLegislatorData.selectedLegislators;
    console.log('legislators:', $scope.legislators);
    console.log('selected legislators:', $scope.selectedLegislators);
  };

  $scope.setLegislatorForm = function () {
    $scope.legislatorsFormElements = dioLegislatorData.getLegislatorsFormElements();
    console.log('form elements:', $scope.legislatorsFormElements);
    $scope.createFormFields();
  };

  $scope.createFormFields = function (){
    //grab different topic options
    var topicOptions = [];

    forEach($scope.legislatorsFormElements, function(legislatorForm){
      var newOptions = findWhere(legislatorForm.formElements, {'value': '$TOPIC'});

      if (!angular.isUndefined(newOptions)){
        topicOptions.push({
          bio_id: legislatorForm.bioguideId,
          options: newOptions.optionsHash,
          selected: ''
        });
      } 
      
    });

    console.log('topic options:', topicOptions)
  };

  var prepareFormSubmission = function(){
    $scope.formSubmissions = [];
    $scope.formSubmissions = map($scope.legislators, function(legislator){
      var legislatorSubmission = {
        "bio_id": legislator.bioguideId,
        "fields": {}
      };

      legislatorSubmission.fields.$NAME_PREFIX = $scope.formData.prefix;
      legislatorSubmission.fields.$NAME_FIRST = $scope.formData.firstName;
      legislatorSubmission.fields.$NAME_LAST = $scope.formData.lastName;
      legislatorSubmission.fields.$NAME_FULL = $scope.formData.firstName + " " + $scope.fromData.lastName;
      legislatorSubmission.fields.$ADDRESS_STREET = ''; //TODO

      /*
        $ADDRESS_CITY
        $ADDRESS_STATE_POSTAL_ABBREV
        $ADDRESS_STATE_FULL
        $ADDRESS_COUNTY
        $ADDRESS_ZIP5
        $ADDRESS_ZIP4
        $ADDRESS_ZIP_PLUS_4
        $PHONE
        $PHONE_PARENTHESES
        $EMAIL
        $TOPIC
        $SUBJECT
        $MESSAGE
        $CAMPAIGN_UUID
        $ORG_URL
        $ORG_NAME
      */
      
      legislatorSubmission = customizeGreetings(legislatorSubmission, legislator.lastName);

      return legislatorSubmission;
    })
  };

  var customizeGreetings = function(submission, lastName){
    var greeting = "Dear " + lastName + ", \n";

    submission.fields.message = greeting + submission.fields.message;

    return submission;
  };

	$scope.send = function(repData){
    
    //create JSON form submission object
    $scope.submitted = true;
    $scope.formSubmissions = prepareFormSubmission();

    if ($scope.joinEmailList) {
      // TODO add to eff email list
      // $scope.formData.email
    }

    if ($scope.hasCaptcha){
      // TODO
    } else {
      dioApi.submitMessageToReps($scope.formSubmissions);
      $location.path('/thanks');
    };
	};

  //ON PAGE LOAD:

  // check if they started at the beginning and populate legislator data
  if (isEmpty(dioLegislatorData.legislators) || isEmpty(dioLegislatorData.selectedLegislators)) {
    attemptToFetchLegislatorData($location.search());
  } else {
    $scope.setLegislators();
  }

  var selectedBioguideIds = map(dioLegislatorData.getSelectedLegislators(), function(legislator) {
      return legislator.bioguideId;
  });

  if (isEmpty(dioLegislatorData.legislatorsFormElements)) {
    attemptToFetchLegislatorForm(selectedBioguideIds);
  } else {
    $scope.setLegislatorForm();
  }

  $scope.hasCaptcha = checkForCaptcha();
};

module.exports = MessageFormController;
