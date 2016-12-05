'use strict';

/* Services */

/* global angular */
/* global moment */
/* global chroma */
/* global Highcharts */
/* jshint strict : true */
/* jshint undef : true */
/* jshint unused : true */
/* jshint globalstrict : true */

angular.module( 'myApp.services.chart', [] ).

	factory('chartService', [ '$window', 'metadataService', function ( $window, metadataService ) {

		Highcharts.setOptions({
			colors: ['#336699', '#669933', '#CC9933', '#CC3333', '#663366', '#999999', '#336699', '#669966']
		});

		var charts = [],

		chartTemplate = {

			chart : {
				renderTo : 'view1'
			},
			credits: {
				enabled: false
			},
			legend: {
				enabled: true,
				borderWidth: 0
			},
			title : {
				text : 'Monthly',
				style : {
					fontSize: '13px'
				}
			},
			xAxis : {
				categories : [],
				title : {
					text : '',
					style: {
						color: '#000000',
						fontWeight: 'normal',
						fontSize: '10px'
					}
				}
			},
			yAxis : [{
				title : {
					text : 'kWh',
					style: {
						color: '#000000',
						fontWeight: 'normal',
						fontSize: '10px'
					},
					rotation: -90
				}
			}],
			plotOptions: {
				column: {
					dataLabels: {
						enabled: false,
						align: 'center',
						color: '#FFFFFF',
						y: 16
					}
				},
				series: {
					enableMouseTracking: true,
					pointPadding: 0,
					groupPadding: 0.05,
					borderWidth: 0,
					shadow: false
				}
			}
			//series : []
		},

		putSeriesData = function ( options, data ) {

			var i, j;

			if ((!data.items) && (data.years.length > 0)) {

				for ( i = 0; i < data.years.length; i++ ) {

					options.xAxis.categories.push( moment( data.years[ i ].date ).format( 'YYYY' ) );

					for ( j = 0; j < options.series.length; j++ ) {

						options.series[ j ].data.push( Math.round( data.years[ i ][ options.series[ j ].name.toLowerCase() ] ) );
					}
				}

			} else {
				for ( i = 0; i < data.items.length; i++ ) {

					options.xAxis.categories.push( moment( data.items[ i ].date ).format( 'MMM' ) );

					for ( j = 0; j < options.series.length; j++ ) {

						options.series[ j ].data.push( Math.round( data.items[ i ][ options.series[ j ].name.toLowerCase() ] ) );
					}
				}
			}
			return options;
		},

		showDangerIfUsingMoreThanProducing = function ( category, colors, used, solar ) {

			if (( category == 'Solar' ) && ( Math.abs( used ) > Math.abs( solar ) )) {
				return colors.danger;
			}
			else {
				return colors[ category ];
			}
		},
		showUsageVsGen = function ( data ) {

			var i, colors = { 'Used' : '#336699', 'Solar' : '#669933', 'danger' : '#DF0101' },
			options = angular.copy ( chartTemplate );
			options.title.text = 'Usage vs. Generation';
			options.legend.enabled = false;
			options.plotOptions.column.dataLabels.enabled = true;
			options.series = [ { type: 'column', data : [] } ];
			options.xAxis.categories = [ 'Used', 'Solar' ];

			for ( i = 0; i < options.xAxis.categories.length; i++ ) {

				options.series[0].data.push({
					y : Math.round( Math.abs ( data.totals[ options.xAxis.categories[ i ].toLowerCase() ] ) ),
					color : showDangerIfUsingMoreThanProducing( options.xAxis.categories[ i ], colors, data.totals.used, data.totals.solar )
				}); // if usage > solar then danger, danger! (change color of solar to red)
			}

			return new Highcharts.Chart ( options );
		},

		showSummaryYTD = function ( data ) {

			var options = angular.copy( chartTemplate );
			options.chart.renderTo = 'view2';
			options.yAxis.push( angular.copy( options.yAxis[0] ) );
			options.yAxis[1].title.text = 'HDD';
			options.yAxis[1].title.rotation = 90;
			options.yAxis[1].opposite = true;
			options.yAxis[1].min = 0;
			options.series = [
				{ name : 'Used', type: 'column', data : [] },
				{ name : 'Solar', type: 'column', data : [] },
				{ name : 'Net', type: 'column', data : [] },
				{ name : 'HDD', type: 'line', data : [], yAxis : 1 }
			];

			return new Highcharts.Chart ( putSeriesData( options, data ) );
		},

		showGenerationYTD = function ( data ) {

			var options = angular.copy ( chartTemplate );
			options.series = [
				{ name : 'Actual', type: 'column', data : [] },
				{ name : 'Estimated', type: 'column', data : [] },
				{ name : 'Net', type: 'column', data : [] }
			];

			return new Highcharts.Chart ( putSeriesData( options, data ) );
		},

		showUsageCircuits = function ( data ) {

			var i, options = angular.copy ( chartTemplate );
			options.title.text = 'Usage by circuit';
			options.tooltip = {
				pointFormat: '{series.name}: <b>{point.y} kWh</b>',
				percentageDecimals: 1
			};
			options.plotOptions = {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						color: '#000000',
						connectorColor: '#000000',
						formatter: function() {
							if(this.y < 0.1){
								return null;
							}
							else {
								return '<b>'+ this.point.name +'</b>: '+ Math.round(this.percentage) +' %';
							}
						}
					}
				}
			};
			options.series = [ { type: 'pie', data : [] } ];

			for ( i = 1; i < data.circuits.length; i++ )
			{
				options.series[0].data.push( { name : data.circuits[i].name, y : parseFloat( data.circuits[i].actual ) } );
			}

			return new Highcharts.Chart (options);
		},

		showUsageYTD = function ( data ) {

			var options = angular.copy ( chartTemplate );
			options.title.text = data.circuit.name;
			options.series = [
				{ name : 'Actual', type: 'column', data : [] }
			];

			switch ( data.circuit.circuit_id ) {
				case 'ashp' :
					options.series.push( { name : 'Projected', type: 'column', data : [] } );
					options.series.push( { name : 'Net', type: 'column', data : [] } );
					break;
				case 'all' :
					options.series.push( { name : 'Budget', type: 'column', data : [] } );
					options.series.push( { name : 'Net', type: 'column', data : [] } );
			}

			return new Highcharts.Chart ( putSeriesData( options, data ) );
		},

		showHddYTD = function ( data ) {

			var options = angular.copy ( chartTemplate );
			options.yAxis[0].title.text = 'HDD';
			options.series = [
				{ name : 'Actual', type: 'column', data : [] },
				{ name : 'Estimated', type: 'column', data : [] },
				{ name : 'Net', type: 'column', data : [] }
			];

			return new Highcharts.Chart ( putSeriesData( options, data ) );
		},

		showWaterYTD = function ( data ) {

			var options = angular.copy ( chartTemplate );
			options.title.text = 'Monthly Breakdown';
			options.yAxis.push( angular.copy( options.yAxis[0] ) );
			options.yAxis[0].title.text = 'Gallons';
			options.yAxis[0].labels = { format : '{value:,.0f}' };
			options.yAxis[0].max = 4000;
			options.yAxis[1].title.text = 'Wh/gal';
			options.yAxis[1].title.rotation = 90;
			options.yAxis[1].opposite = true;
			options.yAxis[1].min = 0;
			options.series = [
				{ name : 'Cold', type: 'column', data : [] },
				{ name : 'Hot', type: 'column', color : '#CC3333', data : [] },
				{ name : 'Water_heater', type : 'line', color : '#CC3333', data : [], yAxis : 1 }
			];

			return new Highcharts.Chart ( putSeriesData( options, data ) );
		},

		showWaterMainYTD = function ( data ) {

			var options = angular.copy ( chartTemplate );
			options.chart.renderTo = 'view2';
			options.title.text = 'Monthly Total Usage';
			options.yAxis[0].title.text = 'Gallons';
			options.yAxis[0].labels = { format : '{value:,.0f}' };
			options.yAxis[0].max = 4000;
			options.series = [
				{ name : 'Main', type: 'area', data : [] }
			];

			return new Highcharts.Chart ( putSeriesData( options, data ) );
		},

		showBaseTemp = function ( data ) {

			var i, d, dt, tm,
			options = angular.copy ( chartTemplate );
			options.chart.renderTo = 'view1';
			options.chart.height = 400;
			options.zoomType = 'x';
			options.title.text = 'Correlating HDD with Heating energy';
			delete options.xAxis.categories;
			options.xAxis.title.text = 'HDD';
			options.plotOptions = {
				series: {
					turboThreshold : 0,
					point: {
						events: {
							click: function() {
								if (this.date) {
									dt = moment( this.date, ['MMM, YYYY', 'MMM d, YYYY', 'MMM d, YYYY h a'] );
									tm = (data.interval === 'hours') ? '&time=' + dt.format('HH') : '';
									$window.location = '#/daily/usage/ashp?date=' + dt.format('YYYY-MM-DD') + tm;
								}
							}
						}
					}
				},
				scatter: {
					marker: {
						radius: 5
					},
					states: {
						hover: {
							lineWidth: 0,
							marker: {
								enabled: false
							}
						}
					},
					tooltip: {
						pointFormat: '<b>Date: {point.date}</b><br/>HDD: {point.x}<br/>ASHP: {point.y} kWh<br/>Solar: {point.solar} kWh'
					}
				}
			};
			options.series = [
				{ name : 'Data point', type : 'scatter', color : 'rgba(223, 83, 83, .5)', data : [] },
				{ name : 'Regression Line', type : 'line', color : '#336699', data : [] }
			];

			for( i = 0; i < data.points.length; i++ ) {

				d = moment( data.points[i].date, ['YYYY-MM-DD', 'YYYY-MM-DD hh:mm:ss'] );
				if ( data.interval === 'hour' ) { dt = d.format( 'MMM D, YYYY h a' ); }
				if ( data.interval === 'day' ) { dt = d.format( 'MMM D, YYYY' ); }
				if ( data.interval === 'month' ) { dt = d.format( 'MMM, YYYY' ); }

				options.series[0].data.push({
					date  : dt,
					ashp  : data.points[ i ].ashp,
					solar : data.points[ i ].solar,
					x : parseFloat( data.points[ i ].hdd ),
					y : parseFloat( data.points[ i ].ashp )
				});
			}

			var start_x = Math.min.apply( Math, data.lr.xr );
			var start_y = data.lr.slope * start_x + data.lr.intercept;
			var end_x = Math.max.apply( Math, data.lr.xr );
			var end_y = data.lr.slope * end_x + data.lr.intercept;

			options.series[1].data.push( [ start_x, start_y ], [ end_x, end_y ] );

			return new Highcharts.Chart ( options );
		},

		setData = function ( view, data ) {

			while ( charts.length > 0 ) {
				charts.pop().destroy();
			}

			switch( view ) {
				case "summary":
					charts.push( showUsageVsGen ( data ) );
					charts.push( showSummaryYTD ( data ) );
					break;
				case "generation":
					charts.push( showGenerationYTD ( data ) );
					break;
				case "usage":
					charts.push( showUsageCircuits ( data ) );
					break;
				case "circuit":
					charts.push( showUsageYTD ( data ) );
					break;
				case "hdd":
					charts.push( showHddYTD ( data ) );
					break;
				case "water":
					charts.push( showWaterYTD ( data ) );
					charts.push( showWaterMainYTD ( data ) );
					break;
				case "basetemp":
					charts.push( showBaseTemp ( data ) );
					break;
			}
		};

		return {
			setData : setData
		};

	}]);
