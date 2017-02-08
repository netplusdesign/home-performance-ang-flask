'use strict';

/* Services */

/* global angular */
/* global moment */
/* jshint strict : true */
/* jshint undef : true */
/* jshint unused : true */
/* jshint globalstrict : true */

angular.module( 'myApp.services.metadata', [] ).

	factory( 'metadataService', [ function() {

		// eventually this will come from the database
		var locations = [ 'outdoor', 'firstfloor', 'secondfloor', 'basement' ];

		var basetemp = {
			slope: 0.4809,
			intercept: 1.237,
			base: 60  // default for calculating ashp usage projected values
		};

		var data = {};
		data.houseId = false;
		data.chartDate = false; // stored as string
		data.asofDate = false;
		data.years = false;
		data.location = 0; // default for temperature view
		data.filter = {};

		//var apiUrl = 'http://127.0.0.1:5000/api/';
		//var apiUrl = 'http://lburks.pythonanywhere.com/api/';
		//var apiUrl = 'http://netplusdesign.com/api/';
		var apiUrl = 'https://api.netplusdesign.net/api/';

		var current = {};
		current.filter = {};

		var setHouse = function ( house ) {

			if ( house && ( typeof house !== undefined ) ) {
				// check if switching houses
				if (( data.houseId > -1 ) && ( house != data.houseId )) {

					data.asofDate = false; // will force metadata reload
				}
				data.houseId = house;
			}
			else if ( !data.houseId ) {

				data.houseId = '0'; // default if house param is not passed in URL
			}
			return data.houseId;
		},
		setDate = function ( dt ) {

			if (dt && ( typeof dt !== undefined )) {

				data.chartDate = moment( dt, 'YYYY-MM-DD' ).format( 'YYYY-MM-DD' ); // defaults date of month to 01 if missing

				if (data.interval != 'years') {

					current.year = moment( data.chartDate, 'YYYY-MM-DD' ).format( 'YYYY' );
				}
			}
			return data.chartDate;
		},
		setCircuit = function ( path, circuit ) {

			if ( typeof circuit !== undefined ) {

				data.circuit = circuit;
				data.filter.circuit = circuit;
			}
			current.filter.circuit = circuit;
			return data.circuit;
		},
		setLocation = function ( path, location ) {

			if ( typeof location !== undefined ) {
				// location = outdoor etc.
				for (var i = 0; i < locations.length; i++) {
					if (locations[i] == location) data.location = i;
				}
				data.filter.location = location;
			}
			current.filter.location = locations[ data.location ];
			return data.location;
		},
		setPeriod = function ( period ) {
			// do more validation here in future
			// and maybe store value if return
			if ( typeof period === undefined ) {

				period = 'months';
			}
			return period;
		},
		setBase = function ( base ) {
			// do more validation here in future
			// and maybe store value if return
			if ( typeof base === undefined ) {

				base = basetemp.base;
			}
			return base;
		},
		setInterval = function ( str ) {

			data.interval = str;
			return str;
		},
		setDuration = function ( str ) {

			if (str == 'hours') {
				str = '1day';
			}
			else if (str == 'days') {
				str = '1month';
			}
			else if (str == 'months') {
				str = '1year';
			}
			else if (str == 'years') {
				str = '';
			}
			return str;
		},
		setStart = function ( dt, interval ) {

			var start = moment( dt, 'YYYY-MM-DD' ); // .format( 'YYYY-MM-DD' );

			if (interval == 'days') {
				//set start to first of month
				start = start.startOf('month').format( 'YYYY-MM-DD' );
			}
			else if (interval == 'months') {
				//set date to first day of year
				start = start.startOf('year').format( 'YYYY-MM-DD' );
			}
			else if (interval == 'years') {
				//set duration to ''
				start = '';
			}
			else {
				start = start.format( 'YYYY-MM-DD' );
			}
			return start;
		},
		validate = function ( routeParams ) {

			var options = { params : {} };
			options.view = routeParams.view;

			current.view = routeParams.view;

			options.url = apiUrl + 'houses/' + setHouse( routeParams.house ) + '/views/' + routeParams.view + '/';

			options.params.interval = setInterval( routeParams.path );

			// view dependent params
			if ( options.view == 'usage' ) {

				options.params.circuit = setCircuit( routeParams.path, routeParams.filter );

				if (routeParams.filter == 'ashp') {

					options.params.base = setBase( routeParams.base );
				}
			}
			if ( options.view == 'temperature' ) {

				options.params.location = setLocation( routeParams.path, routeParams.filter );
			}
			if ( options.view == 'basetemp' ) {

				options.params.interval = setPeriod( routeParams.interval );

				options.params.base = setBase( routeParams.base );
			}

			options.params.duration = setDuration( routeParams.path );
			options.params.date = setDate( routeParams.date );
			options.params.start = setStart( options.params.date, options.params.interval );
			options.method = 'GET';
			return options;
		},
		// 2 methods used by navCtrl
		setParamYear = function ( yr ) {
			if (yr != 'ALL') {

				data.chartDate = moment( data.chartDate ).year( parseInt(yr) ).format('YYYY-MM-DD');  // update date
			}
			current.year = yr;
		},
		setParamFilter = function ( which, filter ) {
			// filter could be a circuit name or a temperature location name
			if (which == 'circuit') {
				data.filter.circuit = filter;
			}
			else {
				data.filter.location = filter;
			}
		},
		// gets called after validate
		setMetadata = function ( d ) {

			data.houseName = d.house.name;

			data.asofDate = moment(d.asof, 'YYYY-MM-DD').format('YYYY-MM-DD');

			data.years = d.years;

			data.years.unshift('ALL');

			if ( !data.chartDate ) {
				data.chartDate = data.asofDate;
			}

			if (data.interval == 'years') {
				current.year = 'ALL';
			}
			else {
				current.year = moment( data.chartDate, 'YYYY-MM-DD' ).format('YYYY'); // set default year selector
			}
		},
		// need days year to date to calculate avarage per day values
		// if chart year > asof year then return false (can't show data that does not exist)
		// if chart year (2013) == asof year (2013) then use asof date (else assume it is a prior year)
		// else if leap year use chart year and divide by 366
		// else use chart year and divide by 365
		getDaysYTD = function () {

			var daysInYear,
			asof = moment(data.asofDate),
			chart = moment(data.chartDate);

			if (( chart.year() > asof.year() ) || ( chart.year() < data.years[1] )) {

				return false;
			}
			if ( asof.year() == chart.year() ) {

				daysInYear = asof.dayOfYear();
			}
			else if ( chart.isLeapYear() ) { // date in a past year

				daysInYear = 366;
			}
			else {

				daysInYear = 365;
			}
			return daysInYear;
		};

		return {
			locations : locations,
			basetemp : basetemp,
			data : data,
			current : current,                   // used by navCtrl to set state of nav options
			setStart : setStart,                 // temp workaround
			setInterval : setInterval,           // temp workaround
			validate : validate,                 // used by dataProvider
			setParamYear : setParamYear,         // called from navCtrl when user selects a year
			setParamFilter : setParamFilter,     // called from navCtrl when user selects a filter
			setMetadata : setMetadata,           // used by navCtrl, phase this out?
			getDaysYTD : getDaysYTD,             // utility method
			apiUrl : apiUrl
		};

	}]);
