'use strict';

/* Services */

/* global angular */
/* global moment */
/* global Highcharts */
/* jshint strict : true */
/* jshint undef : true */
/* jshint unused : true */
/* jshint globalstrict : true */

angular.module( 'myApp.services.metadata', [] ).

	factory( 'metadataService', [ function() {

		var data = {};
		data.houseId = false;
		data.chartDate = false; // stored as string
		data.asofDate = false;
		data.years = false;
		data.circuit = 'summary'; // default view for usage screen
		data.ashp_calculation_base = 50; // default for calculating ashp usage projected values

		var apiUrl = 'http://127.0.0.1:5000/api/';
		//var apiUrl = 'http://lburks.pythonanywhere.com/api/';
		//var apiUrl = 'http://netplusdesign.com/api/';

		var current = {},
		limits = { range : {} }, // for hourly chart

		setHouse = function ( house ) {

			if ( house && ( typeof house !== 'undefined' ) ) {
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

			if (dt && ( typeof dt !== 'undefined' )) {

				data.chartDate = moment( dt, 'YYYY-MM-DD' ).format( 'YYYY-MM-DD' ); // defaults date of month to 01 if missing

				current.year = moment( data.chartDate, 'YYYY-MM-DD' ).format( 'YYYY' );
			}
			return data.chartDate;
		},
		setCircuit = function ( path, circuit ) {

			if ( typeof circuit !== 'undefined' ) {

				data.circuit = circuit;

				if ( path == 'daily' ) {

					current.view = current.view + '/' + circuit;
				}
			}
			return data.circuit;
		},
		setPeriod = function ( period ) {
			// do more validation here in future
			// and maybe store value if return
			if ( typeof period === 'undefined' ) {

				period = 'months';
			}
			return period;
		},
		setBase = function ( base ) {
			// do more validation here in future
			// and maybe store value if return
			if ( typeof base === 'undefined' ) {

				base = 65;
			}
			return base;
		},
		setInterval = function ( str ) {

			if (str == 'hourly') {
				str = 'hours';
			}
			else if (str == 'daily') {
				str = 'days';
			}
			else if (str == 'monthly') {
				str = 'months';
			}
			else {
				str = 'years';
			}
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
			// used for navigation
			current.view = routeParams.path + '/' + routeParams.view;

			if (routeParams.path == 'daily') {
				options.url = apiUrl + 'houses/' + setHouse( routeParams.house ) + '/views/heatmap/';
			}
			else {
				options.url = apiUrl + 'houses/' + setHouse( routeParams.house ) + '/views/' + routeParams.view + '/';
			}

			options.params.interval = setInterval( routeParams.path );

			// view dependent params
			if ( options.view == 'usage' ) {

				options.params.circuit = setCircuit( routeParams.path, routeParams.circuit );
				if (routeParams.circuit == 'ashp') {
					options.params.base = data.ashp_calculation_base;
				}
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

		// 3 methods used by navCtrl
		setParamYear = function ( yr ) {
			if (yr != 'ALL') {

				data.chartDate = moment( data.chartDate ).year( parseInt(yr) ).format('YYYY-MM-DD');  // update date
			}
			current.year = yr;
		},
		setMetadata = function ( d ) {
			// gets called after validate
			data.asofDate = moment(d.asof, 'YYYY-MM-DD').format('YYYY-MM-DD');

			data.years = d.years;

			data.years.unshift('ALL');

			data.houseName = d.house.name;

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
		setDailyMetadata = function ( d ) {
			// gets called after validate
			// used for chart to set min and max of y axes
			limits.kwh_max = d.limits.used_max;
			limits.kwh_min = d.limits.solar_min;
			limits.deg_max = d.limits.outdoor_deg_max;
			limits.deg_min = d.limits.outdoor_deg_min;
			limits.hdd_max = d.limits.hdd_max;
			limits.hdd_min = 0;
			// used for calendar month limits
			limits.range = { startDate : d.limits.start_date, endDate : d.limits.end_date };
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
			data : data,					//
			current : current,				// used by navCtrl to set state of nav options
			limits : limits,				// used by dataProvider and chartService - daily
			setStart : setStart,				// temp workaround
			validate : validate,			// used by dataProvider
			setParamYear : setParamYear,	// called from navCtrl when user selects a year
			setMetadata : setMetadata,		// used by navCtrl, phase this out?
			setDailyMetadata : setDailyMetadata,	// used by calendar and hourly chart
			getDaysYTD : getDaysYTD,			// utility method
			apiUrl : apiUrl
		};

	}]);
