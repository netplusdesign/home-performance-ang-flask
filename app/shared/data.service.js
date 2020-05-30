'use strict';

/* Services */

/* global angular */
/* global moment */
/* jshint strict : true */
/* jshint undef : true */
/* jshint unused : true */
/* jshint globalstrict : true */

angular.module( 'myApp.services.data', [] ).

	factory('dataService', [ 'metadataService', function(metadataService) {

		var insertAverage = function (data, props, avg_props) {

			var i, j, d,
			adu,
			daysInMonth,
			daysInYear,
			totalDays = 0;

			if (data.interval === 'year') {
				// years
				for ( j = 0; j < data.items.length; j++ ) {

					d = moment( data.items[j].date );
					if ( d != metadataService.data.asofDate) {
						// assumes all prior years have a full year of data -- bad assumption
						daysInYear = 365;
						if ( moment( data.items[j].date ).isLeapYear() ) { daysInYear++; }

					} else {

						daysInYear = metadataService.getDaysYTD();
					}

					for ( i = 0; i < props.length; i++ ) {

						adu = data.items[j][ props[i] ] / daysInYear;
						data.items[j][ avg_props[i] ] = adu;
					}

					totalDays = totalDays + daysInYear;
				}
			} else {
				// months
				for ( j = 0; j < data.items.length; j++ ) {

					for ( i = 0; i < props.length; i++ ) {

						daysInMonth = moment( data.items[j].date ).daysInMonth();
						adu = data.items[j][ props[i] ] / daysInMonth;
						data.items[j][ avg_props[i] ] = adu;
					}

					totalDays = totalDays + daysInMonth;
				}
			}
			// total
			for ( i = 0; i < props.length; i++ ) {

				adu = data.totals[ props[i] ] / totalDays;
				data.totals[ avg_props[i] ] = adu;
			}
			//console.log(JSON.stringify(data));
			return data;
		},

		insertDiff = function ( data, col1, col2 ) {
			// diff for total line
			var i,
			net = data.totals[col1] - data.totals[col2],
			diff = (net / data.totals[col2]) * 100.0;
			data.totals.net = net.toFixed(0);
			data.totals.diff = diff.toFixed(1);

			// diff for each row
			for ( i = 0; i < data.items.length; i++ ) {
				net = data.items[i][col1] - data.items[i][col2];
				if (parseInt(data.items[i][col2]) == 0) {
					diff = 0; // don't divide by zero
				}
				else {					
					diff = (net / data.items[i][col2]) * 100.0;	
				}
				data.items[i].net = net.toFixed(0);
				data.items[i].diff = diff.toFixed(1);
			}
			return data;
		},

		getProjectedHeatEnergy = function ( hdd, slope, intercept )
		{
			// returns kWh = hdd * slope + intercept
			return hdd * slope + intercept;
		},
		insertProjected = function ( data ) {
			// for total line
			var i;
			data.slope = metadataService.basetemp.slope;
			data.intercept = metadataService.basetemp.intercept;
			data.base = metadataService.basetemp.base;
			data.totals.projected = getProjectedHeatEnergy( data.totals.hdd, data.slope, data.intercept );

			// for each row
			for ( i = 0; i < data.items.length; i++ ) {

				data.items[i].projected = getProjectedHeatEnergy( data.items[i].hdd, data.slope, data.intercept );
			}
			return data;
		},

		maxValueInArray = function ( arr, name, neg ) {

			var i, value, max = 0;

			for ( i = 0; i < arr.length; i++ ) {

				value = parseFloat( arr[i][name] );

				if (neg) {
					if (value < max) { max = value; }
				}
				else {
					if (value > max) { max = value; }
				}
			}
			return max;
		},
		insertPercent = function ( data, arr, name, neg ) {
			// percService.insertPercent( data, 'circuits', 'actual' );
			// search 'name' in 'arr' for bigest value
			var i, value, perc,
			max = maxValueInArray( data[arr], name, neg );
			// calc perc for each item in 'arr'
			for ( i = 0; i < data[arr].length; i++ ) {

				value = parseFloat( data[arr][i][name] );
				perc = (value / max) * 100.0;
				data[arr][i].perc = perc;
			}
			return data;
		},

		insertHeatEfficiency = function ( data ) {
			// calculate Wh/SF/HDD, convert kWh to Wh first.
			data.wh_sf_hdd = (parseFloat(data.totals.ashp_heating_season) * 1000 ) / parseFloat(data.iga) / parseFloat(data.totals.hdd_heating_season);
			// convert kWh to BTU
			data.btu_sf_hdd = (parseFloat(data.totals.ashp_heating_season) * 3412.14163) / parseFloat(data.iga) / parseFloat(data.totals.hdd_heating_season);

			return data;
		},

		insertEfficiency = function ( data ) {
			// for total line
			var i;
			data.totals.water_heater_efficiency = data.totals.water_heater * 1000 / data.totals.hot;
			data.totals.water_pump_efficiency =   data.totals.water_pump * 1000 / data.totals.main;

			// for each month
			for ( i = 0; i < data.items.length; i++ ) {
				data.items[i].water_heater_efficiency = data.items[i].water_heater * 1000 / data.items[i].hot;
				data.items[i].water_pump_efficiency =   data.items[i].water_pump * 1000 / data.items[i].main;
			}
			return data;
		},

		insertLinearRegression = function (data) {

			var i, xr = [], yr = [];

			for( i = 0; i < data.points.length; i++ ) {
				// hdd, ashp - used for linear regression
				xr[i] = parseFloat(data.points[i].hdd);
				yr[i] = parseFloat(data.points[i].ashp);
			}

			data.lr = linearRegression(yr,xr);

			return data;
		},
		linearRegression = function (y,x) {

			var i,
			lr = {},
			n = y.length,
			sum_x = 0,
			sum_y = 0,
			sum_xy = 0,
			sum_xx = 0,
			sum_yy = 0;

			for ( i = 0; i < y.length; i++ ) {
				sum_x += x[i];
				sum_y += y[i];
				sum_xy += (x[i]*y[i]);
				sum_xx += (x[i]*x[i]);
				sum_yy += (y[i]*y[i]);
			}

			lr.slope = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
			lr.intercept = (sum_y - lr.slope * sum_x)/n;
			lr.r2 = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);
			lr.xr = x;

			return lr;
		},

		insertMeasure = function ( data, attrs ) {
			var i, j;
			for ( i = 0; i < attrs.length; i++ ) {
				for ( j = 0; j < data.days.length; j++ ) {
					data.days[j][ attrs[i][0] ].measure = attrs[i][1];
				}
			}
			return data;
		},

		sortChildObjectsByProp = function ( prop, arr ) {
			// used for heatmap legend
			// thanks to http://stackoverflow.com/questions/5073799/how-to-sort-a-javascript-array-of-objects-by-nested-object-property
			prop = prop.split ( '.' );

			var len = prop.length;

			arr.sort ( function ( a, b ) {

				var i = 0;

				while( i < len ) {

					a = a[ prop[ i ] ];

					b = b[ prop[ i ] ];

					i++;
				}
				if ( a < b ) {

					return -1;
				}
				else if ( a > b ) {

					return 1;
				}
				else {

					return 0;
				}
			});
			return arr;
		};

		return {
			insertAverage : insertAverage,
			insertDiff : insertDiff,
			insertProjected : insertProjected,
			insertPercent : insertPercent,
			insertHeatEfficiency : insertHeatEfficiency,
			insertEfficiency : insertEfficiency,
			insertLinearRegression : insertLinearRegression,
			insertMeasure : insertMeasure,
			sortChildObjectsByProp : sortChildObjectsByProp
		};

	}]);
