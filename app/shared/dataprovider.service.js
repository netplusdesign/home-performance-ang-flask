'use strict';

/* Services */

/* global angular */
/* jshint strict : true */
/* jshint undef : true */
/* jshint unused : true */
/* jshint globalstrict : true */

angular.module( 'myApp.services.dataProvider', [] ).

	factory( 'dataProvider', [ '$http', 'metadataService', function ( $http, metadataService ) {

		var getYearlyDetails = function ( config ) {

			return $http( config ).then( function ( result ) {

				return result.data;
			});
		},
		getYearlyMetadata = function ( config ) {

			return getMonthlyMetadataDetails ( config ).

			then( function () {

				return getYearlyDetails ( config );
			});
		},
		getYearlyData = function ( routeParams ) {

			var config = metadataService.validate ( routeParams );
			// if no metadata, then get it first
			if ( metadataService.data.asofDate ) {

				return getYearlyDetails( config );
			}
			else {

				return getYearlyMetadata ( config );
			}
		},

		getMonthlyMetadataDetails = function ( config ) {
			// replace hardcoded url
			return $http.get( metadataService.apiUrl + 'houses/0/views/default/?interval=months' ).then( function ( result ) {

				metadataService.setMetadata ( result.data );

				if (config.params.start == 'Invalid date') {
					config.params.start = metadataService.setStart ( metadataService.data.chartDate, config.params.interval );
				}
				config.params.date = metadataService.data.chartDate;
			});
		},
		getMonthlyDetails = function ( config ) {

			return $http( config ).then( function ( result ) {

				return result.data;
			});
		},
		getMonthlyMetadata = function ( config ) {

			return getMonthlyMetadataDetails ( config ).

			then( function () {

				return getMonthlyDetails ( config );
			});
		},
		getMonthlyData = function ( routeParams ) {

			var config = metadataService.validate ( routeParams );
			// if no metadata, then get it first
			if ( metadataService.data.asofDate ) {

				return getMonthlyDetails( config );
			}
			else {

				return getMonthlyMetadata ( config );
			}
		},

		getDailyDetails = function ( config ) {

			return $http( config ).

			then( function ( result ) {

				return result.data;
			});
		},
		getDailyData = function ( routeParams ) {

			var config = metadataService.validate ( routeParams );
			// if no asofDate or name, then get it first -- needed for navCtrl
			if ( !metadataService.data.asofDate ) {

				return getMonthlyMetadataDetails ( config ).

				then( function () {

					return getDailyDetails( config );
				});
			}
			else {

				return getDailyDetails( config );
			}
		};

		return {
			getYearlyData : getYearlyData,
			getMonthlyData : getMonthlyData,
			getDailyData : getDailyData
		};

	}]);
