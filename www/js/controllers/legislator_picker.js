/**
 *
 */

var isEmpty = require('lodash.isEmpty');
var map = require('lodash.map');


var LegislatorPickerController = function($scope, $location, $timeout, dioLegislatorData, dioApi, dioPageNav) {

  // TODO(leah): Wire this on to the rootscope?
  $scope.dioPageNav = dioPageNav;

  $scope.loadingDelay = true;
  
  $timeout(function(){
      $scope.loadingDelay = false;
    },
    350);


  var attemptToFetchLegislatorData = function(params) {
    if (!angular.isUndefined(params.lat) && !angular.isUndefined(params.lng)) {
      var cb = function(legislators) {
        dioLegislatorData.setLegislators(legislators);
        $scope.setLegislators();
      };
      
      dioApi.findLegislatorsByLatLng(params.lat, params.lng, cb);
		} else {
			$scope.dioPageNav.back();
		}
  };

  $scope.setLegislators = function() {
    $scope.legislators = dioLegislatorData.legislators;
    $scope.selectedLegislators = dioLegislatorData.selectedLegislators;
  };

	$scope.submit = function() {
    var selectedBioguideIds = map(dioLegislatorData.getSelectedLegislators(), function(legislator) {
      return legislator.bioguideId;
    });

    // OPTIMIZATION: check a timed / session-stable cache for data before hitting POTC, as it's an
    //               expensive call.
    // TODO: There should probably be a lag-delayed (~350ms) loading modal before firing the API call
    dioApi.legislatorFormElementsByBioguideIds(selectedBioguideIds, function(legislatorsFormElements) {
      dioLegislatorData.setLegislatorsFormElements(legislatorsFormElements);
		  $location.path('/compose');
    });
	};

  if (isEmpty(dioLegislatorData.legislators)) {
    attemptToFetchLegislatorData($location.search());
	} else {
    $scope.setLegislators();
  }
};

module.exports = LegislatorPickerController;
