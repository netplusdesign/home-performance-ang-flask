'use strict';

/* jasmine specs for services go here */

// write tests for updates to putSeriesData

describe('service', function() {

	beforeEach(module('myApp.services'));

  	describe('metadataService', function(){

		describe('at start', function(){
			var metadataService;

			beforeEach(inject(function(_metadataService_) {
				metadataService = _metadataService_;
			}));

			it('.houseId should be false', function(){
				expect( metadataService.data.houseId ).toBe(false);
			});
			it('.chartDate should be false', function(){
				expect( metadataService.data.chartDate ).toBe(false);
			});
			it('.asofDate should be false', function(){
				expect( metadataService.data.asofDate ).toBe(false);
			});

			it('.view should be undefined', function(){
				expect( metadataService.current.view ).toBe( undefined );
			});
			it('.year should be undefined', function(){
				expect( metadataService.current.year ).toBe( undefined );
			});

		});

		describe('validate() for summary', function(){
			var metadataService;

			beforeEach ( inject ( function ( _metadataService_) {
				metadataService = _metadataService_;
				var params = { house: '0', date: '2013-12-30', view: 'summary', path: 'monthly' };
				metadataService.validate( params );
			}));

			it('data.houseId should be 0', function() {
				expect( metadataService.data.houseId ).toEqual('0');
			});
			it('data.chartDate should be 2013-12-30', function() {
				expect( metadataService.data.chartDate ).toEqual('2013-12-30');
			});
			it('current.view should be summary', function() {
				expect( metadataService.current.view ).toEqual('monthly/summary');
			});
			it('current.year should be 2013', function() {
				expect( metadataService.current.year ).toEqual('2013');
			});
			it('data.asofDate should still be false', function() {
				expect( metadataService.data.asofDate ).toBe( false );
			});

		});

		describe('validate() missing house and date', function(){
			var metadataService;

			beforeEach(inject(function(_metadataService_) {
				metadataService = _metadataService_;
				var params = { view: 'summary', path: 'monthly' };
				metadataService.validate( params );
			}));

			it('data.houseId should be 0', function() {
				expect( metadataService.data.houseId ).toEqual('0');
			});
			// need a mockdate object in Jasmine to do this. Or try the Angular mockdate object...
			xit('data.chartDate should be 2013-12-31', function() {
				expect( metadataService.data.chartDate ).toEqual('2013-12-31');
			});
			// need a mockdate object in Jasmine to do this. Or try the Angular mockdate object...
			xit('current.year should be 2013', function() {
				expect( metadataService.current.year ).toEqual('2013');
			});
			it('current.view should be summary', function() {
				expect( metadataService.current.view ).toEqual('monthly/summary');
			});
			it('data.asofDate should still be false', function() {
				expect( metadataService.data.asofDate ).toBe( false );
			});

		});

		describe('setParamYear()', function(){
			var metadataService;

			beforeEach(inject(function(_metadataService_) {
				metadataService = _metadataService_;
				var params = { house: '0', date: '2013-12-30', view: 'summary', path: 'monthly' };
				metadataService.validate( params );
				metadataService.setParamYear('2012');
			}));

			it('current.year should be 2013', function() {
				expect( metadataService.current.year ).toEqual('2012');
			});
			it('data.chartDate should be 2012-12-30', function() {
				expect( metadataService.data.chartDate ).toEqual('2012-12-30');
			});
			it('current.view should remain summary', function() {
				expect( metadataService.current.view ).toEqual('monthly/summary');
			});
			it('data.asofDate should still be false', function() {
				expect( metadataService.data.asofDate ).toBe( false );
			});

		});

		describe('before setMetadata()', function(){
			var metadataService;

			beforeEach(inject(function(_metadataService_) {
				metadataService = _metadataService_;
				//metadataService.setMetadata({"years":["2012","2013"],"asof":"2013-12-31","house":"Up Hill House"});
			}));

			it('data.chartDate should be false', function() {
				expect( metadataService.data.chartDate ).toBe( false );
			});

		});

		describe('setMetadata()', function(){
			var metadataService;

			beforeEach(inject(function(_metadataService_) {
				metadataService = _metadataService_;
				metadataService.setMetadata({"years":["2012","2013"],"asof":"2013-12-31","house": { "name": "Up Hill House"}});
			}));

			it('data.asofDate should be 2013-12-31', function() {
				expect( metadataService.data.asofDate ).toEqual('2013-12-31');
			});
			it('data.years.length should be 2', function() {
				expect( metadataService.data.years.length ).toBe(2);
			});
			it('data.houseName should be Up Hill House', function() {
				expect( metadataService.data.houseName ).toEqual('Up Hill House');
			});
			it('data.chartDate should = data.asofDate if chartDate is not set yet', function() {
				expect( metadataService.data.chartDate ).toEqual('2013-12-31');
			});

		});

		describe('getDaysYTD()', function(){
			var metadataService;

			beforeEach(inject(function(_metadataService_) {
				metadataService = _metadataService_;
				metadataService.setMetadata({"years":["2012","2013"],"asof":"2013-12-31","house":"Up Hill House"});
				var params = { house: '0', date: '2013-12-30' };
				metadataService.validate( 'summary', params );
			}));

			it('chart year 2014 > asof year 2013, should return false', function() {
				metadataService.setParamYear('2014');
				metadataService.data.asofDate = '2013-02-28';
				expect( metadataService.getDaysYTD() ).toBe( false ); // don't have data past asof year
			});
			it('chart year 2013 = asof year 2013. 02-28 should return 59', function() {
				metadataService.data.asofDate = '2013-02-28';
				expect( metadataService.getDaysYTD() ).toEqual(59); // 31 + 28
			});
			it('chart year 2013, asof 2013-12-30 should return 365', function() {
				expect( metadataService.getDaysYTD() ).toEqual(365);
			});
			it('chart year 2012, asof 2013-12-30 should return 366', function() {
				metadataService.setParamYear('2012');
				expect( metadataService.getDaysYTD() ).toEqual(366);
			});

			it('chart year 2011 < asof 2013-12-30, should be false', function() {
				metadataService.setParamYear('2011');
				expect( metadataService.getDaysYTD() ).toBe( false );
			});

		});

	});

});
