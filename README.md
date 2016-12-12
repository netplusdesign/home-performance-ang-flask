# home-performance-ang-flask

v 2.0 provides a yearly comparison and consistent drill-down from years to months, days and hours.

home-performance-ang-flask is an AngularJS frontend to view home energy, temperature and water data.

See [home-performance-flask-api](https://github.com/netplusdesign/home-performance-flask-api)

* `master` - works within the Flask framework alongside the api on the same server.
* There was a `gh-pages` branch, a standalone configuration for demo purposes, but Github's mandatory enforcement of HTTPS makes this complicated and expensive.

Working version of master branch at: http://netplusdesign.com/

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

## Standalone UI

To create a version of this app that is not served by Flask...

* Remove all references of 'static/' from index.html and app.js files.
* Flask also uses the {{}} notation for templates. So change the H1 tag content in index.html, from `{{ '{{data.houseName}}' }}` to `{{ data.houseName }}`.
* Place the index.html file in the app folder.
