'use strict';

/* jasmine specs for services go here */

// write tests for updates to putSeriesData

describe('service', function() {
	// doesn't work yet. says Highcharts is undefined
	//   also have to add showDangerIfUsingMoreThanProducing to return
	xdescribe('chartService showDangerIfUsingMoreThanProducing', function(){
		var mockHighcharts = {
			setOptions : function () {}
		},
		chartService,
		mockService = {
			data : { houseID : 0,
					 chartDate : '2013-11-01',
					 asofDate : '2013-12-31' },
			current : { year : '2013',
					    view : 'summary' },
			getDaysYTD : function () {
				return 365;
			},
			setParams : function() {}
		},
		color, colors = { 'Used' : '#336699', 'Solar' : '#669933', 'danger' : '#DF0101' };

		beforeEach(function() {
			module(function ($provide) {
				$provide.value('metadataService', mockService);
			});
		});

		beforeEach(inject(function(_chartService_, _$window_) {
			chartService = _chartService_;
			window = _$window_;
			//Highcharts = mockHighcharts;
		}));

		it('should return red if categoriy is solar and used > solar', function() {
			color = chartService.showDangerIfUsingMoreThanProducing( 'Solar', colors, '12', '-6' );
			expect( color ).toBe( '#DF0101' );
		});

		it('should return green if categoriy is solar and solar > used', function() {
			color = chartService.showDangerIfUsingMoreThanProducing( 'Solar', colors, '6', '-12' );
			expect( color ).toBe( '#669933' );
		});

		it('should return blue if categoriy is used', function() {
			color = chartService.showDangerIfUsingMoreThanProducing( 'Used', colors, '12', '-6' );
			expect( color ).toBe( '#336699' );
		});

	});

});
