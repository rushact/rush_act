/**
 *
 */

var findWhere = require('lodash.findWhere');
var filter = require('lodash.filter');
var forEach = require('lodash.forEach');
var isArray = require('lodash.isArray');
var isEmpty = require('lodash.isEmpty');
var isUndefined = require('lodash.isUndefined');
var map = require('lodash.map');

var helpers = require('../helpers/message-form');


var MessageFormController = function($scope, $location, $timeout, dioData, dioApi) {
  $scope.loadingDelay = true;
  $scope.submitted = false;
  $scope.joinEmailList = false;

  $timeout(function() {
    $scope.loadingDelay = false;
  }, 350);

  $scope.goBack = function() {
    if (!dioData.hasCanonicalAddress()) {
      $location.path('/');
    } else {
      $location.path('/location');
    }
  };

  /**
   * Whether any of the legislators to message require captchas.
   * @type {boolean}
   */
  $scope.hasCaptcha = false;

  /**
   *
   * @type {{}}
   */
  $scope.formData = {
    prefix: 'Ms'
  };

  /**
   *
   * @type {{}}
   */
  $scope.countyData = {};

  /**
   *
   * @type {Array}
   */
  $scope.topicOptions = {};

  /**
   * Fetch LegislatorFormElements models from the server for the supplied bioguideIds.
   * @param {Array} bioguideIds
   */
  $scope.fetchlegislatorFormElems = function(bioguideIds) {
    var cb = function(err, legislatorsFormElements) {
      var lfeFound = !isEmpty(legislatorsFormElements);
      var serverErr = !isEmpty(err);

      if (lfeFound) {
        dioData.setLegislatorsFormElements(legislatorsFormElements);
        $scope.setLocalData();
      } else {
        if (serverErr) {
          // TODO(sina): Show a server err
        } else {
          // TODO(all): Figure out what to do here
        }
      }
    };

    dioApi.legislatorFormElemsByBioguideIds(bioguideIds, cb);
  };

  /**
   * Check whether or not any reps require captchas.
   * @returns {boolean}
   */
  $scope.repsUseCaptchas = function() {
    for (var i = 0; i < $scope.legislatorsFormElements.length; ++i) {
      if ($scope.legislatorsFormElements[i].requiresCaptcha()) {
        return true;
      }
    }
    return false;
  };

	$scope.send = function(repData) {

    // create JSON form submission object
    $scope.submitted = true;
    var messages = map($scope.legislators, function(legislator) {
      return helpers.makeMessage(
        legislator,
        $scope.formData,
        $scope.messageForm.phone.$viewValue,
        $scope.topicOptions,
        $scope.address
      );
    });

    if ($scope.joinEmailList) {
      // TODO add to eff email list
      // $scope.formData.email
    }

    var cb = function(data) {
      // TODO - hand off to CAPTCHA controller
    };

    dioApi.submitMessageToReps(messages, cb);

    if ($scope.hasCaptcha) {
      $location.path('/captcha');
    } else {
      $location.path('/thanks');
    }
	};

  // TODO(leah): Nitpicks:
  //   * wire up the error fields to use better show conditions, so the phone err msg etc doesn't immediately show on typing

  /**
   * Set local scope values for values fetched from the session store.
   */
  $scope.setLocalData = function() {
    $scope.legislators = dioData.getSelectedLegislators();
    $scope.bioguideIdsBySelection = dioData.getBioguideIdsBySelection();
    $scope.legislatorsFormElements = dioData.getLegislatorsFormElements();
    $scope.address = dioData.getCanonicalAddress();

    $scope.hasCaptcha = $scope.repsUseCaptchas();
    var formFieldData = helpers.createFormFields(
      $scope.legislatorsFormElements, $scope.legislators, $scope.countyData, $scope.address);

    $scope.countyData = formFieldData.countyData;
    $scope.topicOptions = formFieldData.topicOptions;
    $scope.formData = formFieldData.formData;
  };

  /**
   * Fetch data from the session store.
   */
  $scope.fetchDataFromStore = function() {
    var validData = dioData.hasBioguideIdsBySelection() && dioData.hasCanonicalAddress();
    var selectedBioguideIds = dioData.getSelectedBioguideIds();
    if (!validData || isEmpty(selectedBioguideIds)) {
      $scope.goBack();
    }

    if (!dioData.hasLegislatorsFormElements()) {
      $scope.fetchlegislatorFormElems(selectedBioguideIds);
    } else {
      $scope.setLocalData();
    }
  };

  $scope.fetchDataFromStore();

};

module.exports = MessageFormController;
