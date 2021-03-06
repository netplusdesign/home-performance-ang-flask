'use strict';

/* global angular */
/* jshint strict : true */
/* jshint undef : true */
/* jshint unused : true */
/* jshint globalstrict : true */

// Declare app level module which depends on filters, and services
angular.module('myApp', [
	'ngRoute',
	'myApp.filters',
	'myApp.services',
	'myApp.directives',
	'myApp.controllers'
]).
config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
}]).
config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when ( '/years/:view', {
			templateUrl: function ( params ) {
				return 'static/yearly/' + params.view + '.html';
			},
			controller: 'YearlyCtrl'
		}).
		when ( '/years/:view/:filter', {
			templateUrl: function ( params ) {
				return 'static/yearly/' + params.view + '.html';
			},
			controller: 'YearlyCtrl'
		}).
		when ( '/months/:view', {
			templateUrl: function ( params ) {
				return 'static/monthly/' + params.view + '.html';
			},
			controller: 'MonthlyCtrl'
		}).
		when ( '/months/:view/:filter', {
			templateUrl: function ( params ) {
				return 'static/monthly/' + params.view + '.html';
			},
			controller: 'MonthlyCtrl'
		}).
		when ( '/days/:view', {
			templateUrl: function ( params ) {
				return 'static/daily/' + params.view + '.html';
			},
			controller: 'DailyCtrl'
		}).
		when ( '/days/:view/:filter', {
			templateUrl: function ( params ) {
				return 'static/daily/' + params.view + '.html';
			},
			controller: 'DailyCtrl'
		}).
		when ( '/hours/:view/', {
			templateUrl: function ( params ) {
				return 'static/hourly/' + params.view + '.html';
			},
			controller: 'HourlyCtrl'
		}).
		when ( '/hours/:view/:filter', {
			templateUrl: function ( params ) {
				return 'static/hourly/' + params.view + '.html';
			},
			controller: 'HourlyCtrl'
		}).
		// accept old requests until they can be converted
		when ( '/monthly/summary/', {
			templateUrl: function ( params ) {
				params.view = 'summary';
				params.interval = 'months';
				return 'static/monthly/' + params.view + '.html';
			},
			controller: 'MonthlyCtrl'
		}).
		when ( '/daily/net/', {
			templateUrl: function ( params ) {
				params.view = 'summary';
				params.interval = 'days';
				return 'static/daily/' + params.view + '.html';
			},
			controller: 'DailyCtrl'
		}).

		otherwise( { redirectTo: '/years/summary' } );
}]);
