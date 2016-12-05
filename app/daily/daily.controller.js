'use strict';

/* Controllers */

/* global angular */
/* global moment */
/* global chroma */
/* jshint strict : true */
/* jshint undef : true */
/* jshint unused : true */
/* jshint globalstrict : true */

angular.module('myApp.controllers.daily', []).

	controller( 'DailyCtrl', [
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

		var lastRoute = $route.current,
		lastDate = moment( $routeParams.date, 'YYYY-MM-DD' ),

		// where should this code live? Controller doesn't seem like the right place
		blueGreen = { start : chroma ( '#669933' ), end : chroma ( '#336699' ) }, // green 73, 142, 0  -- blue 0, 20, 126
		red = { start : chroma ( 252, 235, 235 ), end : chroma ( 149, 0, 0 ) },
		green = { start : chroma ( 73, 142, 0 ), end : chroma ( 232, 255, 209 ) },
		blue = { start : chroma ( 242, 244, 255 ), end : chroma ( 0, 20, 126 ) },

		colors = {
			'net' : blueGreen,
			'solar' : green,
			'used' : blue,
			'outdoor_deg_min' : blue,
			'outdoor_deg_max' : red,
			'hdd' : blue,
			'water_heater' : blue,
			'ashp' : blue,
			'water_pump' : blue,
			'dryer' : blue,
			'washer' : blue,
			'dishwasher' : blue,
			'stove' : blue,
			'refrigerator' : blue,
			'living_room' : blue,
			'aux_heat_bedrooms' : blue,
			'aux_heat_living' : blue,
			'study' : blue,
			'barn' : blue,
			'basement_west' : blue,
			'basement_east' : blue,
			'ventilation' : blue,
			'ventilation_preheat' : blue,
			'kitchen_recept_rt' : blue,
			'all_other' : blue
		},

		getLocationParams = function ( location ) {

			var path = location.path().split('/'),

			route = {
				path : path[1],
				view : path[2],
				date : location.search().date,
				house : location.search().house
			};

			if ( path.length > 3 ) {

				route.circuit = path[3];
			}
			return route;
		};
			var showSummary = function ( data ) {

		$scope.warning = false;
				if ( typeof data.items[0] === 'undefined' ) {

		$routeParams.path = 'daily';

		$scope.view = $routeParams.circuit || $routeParams.view;
					$scope.warning = true;
				} else {

		$scope.updateMonth = function ( params ) { // get data for selected month
					$scope.data = dataService.insertAverage (data, ['used'], ['ahu']);
				}
			},

			dataProvider.getDailyData ( params ).then ( function ( data ) {
				// check to make sure data came back first, then do these things
			showGeneration = function ( data ) {

				if ( typeof data.items === 'undefined' ) {

					$scope.warning = true;
				}
				else {

					$scope.chartDate = metadataService.data.chartDate;

					data.range = metadataService.limits.range;

					$scope.data = dataService.insertColor ( data, colors );

					// insert measure, this should come from the db...?
					$scope.data = dataService.insertMeasure ( data, [
						[ 'net', 'kWh' ],
						[ 'solar', 'kWh' ],
						[ 'used', 'kWh' ],
						[ 'outdoor_deg_min', '&deg;F' ],
						[ 'outdoor_deg_max', '&deg;F' ],
						[ 'hdd', 'HDD' ],
						[ 'water_heater', 'kWh' ],
						[ 'ashp', 'kWh' ],
						[ 'water_pump', 'kWh' ],
						[ 'dryer', 'kWh' ],
						[ 'washer', 'kWh' ],
						[ 'dishwasher', 'kWh' ],
						[ 'refrigerator', 'kWh' ],
						[ 'living_room', 'kWh' ],
						[ 'aux_heat_bedrooms', 'kWh' ],
						[ 'aux_heat_living', 'kWh' ],
						[ 'study', 'kWh' ],
						[ 'barn', 'kWh' ],
						[ 'basement_west', 'kWh' ],
						[ 'basement_east', 'kWh' ],
						[ 'ventilation', 'kWh' ],
						[ 'ventilation_preheat', 'kWh' ],
						[ 'kitchen_recept_rt', 'kWh' ],
						[ 'stove', 'kWh' ],
						[ 'all_other', 'kWh' ]
					]);
				}
				// show warnings if no data returned
				if ( $scope.warning ) {
					data.max_solar_hour.date = moment( data.max_solar_hour.date ).toDate();

					$scope.message = "Oops, you've asked for a house or year that I can't find.";
					$scope.data = dataService.insertDiff(data, 'actual', 'estimated');

					$scope.data = dataService.insertAverage (data, ['actual'], ['adg']);
				}
				else {
			},

					$scope.updateChartDate( params ); // get chart data
			showUsage = function ( data ) {

					$scope.year = metadataService.current.year;
				}
			}, function ( reason ) {
				switch ( data.circuit.circuit_id ) {

					case 'summary' :

						if ( data.circuits[0].actual === null ) {

							$scope.warning = true;
						}
						else {

							if (data.circuits[0].circuit_id == 'used') { data.circuits[0].circuit_id = 'all'; } // shim

							$scope.data = dataService.insertPercent ( data, 'circuits', 'actual' );
						}

						break;

					case 'all' :

				$scope.warning = true;
						if ( typeof data.items === 'undefined' ) {

				$scope.message = reason;
			});
							$scope.warning = true;
						}
						else {

		}; $scope.updateMonth ( $routeParams ); // do once onload
							$scope.data = data;

		$scope.updateChartDate = function ( params ) { // get hourly data for selected date
							$routeParams.view = 'circuit';
						}

			dataProvider.getHourlyData ( params ).then ( function ( data ) {
				// transform data if needed
				if ( typeof data.hours === 'undefined' ) {
						break;

					case 'ashp' :

						if ( typeof data.items === 'undefined' ) {

							$scope.warning = true;
						}
						else {

							$scope.data = data;

							$routeParams.view = 'circuit';
						}

						break;

					default :

						if ( typeof data.items === 'undefined' ) {

							$scope.warning = true;
						}
						else {

							$scope.data = data;

							$routeParams.view = 'circuit';
						}
				}

			},

			showTemperature = function ( data ) {

				if ( typeof data.items === 'undefined' ) {

					$scope.warning = true;
				}
				else if ( typeof params.time !== 'undefined' ) {
				else {

					data.location_name = metadataService.locations[ data.location ];

					data.time = params.time;
				}
			},

				// show warnings if no data returned
				if ( $scope.warning ) {
			showWater = function ( data ) {

					$scope.message = "Oops, you've asked for a house or year that I can't find.";
				if ( typeof data.items === 'undefined' ) {

					$scope.warning = true;
				}
				else {

					chartService.setData ( 'daily', data );
					$scope.data = dataService.insertEfficiency ( data );

					$scope.data = dataService.insertAverage (data, ['cold', 'hot', 'main'], ['cold_avg', 'hot_avg', 'main_avg']);
				}
			}, function ( reason ) {
			},

				$scope.warning = true;
			showBasetemp = function ( data ) {

				$scope.message = reason;
			});
		};
				if ( typeof data.points === 'undefined' ) {

		$scope.changeMonth = function ( date ) {
			// update URL
			$location.search ( 'date', date );
					$scope.warning = true;
				}
				else {

			//var params = getLocationParams ( $location );
		};
					$scope.data = dataService.insertLinearRegression ( data );
				}
			},

		$scope.selectChartDate = function ( date ) {
			// update URL
			$location.search ( 'date', date );
			setOptionsIfBasetemp = function ( params ) {

			//var params = getLocationParams ( $location );
		};
				var options = {};

		$scope.$on ( '$locationChangeSuccess', function ( ) { // event
			// "/path/view/circuit"
			$scope.warning = false;
			var params = getLocationParams( $location ),
			newDate = moment( params.date, 'YYYY-MM-DD' ),
			// if nav to another daily view and year has not changed, then just update $scope.view
			yearHasChanged = newDate.year() != lastDate.year();
				if ( params.view == 'basetemp' ) {

			if (( $route.current.$$route.controller === 'DailyCtrl' ) && !yearHasChanged ) {
					if ( params.interval !== undefined ) {

				$route.current = lastRoute;
						options.interval = params.interval;
					}
					else {

				if ( typeof params.circuit !== 'undefined' ) {
					// circuit
					$scope.view = params.circuit;
				}
				else {
						options.interval = 'days';
					}
					if ( params.base !== undefined ) {

						options.base = params.base;
					}
					else {

					$scope.view = params.view;
						options.base = 65;
					}
				}
				metadataService.current.view = $location.path().substr(1);
				$scope.chartDate = params.date;
				return options;
			},

			setRouteParams = function ( params ) {

				if ( params.view == 'basetemp' ) {

				// if month has not changed, and chartDate has changed, then call $scope.updateChartDate
				if (( lastDate.month() == newDate.month() ) &&
					( lastDate.date()  != newDate.date() )) {
					$scope.updateChartDate ( params );
					$routeParams.interval = $scope.options.interval;

					$routeParams.base = $scope.options.base;
				}
				// if year has not changed (eg got this far), and month has changed, then call $scope.updateMonth
				if ( lastDate.month() != newDate.month() ) {
					$scope.updateMonth ( params );
				if ( (params.view == 'usage') && (params.filter == 'ashp') ) {

					$routeParams.base = metadataService.basetemp.base;
				}
				return $routeParams;
			};

			$scope.warning = false;

			$routeParams.path = 'days';

			$scope.options = setOptionsIfBasetemp ( $routeParams );

			$scope.update = function () {

				$routeParams = setRouteParams ( $routeParams );

				dataProvider.getDailyData( $routeParams ).then( function( data ) {

					switch ( $routeParams.view ) {

						case 'summary' : showSummary ( data ); break;

						case 'generation' : showGeneration ( data ); break;

						case 'usage' : showUsage ( data ); break;

						case 'temperature' : showTemperature ( data ); break;

						case 'water' : showWater ( data ); break;

						case 'basetemp' : showBasetemp ( data );
					}
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
