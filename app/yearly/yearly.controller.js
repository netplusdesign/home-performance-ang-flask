'use strict';

/* Controllers */

/* global angular */
/* global moment */
/* global chroma */
/* jshint strict : true */
/* jshint undef : true */
/* jshint unused : true */
/* jshint globalstrict : true */

angular.module('myApp.controllers.yearly', []).

	controller( 'YearlyCtrl', [
		'$scope',
		'$routeParams',
		'dataProvider',
		'dataService',
		'chartService',
		function (
			$scope,
			$routeParams,
			dataProvider,
			dataService,
			chartService
		) {

		var showSummary = function ( data ) {

			if ( typeof data.items === 'undefined' ) {

				$scope.warning = true;
			}
			else {

				$scope.data = dataService.insertADU (data, ['used'], ['adu']);
			}
		};

		$scope.warning = false;

		$routeParams.path = 'yearly';

		$scope.update = function () {

			dataProvider.getYearlyData( $routeParams ).then( function( data ) {

				showSummary ( data );

				// show warnings if no data returned
				if ( $scope.warning ) {

					$scope.message = "Oops, you've asked for a house or year that I can't find.";
				}
				else {
					// send data to chartService
					chartService.setData ( $routeParams.view, data );
				}
			}, function ( reason ) {

				$scope.warning = true;

				$scope.message = reason;
			});

		}; $scope.update();

	}]);
