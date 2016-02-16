'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('my app', function() {

	describe('daily', function() {

		describe('netusage at end of date range', function() {

			beforeEach(function() {
				browser.get('#/daily/net?date=2013-12-26');
			});

			it('should render daily when user navigates to /daily/netusage', function() {
				expect(element(by.id('daily')).isPresent()).toBe(true);
				expect(element(by.css('caption')).getText()).toMatch(/December 2013/);
			});

			it('should not display the next month nav arrow', function() {
				expect(element(by.id('back')).isDisplayed()).toBe(true);
				//expect(element(by.id('next')).isDisplayed()).toBe(false);
			});

			it('should display 40.778 kWh for the span#high-range', function() {
				expect(element(by.id('high-range')).getText()).toBe('40.778 kWh');
			});
		});

		describe('netusage at start of date range', function() {

			beforeEach(function() {
				browser.get('#/daily/net?date=2012-02-26');
			});

			it('should render daily when user navigates to /daily/netusage', function() {
				expect(element(by.css('caption')).getText()).toMatch(/February 2012/);
			});

			it('should not display the prev month nav arrow', function() {
				expect(element(by.id('back')).isDisplayed()).toBe(false);
				expect(element(by.id('next')).isDisplayed()).toBe(true);
			});

			it('should display 24.09 kWh for the span#high-range', function() {
				expect(element(by.id('high-range')).getText()).toBe('24.09 kWh');
			});
		});

	});

});
