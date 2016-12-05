'use strict';

/* Controllers */

/* global angular */
/* global moment */
/* jshint strict : true */
/* jshint undef : true */
/* jshint unused : true */
/* jshint globalstrict : true */

angular.module('myApp.controllers.header', []).

	controller('HeaderCtrl', ['$scope', 'metadataService', function ( $scope, metadataService ) {

		$scope.data = metadataService.data;

	}]);
