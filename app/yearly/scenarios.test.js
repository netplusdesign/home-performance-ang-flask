'use strict';

describe('my app', function() {

	describe('yearly', function() {

		describe('yearly summary view', function() {

			beforeEach(function() {
				browser.get('#/yearly/summary');
			});

			it('should render summary when user navigates to /yearly/summary', function() {
				expect(element(by.id('summary')).isPresent()).toBe(true);
			});

			it('should select summary when user navigates to /summary', function() {
				expect(element(by.model('viewSelection.view')).getAttribute('value')).toMatch(/summary/);
			});
		});
	});

});
