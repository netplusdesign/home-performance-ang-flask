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

		$scope.filter = metadataService.current;

		$scope.changeYear = function() {

			metadataService.setParamYear($scope.yearFilter.year);

			$scope.changeView();
		};

		$scope.changeCircuitFilter = function() {

			metadataService.setParamFilter('circuit', $scope.filter.filter.circuit);

			$scope.changeView();
		};

		$scope.changeLocationFilter = function() {

			metadataService.setParamFilter('location', $scope.filter.filter.location);

			$scope.changeView();
		};

		$scope.changeView = function() {

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

			switch ( $scope.viewSelection.view ) {

				case 'summary' :
				case 'generation' :
				case 'basetemp' :
				case 'water' :

					// ...
					break;

				case 'usage' :

					if (metadataService.data.filter.circuit !== undefined) {

						location = location + '/' + metadataService.data.filter.circuit;
					}
					else {

						location = location + '/all'; // default
					}
					break;

				case 'temperature' :

					if (metadataService.data.filter.location !== undefined) {

						location = location + '/' + metadataService.data.filter.location;
					}
					else {

						location = location + '/outdoor'; // default
					}
					break;

			}

			location = location + '?house=' + metadataService.data.houseId + '&date=' + metadataService.data.chartDate;

			$window.location = location;
		};

	}]);
