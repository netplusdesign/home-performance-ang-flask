# home-performance-ang-flask

v 2.0 provides a yearly comparison and consistent drill-down from years to months, days and hours.

home-performance-ang-flask is an AngularJS frontend to view home energy, temperature and water data.

See [home-performance-flask-api](https://github.com/netplusdesign/home-performance-flask-api)

There are 2 branches.

* `master` - works within the Flask framework alongside the api on the same server.
* `gh-pages` - is a standalone angular frontend that can live on any server. Used mainly for testing.

Working version of master branch at: http://netplusdesign.com/

Working version of `gh-pages` branch at: http://netplusdesign.github.io/home-performance-ang-flask/dist/app/

## Requires

* AngularJS
* Momentjs
* Highcharts
* Bootstrap

First get Node, Grunt and Bower.

Then clone this repo and run:

* `npm install`
* `bower install`

Edit grunt file (devDest) path, then run:

* `grunt dev`

## Test

### Unit tests

* `npm test`

### End to end

* `webdriver-manager start`
* `npm run protractor` or `protractor test/protractor.conf.js`
