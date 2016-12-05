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
		'metadataService',
		'dataService',
		'chartService',
		function (
			$scope,
			$routeParams,
			dataProvider,
			metadataService,
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
		},

		showGeneration = function ( data ) {

			if ( typeof data.items === 'undefined' ) {

				$scope.warning = true;
			}
			else {

				data.max_solar_hour.date = moment( data.max_solar_hour.date ).toDate();

				$scope.data = dataService.insertAverage (data, ['actual'], ['adg']);

				$scope.data = dataService.insertDiff(data, 'actual', 'estimated');
			}
		},

		showUsage = function ( data ) {

			switch ( data.circuit.circuit_id ) {

				case 'summary' :

					if ( data.circuits[0].actual === null ) {

						$scope.warning = true;
					}
					else {


						$scope.data = dataService.insertPercent ( data, 'circuits', 'actual' );
					}

					break;

				case 'all' :

					if ( typeof data.items === 'undefined' ) {

						$scope.warning = true;
					}
					else {

						$scope.data = dataService.insertDiff ( data, 'budget', 'actual' );

						$scope.data = dataService.insertAverage (data, ['actual'], ['adu']);

						$routeParams.view = 'circuit';
					}

					break;

				case 'ashp' :

					if ( typeof data.items === 'undefined' ) {

						$scope.warning = true;
					}
					else {

						$scope.data = dataService.insertProjected ( data );

						$scope.data = dataService.insertDiff ( data, 'projected', 'actual' );

						$scope.data = dataService.insertAverage (data, ['actual'], ['adu']);

						$routeParams.view = 'circuit';
					}

					break;

				default :

					if ( typeof data.items === 'undefined' ) {

						$scope.warning = true;
					}
					else {

						$scope.data = dataService.insertAverage (data, ['actual'], ['adu']);

						$routeParams.view = 'circuit';
					}
			}

		},

		showTemperature = function ( data ) {
			if ( typeof data.items === 'undefined' ) {

				$scope.warning = true;
			}
			else {

				data.location_name = metadataService.locations[ data.location ];

				$scope.data = data;
			}
		},

		showWater = function ( data ) {

			if ( typeof data.items === 'undefined' ) {

				$scope.warning = true;
			}
			else {

				$scope.data = dataService.insertEfficiency ( data );

				$scope.data = dataService.insertAverage (data, ['cold', 'hot', 'main'], ['cold_avg', 'hot_avg', 'main_avg']);
			}
		},

		showBasetemp = function ( data ) {

			if ( typeof data.points === 'undefined' ) {

				$scope.warning = true;
			}
			else {

				$scope.data = dataService.insertLinearRegression ( data );
			}
		},

		setOptionsIfBasetemp = function ( params ) {

			var options = {};

			if ( params.view == 'basetemp' ) {

				if ( params.interval !== undefined ) {

					options.interval = params.interval;
				}
				else {

					options.interval = 'years';
				}
				if ( params.base !== undefined ) {

					options.base = params.base;
				}
				else {

					options.base = 65;
				}
			}
			return options;
		},

		setRouteParams = function ( params ) {

			if ( params.view == 'basetemp' ) {

				$routeParams.interval = $scope.options.interval;

				$routeParams.base = $scope.options.base;
			}
			if ( (params.view == 'usage') && (params.filter == 'ashp') ) {

				$routeParams.base = metadataService.basetemp.base;
			}
			return $routeParams;
		};

		$scope.warning = false;

		$routeParams.path = 'years';


		$scope.options = setOptionsIfBasetemp ( $routeParams );

		$scope.update = function () {

			$scope.loading = true;

			$routeParams = setRouteParams ( $routeParams );

			dataProvider.getYearlyData( $routeParams ).then( function( data ) {

				switch ( $routeParams.view ) {

					case 'summary' : showSummary ( data ); break;

					case 'generation' : showGeneration ( data ); break;

					case 'usage' : showUsage ( data ); break;

					case 'temperature' : showTemperature ( data ); break;

					case 'water' : showWater ( data ); break;

					case 'basetemp' : showBasetemp ( data );
				}

				$scope.loading = false;

				// show warnings if no data returned
				if ( $scope.warning ) {

					$scope.message = "Oops, you've asked for a house, year or interval that is not supported.";
				}
				else {
					// this is the only place metadataService is used in this controller, can get this from data?
					$scope.year = metadataService.current.year;
					$scope.house = metadataService.data.houseId;
					$scope.date = metadataService.data.chartDate; // used for usage screens only
					// send data to chartService
					chartService.setData ( $routeParams.view, data );
				}
			}, function ( reason ) {

				$scope.warning = true;

				$scope.message = reason;
			});

		}; $scope.update();

	}]);
