'use strict';

/* jasmine specs for controllers go here */
describe('DailyCtrl', function() {

	var scope, createController,
	mockDailyData, mockHourlyData,
	mockDataProviderService = {
		getDailyData : function () {
			return q.when( mockDailyData );
		},
		getHourlyData : function ( date ) {
			return q.when( mockHourlyData );
		}
	}, q,
	mockMetadataService = {
		current : { year : '2013', view : 'daily/netusage' },
		data : { chartDate : '2013-12-31' },
		limits : { range : {} }
	},
	mockDataService = {
		insertMeasure : function () { },
		insertColor : function () { }
	},
	mockChartService = {
		setData : function () { }
	},
	route, routeParams;

	beforeEach( module( 'myApp.controllers' ) );

	beforeEach( inject( function( $rootScope, $controller, $q ) {

		q = $q;
		scope = $rootScope.$new();
		createController = function() {
            return $controller('DailyCtrl', {
				$scope : scope,
				$route : route,
				$routeParams : routeParams,
				$location : location,
				dataProvider : mockDataProviderService,
				metadataService : mockMetadataService,
				dataService :  mockDataService,
				chartService : mockChartService
			});
		};
    }));

	it('should updateMonth and updateDate when view == netusage', function() {
		routeParams = { view : 'netusage' };
		route = { current : { $$route : { controller : 'DailyCtrl' } } };
		mockDailyData = {"days":[{"date":"2013-12-01","adjusted_load":"11.676","solar":"-10.626","used":"22.302","outdoor_deg_min":"29.611","outdoor_deg_max":"41.601","hdd":"30.146","water_heater":"3.220","ashp":"6.843","water_pump":"0.162","dryer":"2.379","washer":"0.382","dishwasher":"0.000","stove":"0.153","all_other":"9.163"},{"date":"2013-12-02","adjusted_load":"21.797","solar":"-2.959","used":"24.756","outdoor_deg_min":"32.092","outdoor_deg_max":"38.131","hdd":"30.371","water_heater":"6.766","ashp":"7.286","water_pump":"0.131","dryer":"0.011","washer":"0.000","dishwasher":"0.981","stove":"0.151","all_other":"9.430"} ]};
		mockHourlyData = {"hours":[{"date":"2013-12-31 00:00:00","adjusted_load":"540","solar":"0","used":"540","first_floor_temp":"66.193","second_floor_temp":"67.221","basement_temp":"63.455","outdoor_temp":"10.771","hdd":"2.260","water_heater":"0","ashp":"170","water_pump":"0","dryer":"0","washer":"0","dishwasher":"0","stove":"8","all_other":"362"},{"date":"2013-12-31 01:00:00","adjusted_load":"820","solar":"0","used":"820","first_floor_temp":"65.680","second_floor_temp":"67.050","basement_temp":"63.282","outdoor_temp":"9.849","hdd":"2.298","water_heater":"0","ashp":"442","water_pump":"0","dryer":"0","washer":"0","dishwasher":"0","stove":"8","all_other":"370"} ]};
		spyOn(mockDataProviderService, 'getDailyData').andCallThrough();
		spyOn(mockDataProviderService, 'getHourlyData').andCallThrough();
		var controller = createController();
		expect(mockDataProviderService.getDailyData).toHaveBeenCalled();
		scope.$apply();
		expect(mockDataProviderService.getHourlyData).toHaveBeenCalled();
	});
	xit('should not reload controller when switch between daily views', function() {
		// how to test this?
	});

});
