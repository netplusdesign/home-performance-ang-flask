'use strict';

/* Controllers */

/* global angular */
/* global moment */
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
			var interval;

			if ($scope.yearFilter.year == 'ALL') {

				interval = 'years';
			}
			else if (metadataService.data.interval == 'years') {

				metadataService.setInterval('months');

				interval = metadataService.data.interval;
			}
			else {

				interval = metadataService.data.interval;
			}

			var location = '#/' + interval + '/' + $scope.viewSelection.view;

			if ( $scope.viewSelection.view == 'monthly/usage' ) {
				// need to take into account usage screen with drilldown
				location = location + '/' + metadataService.data.circuit;
			}
			location = location + '?house=' + metadataService.data.houseId + '&date=' + metadataService.data.chartDate;

			$window.location = location;
		};

	}]);
