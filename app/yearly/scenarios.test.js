'use strict';

describe('my app', function() {

	describe('yearly', function() {

		describe('summary view', function() {

			beforeEach(function() {
				browser.get('#/years/summary');
			});

			it('should render summary, show summary selected and display all years when user navigates to /years/summary', function() {
				expect(element(by.id('summary')).isPresent()).toBe(true);
				expect(element(by.model('viewSelection.view')).getAttribute('value')).toMatch(/summary/);
				expect(element(by.model('yearFilter.year')).getAttribute('value')).toMatch(/ALL/);
				expect(element(by.id('filterc')).isDisplayed()).toBe(false);
				expect(element(by.id('filterl')).isDisplayed()).toBe(false);
			});

			it('year selector should diplay ALL when user navigates to /summary, drills down to 2012 then back up via ALL link', function() {
				var yearlink = element.all(by.repeater('year in data.items')).first().element(by.binding('year.date'));
				expect((yearlink).getText()).toMatch(/2012/);
				yearlink.click();
				expect(element(by.model('viewSelection.view')).getAttribute('value')).toMatch(/summary/);
				expect(element(by.model('yearFilter.year')).getAttribute('value')).toMatch(/2012/);
				var allyearslink = element.all(by.tagName('a')).first();
				expect((allyearslink).getText()).toMatch(/ALL/);
				allyearslink.click();
				expect(element(by.model('viewSelection.view')).getAttribute('value')).toMatch(/summary/);
				expect(element(by.model('yearFilter.year')).getAttribute('value')).toMatch(/ALL/);
			});

			it('year selector should diplay ALL when user navigates to /summary, drills down to 2014 then back up via selecting ALL in year selector', function() {
				var yearlink = element.all(by.repeater('year in data.items')).get(2).element(by.binding('year.date'));
				expect((yearlink).getText()).toMatch(/2014/);
				yearlink.click();
				expect(element(by.model('viewSelection.view')).getAttribute('value')).toMatch(/summary/);
				expect(element(by.model('yearFilter.year')).getAttribute('value')).toMatch(/2014/);
				var yearfilter = element.all(by.options('year for year in data.years track by year'));
				expect(yearfilter.get(3).isSelected()).toBe(true); // same as previous expect
				yearfilter.first().click();
				expect(element(by.model('viewSelection.view')).getAttribute('value')).toMatch(/summary/);
				expect(element(by.model('yearFilter.year')).getAttribute('value')).toMatch(/ALL/);
			});

		});

		describe('generation view', function() {

			beforeEach(function() {
				browser.get('#/years/generation');
			});

			it('should render generation, show generation selected and display all years when user navigates to /years/generation', function() {
				expect(element(by.id('generation')).isPresent()).toBe(true);
				expect(element(by.model('viewSelection.view')).getAttribute('value')).toMatch(/generation/);
				expect(element(by.model('yearFilter.year')).getAttribute('value')).toMatch(/ALL/);
				expect(element(by.id('filterc')).isDisplayed()).toBe(false);
				expect(element(by.id('filterl')).isDisplayed()).toBe(false);
			});

		});

		describe('usage/all view', function() {

			beforeEach(function() {
				browser.get('#/years/usage/all');
			});

			it('should render usage/all, show usage selected, display all years and filter circuit = all when user navigates to /years/usage/all', function() {
				expect(element(by.id('usage.all')).isPresent()).toBe(true);
				expect(element(by.model('viewSelection.view')).getAttribute('value')).toMatch(/usage/);
				expect(element(by.model('yearFilter.year')).getAttribute('value')).toMatch(/ALL/);
				expect(element(by.model('filter.filter.circuit')).getAttribute('value')).toMatch(/all/);
				expect(element(by.id('filterc')).isDisplayed()).toBe(true);
				expect(element(by.id('filterl')).isDisplayed()).toBe(false);
			});

			it('year selector should diplay ALL when user navigates to /usage/all, drills down to 2012 then back up via ALL link', function() {
				var yearlink = element.all(by.repeater('year in data.items')).first().element(by.binding('year.date'));
				expect((yearlink).getText()).toMatch(/2012/);
				yearlink.click();
				expect(element(by.model('viewSelection.view')).getAttribute('value')).toMatch(/usage/);
				expect(element(by.model('yearFilter.year')).getAttribute('value')).toMatch(/2012/);
				expect(element(by.model('filter.filter.circuit')).getAttribute('value')).toMatch(/all/);
				var allyearslink = element.all(by.tagName('a')).get(1);
				expect((allyearslink).getText()).toMatch(/ALL/);
				allyearslink.click();
				expect(element(by.model('viewSelection.view')).getAttribute('value')).toMatch(/usage/);
				expect(element(by.model('yearFilter.year')).getAttribute('value')).toMatch(/ALL/);
				expect(element(by.model('filter.filter.circuit')).getAttribute('value')).toMatch(/all/);
			});

		});

		describe('usage/summary view', function() {

			beforeEach(function() {
				browser.get('#/years/usage/summary');
			});

			it('should render usage/summary, show usage selected, display all years and filter circuit = summary when user navigates to /years/usage/summary', function() {
				expect(element(by.id('usage.summary')).isPresent()).toBe(true);
				expect(element(by.model('viewSelection.view')).getAttribute('value')).toMatch(/usage/);
				expect(element(by.model('yearFilter.year')).getAttribute('value')).toMatch(/ALL/);
				expect(element(by.model('filter.filter.circuit')).getAttribute('value')).toMatch(/summary/);
				expect(element(by.id('filterc')).isDisplayed()).toBe(true);
				expect(element(by.id('filterl')).isDisplayed()).toBe(false);
			});

			it('year selector should diplay ALL when user navigates to /usage/summary, switches to circuit filter all, drills down to 2012, switches back to circuit summary then back up via ALL link', function() {
				// usage/summary
				var link = element.all(by.tagName('a')).first();
				expect((link).getText()).toMatch(/Time series/);
				link.click();
				// usage/all
				expect(element(by.model('viewSelection.view')).getAttribute('value')).toMatch(/usage/);
				expect(element(by.model('yearFilter.year')).getAttribute('value')).toMatch(/ALL/);
				expect(element(by.model('filter.filter.circuit')).getAttribute('value')).toMatch(/all/);
				var yearlink = element.all(by.repeater('year in data.items')).first().element(by.binding('year.date'));
				expect((yearlink).getText()).toMatch(/2012/);
				yearlink.click();
				// usage/all 2012
				expect(element(by.model('viewSelection.view')).getAttribute('value')).toMatch(/usage/);
				expect(element(by.model('yearFilter.year')).getAttribute('value')).toMatch(/2012/);
				expect(element(by.model('filter.filter.circuit')).getAttribute('value')).toMatch(/all/);
				// check 2012 total value
				expect(element(by.binding('data.totals.actual')).getText()).toMatch(/5,601/);
				link = element.all(by.tagName('a')).first();
				expect((link).getText()).toMatch(/Circuits/);
				link.click();
				// usage/summary 2012
				expect(element(by.model('viewSelection.view')).getAttribute('value')).toMatch(/usage/);
				expect(element(by.model('yearFilter.year')).getAttribute('value')).toMatch(/2012/);
				expect(element(by.model('filter.filter.circuit')).getAttribute('value')).toMatch(/summary/);
				// check 2012 total value
				var total = element.all(by.repeater('circuit in data.circuits')).first().element(by.binding('circuit.actual'));
				expect((total).getText()).toMatch(/3,757/);
				var allyearslink = element.all(by.tagName('a')).get(1);
				expect((allyearslink).getText()).toMatch(/ALL/);
				allyearslink.click();
				// usage/summary all
				expect(element(by.model('viewSelection.view')).getAttribute('value')).toMatch(/usage/);
				expect(element(by.model('yearFilter.year')).getAttribute('value')).toMatch(/ALL/);
				expect(element(by.model('filter.filter.circuit')).getAttribute('value')).toMatch(/summary/);
			});

		});

		describe('usage/ashp view', function() {

			beforeEach(function() {
				browser.get('#/years/usage/ashp');
			});

			it('should render usage/ashp, show usage selected, display all years and filter circuit = ashp when user navigates to /years/usage/ashp', function() {
				expect(element(by.id('usage.ashp')).isPresent()).toBe(true);
				expect(element(by.model('viewSelection.view')).getAttribute('value')).toMatch(/usage/);
				expect(element(by.model('yearFilter.year')).getAttribute('value')).toMatch(/ALL/);
				expect(element(by.model('filter.filter.circuit')).getAttribute('value')).toMatch(/ashp/);
				expect(element(by.id('filterc')).isDisplayed()).toBe(true);
				expect(element(by.id('filterl')).isDisplayed()).toBe(false);
				var actual = element.all(by.repeater('year in data.items')).get(1).element(by.binding('year.actual'));
				expect((actual).getText()).toMatch(/1,196/);
			});

		});

		describe('temperature view', function() {

			beforeEach(function() {
				browser.get('#/years/temperature');
			});

			it('should render temperature, show temperature selected, and display all years when user navigates to /years/temperature', function() {
				expect(element(by.id('temperature')).isPresent()).toBe(true);
				expect(element(by.model('viewSelection.view')).getAttribute('value')).toMatch(/temperature/);
				expect(element(by.model('yearFilter.year')).getAttribute('value')).toMatch(/ALL/);
				expect(element(by.model('filter.filter.location')).getAttribute('value')).toMatch(/outdoor/);
				expect(element(by.id('filterc')).isDisplayed()).toBe(false);
				expect(element(by.id('filterl')).isDisplayed()).toBe(true);
				var hdd = element.all(by.repeater('year in data.items')).first().element(by.binding('year.sum_hdd'));
				expect((hdd).getText()).toMatch(/4,759.8/);
			});

			it('should render temperature, show temperature selected, and display all years when user navigates to /years/temperature, drills down to 2012, then back up vial ALL link', function() {
				var yearlink = element.all(by.repeater('year in data.items')).first().element(by.binding('year.date'));
				expect((yearlink).getText()).toMatch(/2012/);
				yearlink.click();
				// 2012
				expect(element(by.id('temperature')).isPresent()).toBe(true);
				expect(element(by.model('viewSelection.view')).getAttribute('value')).toMatch(/temperature/);
				expect(element(by.model('yearFilter.year')).getAttribute('value')).toMatch(/2012/);
				expect(element(by.model('filter.filter.location')).getAttribute('value')).toMatch(/outdoor/);
				expect(element(by.id('filterc')).isDisplayed()).toBe(false);
				expect(element(by.id('filterl')).isDisplayed()).toBe(true);
				expect(element(by.binding('data.totals.sum_hdd')).getText()).toMatch(/4,759.8/);
				// switch to firstfloor
				var loclink = element(by.model('filter.filter.location')).all(by.tagName('option')).get(2);
				expect((loclink).getAttribute('value')).toMatch(/firstfloor/);
				loclink.click();
				// firstfloor
				expect(element(by.model('yearFilter.year')).getAttribute('value')).toMatch(/2012/);
				expect(element(by.model('filter.filter.location')).getAttribute('value')).toMatch(/firstfloor/);
				var allyearslink = element.all(by.tagName('a')).first();
				expect((allyearslink).getText()).toMatch(/ALL/);
				allyearslink.click();
				// firstfloor all
				expect(element(by.model('viewSelection.view')).getAttribute('value')).toMatch(/temperature/);
				expect(element(by.model('yearFilter.year')).getAttribute('value')).toMatch(/ALL/);
				expect(element(by.model('filter.filter.location')).getAttribute('value')).toMatch(/firstfloor/);
			});

		});

		describe('water view', function() {

			beforeEach(function() {
				browser.get('#/years/water');
			});

			it('should render water, show water selected, and display all years when user navigates to /years/water', function() {
				expect(element(by.id('water')).isPresent()).toBe(true);
				expect(element(by.model('viewSelection.view')).getAttribute('value')).toMatch(/water/);
				expect(element(by.model('yearFilter.year')).getAttribute('value')).toMatch(/ALL/);
				expect(element(by.id('filterc')).isDisplayed()).toBe(false);
				expect(element(by.id('filterl')).isDisplayed()).toBe(false);
				var main = element.all(by.repeater('year in data.items')).first().element(by.binding('year.main'));
				expect((main).getText()).toMatch(/23,160/);
			});

		});

		describe('basetemp view', function() {

			beforeEach(function() {
				var t = browser.get('#/years/basetemp');
				browser.wait(t, 45 * 1000, 'Data should return within 45 seconds');
			});
			// test takes 20 seconds
			it('should render basetemp, show basetemp selected, and display all years when user navigates to /years/basetemp', function() {
				expect(element(by.id('basetemp')).isPresent()).toBe(true);
				expect(element(by.model('viewSelection.view')).getAttribute('value')).toMatch(/basetemp/);
				expect(element(by.model('yearFilter.year')).getAttribute('value')).toMatch(/ALL/);
				expect(element(by.id('filterc')).isDisplayed()).toBe(false);
				expect(element(by.id('filterl')).isDisplayed()).toBe(false);
				var main = element.all(by.repeater('point in data.points')).get(2).element(by.binding('point.ashp'));
				expect((main).getText()).toMatch(/1,615/);
			});

		});

	});

});
