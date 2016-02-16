'use strict';

/* jasmine specs for services go here */

// write tests for updates to putSeriesData

describe('service', function() {

	beforeEach(module('myApp.services'));
	// need to test promise of a promise, not sure how...
  	xdescribe('dataProvider', function(){

			var metadataService, dataProvider, $httpBackend, routeParams;
			var promiseResult;

			beforeEach(inject(function(_$httpBackend_, _dataProvider_, _metadataService_) {

				$httpBackend = _$httpBackend_;
				metadataService = _metadataService_;
				//$httpBackend.expectGET('phones/xyz.json').respond(xyzPhoneData());
				routeParams = { view : 'summary' };

				dataProvider = _dataProvider_;
				dataProvider.getMonthlyData( routeParams ).then(function (result) {
					promiseResult = result;
				});
			}));

			it('should getMetadata when asofDate is false', function() {
				$httpBackend.flush();
				expect( promiseResult ).toBe( 'loaded' );
			});

	});

});
