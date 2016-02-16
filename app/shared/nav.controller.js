'use strict';

/* Controllers */

/* global angular */
/* global moment */
/* global chroma */
/* jshint strict : true */
/* jshint undef : true */
/* jshint unused : true */
/* jshint globalstrict : true */

angular.module('myApp.controllers.nav', []).

	controller('NavigationCtrl', ['$scope', '$window', 'metadataService', function ( $scope, $window, metadataService ) {

		$scope.data = metadataService.data;

		$scope.yearFilter = metadataService.current;

		$scope.viewSelection = metadataService.current;

		$scope.changeYear = function() {

			metadataService.setParamYear($scope.yearFilter.year);

			$scope.changeView();
		};

		$scope.changeView = function() {

			var location = '#/' + $scope.viewSelection.view;

			if ( $scope.viewSelection.view == 'monthly/usage' ) {
				// need to take into account usage screen with drilldown
				location = location + '/' + metadataService.data.circuit;
			}
			location = location + '?house=' + metadataService.data.houseId + '&date=' + metadataService.data.chartDate;

			$window.location = location;
		};

	}]);
