'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('my app', function() {

	describe('daily', function() {

    describe('summary', function() {

      beforeEach(function() {
        browser.get('#/hours/summary?house=0&date=2014-01-01');
      });

      it('should be able to display summary view', function() {
        expect(element(by.id('summary')).isPresent()).toBe(true);
        expect(element(by.model('viewSelection.view')).getAttribute('value')).toMatch(/summary/);
				expect(element(by.model('yearFilter.year')).getAttribute('value')).toMatch(/2014/);
				expect(element(by.id('filterc')).isDisplayed()).toBe(false);
				expect(element(by.id('filterl')).isDisplayed()).toBe(false);
        expect(element(by.binding('data.totals.used')).getText()).toMatch(/36.489/);
      });

    });

    describe('generation', function() {

      beforeEach(function() {
        browser.get('#/hours/generation?house=0&date=2014-01-01');
      });

      it('should be able to display generation view', function() {
        expect(element(by.id('generation')).isPresent()).toBe(true);
        expect(element(by.model('viewSelection.view')).getAttribute('value')).toMatch(/generation/);
				expect(element(by.model('yearFilter.year')).getAttribute('value')).toMatch(/2014/);
				expect(element(by.id('filterc')).isDisplayed()).toBe(false);
				expect(element(by.id('filterl')).isDisplayed()).toBe(false);
        expect(element(by.binding('data.totals.actual')).getText()).toMatch(/-14.455/);
      });

    });

    describe('usage', function() {

      beforeEach(function() {
        browser.get('#/hours/usage/all?house=0&date=2014-01-01');
      });

      it('should be able to swith to usage/summary view and have totals match', function() {
        expect(element(by.id('usage.all')).isPresent()).toBe(true);
        expect(element(by.binding('data.totals.actual')).getText()).toMatch(/36.489/);
        var summarylink = element.all(by.tagName('a')).first();
        expect((summarylink).getText()).toMatch(/Circuits/);
        summarylink.click();
        // usage/summary
        expect(element(by.id('usage.summary')).isPresent()).toBe(true);
        var usage = element.all(by.repeater('circuit in data.circuits')).first().element(by.binding('circuit.actual'));
        expect((usage).getText()).toMatch(/36.489/);
      });

    });

    describe('temperature', function() {

      beforeEach(function() {
        browser.get('#/hours/temperature/outdoor?house=0&date=2014-01-01');
      });

      it('should be able to display temperature view', function() {
        expect(element(by.id('temperature')).isPresent()).toBe(true);
        expect(element(by.model('viewSelection.view')).getAttribute('value')).toMatch(/temperature/);
				expect(element(by.model('yearFilter.year')).getAttribute('value')).toMatch(/2014/);
        expect(element(by.model('filter.filter.location')).getAttribute('value')).toMatch(/outdoor/);
				expect(element(by.id('filterc')).isDisplayed()).toBe(false);
				expect(element(by.id('filterl')).isDisplayed()).toBe(true);
        expect(element(by.binding('data.totals.avg_temperature')).getText()).toMatch(/16.2/);
      });

    });

  });

});
