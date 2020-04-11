'use strict';

describe('my app', function() {

	describe('monthly', function() {

		describe('summary view', function() {

			beforeEach(function() {
				browser.get('');
			});

			it('should automatically redirect to /yearly/summary when location hash/fragment is empty', function() {
				expect(browser.getCurrentUrl()).toBe('http://127.0.0.1/#/years/summary');
			});
		});

		describe('summary view', function() {

			beforeEach(function() {
				browser.get('#/months/summary');
			});

			it('should render summary when user navigates to /summary', function() {
				expect(element(by.id('summary')).isPresent()).toBe(true);
			});

			it('should select summary when user navigates to /summary', function() {
				expect(element(by.model('viewSelection.view')).getAttribute('value')).toMatch(/summary/);
			});
		});

		describe('summary view', function() {

			beforeEach(function() {
				browser.get('#/monthly/summary/?house=0&date=2015-01-01');
			});

			it('should render summary when user navigates to /monthly/summary', function() {
				expect(element(by.id('summary')).isPresent()).toBe(true);
			});

			it('should select summary when user navigates to /summary', function() {
				expect(element(by.model('viewSelection.view')).getAttribute('value')).toMatch(/summary/);
			});

			it('should display 2015 when year option = 2015', function() {
				expect(element(by.model('yearFilter.year')).getAttribute('value')).toMatch(/2015/);
			});
		});

		describe('summary year 2013', function() {

			beforeEach(function() {
				browser.get('#/months/summary?date=2013-12-31');
			});

			it('should select 2013 when year option = 2013', function() {
				expect(element(by.model('yearFilter.year')).getAttribute('value')).toMatch(/2013/);
			});
		});

		describe('summary year 2012', function() {

			beforeEach(function() {
				browser.get('#/months/summary?date=2012-12-31');
			});

			it('should select 2012 when year option = 2012', function() {
				expect(element(by.model('yearFilter.year')).getAttribute('value')).toMatch(/2012/);
			});
		});

		describe('summary date missing', function() {

			beforeEach(function() {
				browser.get('#/months/summary');
			});

			it('should display last available year = 2015', function() {
				// change to 2013 if using 2013 test dev db
				expect(element(by.model('yearFilter.year')).getAttribute('value')).toMatch(/2016/);
			});
		});

		describe('summary date in future', function() {

			beforeEach(function() {
				browser.get('#/months/summary?date=2017-01-01');
			});

			it('should display ?', function() {
				expect(element(by.model('yearFilter.year')).getAttribute('value')).toMatch(/\?/);
			});

			it('should show expected warning message', function() {
				expect(element(by.binding('message')).getText()).toBe("Oops, you've asked for a house, year or interval that is not supported.");
			});
		});

		describe('generation view', function() {

			beforeEach(function() {
				browser.get('#/months/generation');
			});

			it('should render generation when user navigates to /generation', function() {
				expect(element(by.id('generation')).isPresent()).toBe(true);
			});

			it('should select generation when user navigates to /generation', function() {
				expect(element(by.model('viewSelection.view')).getAttribute('value')).toMatch(/generation/);
			});
		});

		describe('usage happy path', function() {

			beforeEach(function() {
				browser.get('#/months/usage?date=2012-12-31');
			});

			it('should render summary when user navigates to /summary', function() {
				expect(element(by.id('usage')).isPresent()).toBe(true);
			});

			it('should render 8 circuits + 1 total row for 9 rows when viewing 2012 data', function() {
				expect(element.all(by.repeater('circuit in data.circuits')).count()).toBe(20);
			});

			it('should not display note 2', function() {
				element.all(by.css('.list-unstyled')).then(function(notes) {
					expect(notes.length).toBe(1);
					expect(notes[0].getText()).toBe('1. Circuit level data starts March 16, 2012');
				});
			});
		});

		describe('usage date missing', function() {

			beforeEach(function() {
				browser.get('#/months/usage');
			});

			it('should not render warning message when date not present', function() {
				expect(element(by.binding('message')).getText()).toBe("");
			});
			// should default to latest year test here...
		});

		describe('usage/ashp date missing', function() {

			beforeEach(function() {
				browser.get('#/months/usage/ashp');
			});

			it('should render usage when user navigates to /usage/ashp', function() {
				expect(element(by.id('usage.ashp')).isPresent()).toBe(true); // doesn't like to test for ids with a dot in them
			});

			it('should not display warning message if date is missing', function() {
				expect(element(by.binding('message')).getText()).toBe("");
			});
		});

		describe('usage/ashp circuit view 2013', function() {

			beforeEach(function() {
				browser.get('#/months/usage/ashp?date=2013-12-31');
			});

			it('should render 12 months of data when viewing 2013 data', function() {
				expect(element.all(by.repeater('month in data.items')).count()).toBe(12);
			});

			it('should NOT display note 1', function() {
				element.all(by.css('.list-unstyled')).then(function(notes) {
					expect(notes.length).toBe(1);
					expect(notes[0].getText()).toBe('2. Projected kWh = 0.4809 x HDD base 60°F \+ 1.237');
				});
			});
		});

		describe('usage/ashp circuit view 2012', function() {

			beforeEach(function() {
				browser.get('#/months/usage/ashp?date=2012-12-31');
			});

			it('should render 10 months of data when viewing 2012 data', function() {
				expect(element.all(by.repeater('month in data.items')).count()).toBe(10);
			});

			it('should display note 1', function() {
				element.all(by.css('.list-unstyled li')).then(function(notes) {
					expect(notes.length).toBe(2);
					expect(notes[0].getText()).toBe('1. Circuit level data starts March 16, 2012');
					expect(notes[1].getText()).toBe('2. Projected kWh = 0.4809 x HDD base 60°F \+ 1.237');
				});
			});

		});

		describe('usage circuit view', function() {

			beforeEach(function() {
				browser.get('#/months/usage/ashp?date=2013-12-31');
				// select year 2012
				element(by.cssContainingText('option', '2012')).click();
			});

			it('should stay on ashp circuit page when year selector changed to 2012', function() {
				browser.getCurrentUrl().then(function(url) {
					var path = url.split('?');
					var search = path[1].split('date=');
					expect(path[0]).toBe('http://127.0.0.1/#/months/usage/ashp');
					expect(search[1]).toBe('2012-12-31');
				});
			});

			it('should render 2012 data when year selector changed to 2012', function() {
				expect(element.all(by.repeater('month in data.items')).count()).toBe(10);
			});

			it('should display note 1', function() {
				element.all(by.css('.list-unstyled li')).then(function(notes) {
					expect(notes.length).toBe(2);
					expect(notes[0].getText()).toBe('1. Circuit level data starts March 16, 2012');
					expect(notes[1].getText()).toBe('2. Projected kWh = 0.4809 x HDD base 60°F \+ 1.237');
				});
			});
		});

		describe('Water 2012', function() {

			beforeEach(function() {
				browser.get('#/months/water?date=2012-12-31');
			});

			it('should render water when user navigates to /water', function() {
				expect(element(by.id('water')).isPresent()).toBe(true);
			});

			it('should display note 1', function() {
				element.all(by.css('.small')).then(function(notes) {
					expect(notes.length).toBe(1);
					expect(notes[0].getText()).toBe('Circuit level data starts March 16, 2012');
				});
			});
		});

		describe('Water 2013', function() {

			beforeEach(function() {
				browser.get('#/months/water?date=2013-12-31');
			});

			it('should render water when user navigates to /water', function() {
				expect(element(by.id('water')).isPresent()).toBe(true);
			});

			it('should NOT display note 1', function() {
				element.all(by.css('.small')).then(function(notes) {
					expect(notes.length).toBe(0);
				});
			});
		});

		describe('Basetemp 2013 no params', function() {

			beforeEach(function() {
				browser.get('#/months/basetemp');
			});

			it('should show /months/ selected', function() {
				expect(element(by.css('input[name="interval"]:checked')).getAttribute('value')).toBe('months');
			});

			it('should display /65/ in the base temp text field', function() {
				expect(element(by.css('input[type="text"]')).getAttribute('value')).toBe('65');
			});
		});

		describe('Basetemp 2013 with params', function() {

			beforeEach(function() {
				browser.get('#/months/basetemp?date=2013-12-31&base=55&interval=days');
			});

			it('should show /days/ selected', function() {
				expect(element(by.css('input[name="interval"]:checked')).getAttribute('value')).toBe('days');
			});

			it('should display /55/ in the base temp text field', function() {
				expect(element(by.css('input[type="text"]')).getAttribute('value')).toBe('55');
			});
		});
	});

});
