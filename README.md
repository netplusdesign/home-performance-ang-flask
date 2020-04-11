# home-performance-ang-flask

v 2.0 provides a yearly comparison and consistent drill-down from years to months, days and hours.

home-performance-ang-flask is an AngularJS frontend to view home energy, temperature and water data.

See [home-performance-flask-api](https://github.com/netplusdesign/home-performance-flask-api)

This is now simply a standalone version of the frontend. It can not be served from the Flash development server. Use your web server of choice to serve this app.

Working version of master branch at: http://netplusdesign.com/

I'm running this via Vagrant on Ubuntu 18.04.

## Requires

* AngularJS
* Momentjs
* Highcharts
* Bootstrap

First get Node and Grunt.

Then clone this repo and run:

* `npm install`

Edit grunt file (devDest) path, or set en environmental variable.

* `export HOMEPERFORMANCE_PUBLISH=/vagrant/html/`

Then run:

* `grunt dev`

Don't forget `--force` if deploying outside the parent folder.

## Test

### Unit tests

* `npm test`

### End to end

* `webdriver-manager start`
* `npm run protractor` or `protractor test/protractor.conf.js`
