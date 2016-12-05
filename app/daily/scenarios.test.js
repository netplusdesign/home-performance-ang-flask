'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('my app', function() {

	describe('daily', function() {

		describe('summary view', function() {

			beforeEach(function() {
				browser.get('#/months/summary?house=0&date=2014-01-01');
			});

			it('should be able to drill from months to days to hours and back to days', function() {
				var monthlink = element.all(by.repeater('month in data.items')).first().element(by.binding('month.date'));
				expect((monthlink).getText()).toMatch(/Jan/);
				monthlink.click();
				// days
				expect(element(by.model('viewSelection.view')).getAttribute('value')).toMatch(/summary/);
				expect(element(by.model('yearFilter.year')).getAttribute('value')).toMatch(/2014/);
				expect(element(by.id('filterc')).isDisplayed()).toBe(false);
				expect(element(by.id('filterl')).isDisplayed()).toBe(false);
				var daylink = element.all(by.repeater('day in data.items')).first().element(by.binding('day.date'));
				expect((daylink).getText()).toMatch(/1/);
				daylink.click();
				// hours
				expect(element(by.model('viewSelection.view')).getAttribute('value')).toMatch(/summary/);
				expect(element(by.model('yearFilter.year')).getAttribute('value')).toMatch(/2014/);
				expect(element(by.id('filterc')).isDisplayed()).toBe(false);
				expect(element(by.id('filterl')).isDisplayed()).toBe(false);
				var hourlink = element.all(by.repeater('hour in data.items')).first().element(by.binding('hour.date'));
				expect((hourlink).getText()).toMatch(/0/);
				// hours
				var alldayslink = element.all(by.tagName('a')).first();
				expect((alldayslink).getText()).toMatch(/Jan 2014/);
				alldayslink.click();
				// days
				var daylink = element.all(by.repeater('day in data.items')).first().element(by.binding('day.date'));
				expect((daylink).getText()).toMatch(/1/);
			});

		});

		describe('generation', function() {

			beforeEach(function() {
				browser.get('#/months/generation?house=0&date=2014-01-01');
			});

			it('should be able to drill from months to days to hours and back to days', function() {
				var monthlink = element.all(by.repeater('month in data.items')).first().element(by.binding('month.date'));
				expect((monthlink).getText()).toMatch(/Jan/);
				monthlink.click();
				// days
				expect(element(by.model('viewSelection.view')).getAttribute('value')).toMatch(/generation/);
				expect(element(by.model('yearFilter.year')).getAttribute('value')).toMatch(/2014/);
				expect(element(by.id('filterc')).isDisplayed()).toBe(false);
				expect(element(by.id('filterl')).isDisplayed()).toBe(false);
				var daylink = element.all(by.repeater('day in data.items')).first().element(by.binding('day.date'));
				expect((daylink).getText()).toMatch(/1/);
				daylink.click();
				// hours
				expect(element(by.model('viewSelection.view')).getAttribute('value')).toMatch(/generation/);
				expect(element(by.model('yearFilter.year')).getAttribute('value')).toMatch(/2014/);
				expect(element(by.id('filterc')).isDisplayed()).toBe(false);
				expect(element(by.id('filterl')).isDisplayed()).toBe(false);
				var hourlink = element.all(by.repeater('hour in data.items')).first().element(by.binding('hour.date'));
				expect((hourlink).getText()).toMatch(/0/);
				// hours
				var alldayslink = element.all(by.tagName('a')).get(1);
				expect((alldayslink).getText()).toMatch(/Jan 2014/);
				alldayslink.click();
				// days
				var daylink = element.all(by.repeater('day in data.items')).first().element(by.binding('day.date'));
				expect((daylink).getText()).toMatch(/1/);
			});

		});

		describe('usage', function() {

			beforeEach(function() {
				browser.get('#/months/summary?house=0&date=2014-01-01');
			});

			it('should be able to drill from months to days to hours and back to days', function() {
				// start at summary, switch to usage via selector
				var selector = element(by.model('viewSelection.view')).all(by.tagName('option')).get(2);
				expect((selector).getAttribute('value')).toMatch(/usage/);
				selector.click();
				// now in usage view
				expect(element(by.model('viewSelection.view')).getAttribute('value')).toMatch(/usage/);
				expect(element(by.model('yearFilter.year')).getAttribute('value')).toMatch(/2014/);
				expect(element(by.id('usage.all')).isPresent()).toBe(true);
				expect(element(by.id('filterc')).isDisplayed()).toBe(true);
				expect(element(by.id('filterl')).isDisplayed()).toBe(false);
				var monthlink = element.all(by.repeater('month in data.items')).first().element(by.binding('month.date'));
				expect((monthlink).getText()).toMatch(/Jan/);
				monthlink.click();
				// days
				expect(element(by.model('viewSelection.view')).getAttribute('value')).toMatch(/usage/);
				expect(element(by.model('yearFilter.year')).getAttribute('value')).toMatch(/2014/);
				expect(element(by.id('filterc')).isDisplayed()).toBe(true);
				expect(element(by.id('filterl')).isDisplayed()).toBe(false);
				var daylink = element.all(by.repeater('day in data.items')).first().element(by.binding('day.date'));
				expect((daylink).getText()).toMatch(/1/);
				daylink.click();
				// hours
				expect(element(by.model('viewSelection.view')).getAttribute('value')).toMatch(/usage/);
				expect(element(by.model('yearFilter.year')).getAttribute('value')).toMatch(/2014/);
				expect(element(by.id('filterc')).isDisplayed()).toBe(true);
				expect(element(by.id('filterl')).isDisplayed()).toBe(false);
				var hourlink = element.all(by.repeater('hour in data.items')).first().element(by.binding('hour.date'));
				expect((hourlink).getText()).toMatch(/0/);
				// hours
				var alldayslink = element.all(by.tagName('a')).get(1);
				expect((alldayslink).getText()).toMatch(/Jan 2014/);
				alldayslink.click();
				// days
				var daylink = element.all(by.repeater('day in data.items')).first().element(by.binding('day.date'));
				expect((daylink).getText()).toMatch(/1/);
			});

		});

		describe('usage', function() {

			beforeEach(function() {
				browser.get('#/days/usage/all?house=0&date=2014-01');
			});

			it('should be able to swith to usage/summary view and have totals match', function() {
				expect(element(by.binding('data.totals.actual')).getText()).toMatch(/1,102.636/);
				var summarylink = element.all(by.tagName('a')).first();
				expect((summarylink).getText()).toMatch(/Circuits/);
				summarylink.click();
				// usage/summary
				var usage = element.all(by.repeater('circuit in data.circuits')).first().element(by.binding('circuit.actual'));
				expect((usage).getText()).toMatch(/1,102.6/);
			});

		});

		describe('temperature', function() {

			beforeEach(function() {
				browser.get('#/months/summary?house=0&date=2014-01-01');
			});

			it('should be able to drill from months to days to hours and back to days', function() {
				// start at summary, switch to usage via selector
				var selector = element(by.model('viewSelection.view')).all(by.tagName('option')).get(3);
				expect((selector).getAttribute('value')).toMatch(/temperature/);
				selector.click();
				// now in temperature view
				expect(element(by.model('viewSelection.view')).getAttribute('value')).toMatch(/temperature/);
				expect(element(by.model('yearFilter.year')).getAttribute('value')).toMatch(/2014/);
				expect(element(by.model('filter.filter.location')).getAttribute('value')).toMatch(/outdoor/);
				expect(element(by.id('temperature')).isPresent()).toBe(true);
				expect(element(by.id('filterc')).isDisplayed()).toBe(false);
				expect(element(by.id('filterl')).isDisplayed()).toBe(true);
				var monthlink = element.all(by.repeater('month in data.items')).first().element(by.binding('month.date'));
				expect((monthlink).getText()).toMatch(/Jan/);
				monthlink.click();
				// days
				expect(element(by.model('viewSelection.view')).getAttribute('value')).toMatch(/temperature/);
				expect(element(by.model('yearFilter.year')).getAttribute('value')).toMatch(/2014/);
				expect(element(by.id('filterc')).isDisplayed()).toBe(false);
				expect(element(by.id('filterl')).isDisplayed()).toBe(true);
				var daylink = element.all(by.repeater('day in data.items')).first().element(by.binding('day.date'));
				expect((daylink).getText()).toMatch(/1/);
				daylink.click();
				// hours
				expect(element(by.model('viewSelection.view')).getAttribute('value')).toMatch(/temperature/);
				expect(element(by.model('yearFilter.year')).getAttribute('value')).toMatch(/2014/);
				expect(element(by.id('filterc')).isDisplayed()).toBe(false);
				expect(element(by.id('filterl')).isDisplayed()).toBe(true);
				var hourlink = element.all(by.repeater('hour in data.items')).first().element(by.binding('hour.date'));
				expect((hourlink).getText()).toMatch(/0/);
				// hours
				var alldayslink = element.all(by.tagName('a')).first();
				expect((alldayslink).getText()).toMatch(/Jan 2014/);
				alldayslink.click();
				// days
				var daylink = element.all(by.repeater('day in data.items')).first().element(by.binding('day.date'));
				expect((daylink).getText()).toMatch(/1/);
			});

		});

	});

});
