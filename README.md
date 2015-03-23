# charting-performance-ang-flask

Converted [home-performance-ang](https://github.com/netplusdesign/home-performance-ang) to use a new REST API built with [Flask](http://flask.pocoo.org). 

See [home-performance-flask-api](https://github.com/netplusdesign/home-performance-flask-api)

There are 2 branches.

* `master` - is a standalone angular frontend that can live on any server. Used mainly for testing.
* `integrate-with-flask` - is modified to work within the Flask framework and can operate alongside the api on the same server.

See working prototype of `integrated-with-flask` at: http://netplusdesign.com/

## Requires

* AngularJS
* Momentjs
* Highcharts
* Chroma
* Bootstrap

First get Node, Grunt and Bower.

Then clone this repo and run:

* npm install
* bower install

Edit grunt file (devDest) path, then run:

* grunt dev

## Test

* npm test
* npm run protractor

## What's next

* Refactor!