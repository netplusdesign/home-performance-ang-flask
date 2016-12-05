'use strict';

/* jasmine specs for controllers go here */

describe('YearlyCtrl', function() {

	var scope, createController,
	mockData,
	mockDataProviderService = {
		getYearlyData : function () {
			return q.when( mockData );
		}
	}, q,
	mockMetadataService = {
		setParamYear : function () { },
		current : { year : '2013' },
		data : {}
	},
	mockDataService = {
		insertADU : function () { },
		insertADG : function () { },
		insertDiff : function () { },
		insertPercent : function () { },
		insertProjected : function () { },
		insertHeatEfficiency : function () { },
		insertEfficiency : function () { },
		insertLinearRegression : function () { }
	},
	mockChartService = {
		setData : function () { }
	},
	routeParams;

	beforeEach( module( 'myApp.controllers' ) );

	beforeEach( inject( function( $rootScope, $controller, $q ) {

		q = $q;
		scope = $rootScope.$new();
		createController = function() {
            return $controller('YearlyCtrl', {
				$scope : scope,
				$routeParams : routeParams,
				dataProvider : mockDataProviderService,
				metadataService : mockMetadataService,
				dataService  : mockDataService,
				chartService : mockChartService
			});
		};
    }));

	// it('', function() {});
	it('should insert avg. daily usage when view == summary', function() {
		routeParams = { view : 'summary' };
		mockData = {"totals":{"used":"12806.756","solar":"-17430.964","net":"-4624.208","hdd":"12695.097"},"items":[{"date":"2012-02-01","used":"5600.602","solar":"-8856.387","net":"-3255.785","hdd":"5884.847"},{"date":"2013-01-01","used":"7206.154","solar":"-8574.577","net":"-1368.423","hdd":"6810.250"}]};
		spyOn(mockDataProviderService, 'getYearlyData').andCallThrough();
		spyOn(mockDataService, 'insertADU').andCallThrough();
		var controller = createController();
		expect(mockDataProviderService.getYearlyData).toHaveBeenCalled();
		scope.$apply();
		expect(mockDataService.insertADU).toHaveBeenCalled();
	});
	it('should show error when view == summary and returned month object == null', function() {
		mockData = {"totals":{"used":null,"solar":null,"net":null,"hdd":null}};
		var controller = createController();
		scope.$apply();
		expect(scope.warning).toBe(true);
	});
});
