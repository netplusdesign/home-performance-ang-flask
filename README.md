# home-performance-ang-flask

v 2.0 provides a yearly comparison and consistent drill-down from years to months, days and hours.

home-performance-ang-flask is an AngularJS frontend to view home energy, temperature and water data.

Working version of master branch at: http://netplusdesign.com/

I'm running this via Vagrant on Ubuntu 18.04.

## Requires

* [home-performance-flask-api](https://github.com/netplusdesign/home-performance-flask-api)
* AngularJS
* Momentjs
* Highcharts
* Bootstrap

First get Node.

Then clone this repo and run:

* `npm install`
* `grunt dev`

## Test

I'm running this via a Vagrant box, so all tests run in a headless browser via xvfb.

### Unit tests

* `npm run test`

### End to end

Make sure the backend is up before running these tests.

* `webdriver-manager start`
* `npm run test-e2e` or `protractor test/protractor.conf.js`
