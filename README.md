# charting-performance-ang-flask

Converted [home-performance-ang](https://github.com/netplusdesign/home-performance-ang) to use a new REST API built with [Flask](http://flask.pocoo.org). 

See [home-performance-flask](https://github.com/netplusdesign/home-performance-flask)

See working prototype at: http://netplusdesign.com/app2/  (if you get an error it's because the server fell asleep. Hit refresh, all should be fine.)

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