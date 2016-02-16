# charting-performance-ang-flask

Converted [home-performance-ang](https://github.com/netplusdesign/home-performance-ang) to use a new REST API built with [Flask](http://flask.pocoo.org).

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
* Chroma
* Bootstrap

First get Node, Grunt and Bower.

Then clone this repo and run:

* `npm install`
* `bower install`

Edit grunt file (devDest) path, then run:

* `grunt dev`

## Test

* `npm test`
* `npm run protractor` or `protractor test/protractor.conf.js` if you followed the directions at [Protractor](https://angular.github.io/protractor/#/)

## What's next

* Refactor!
