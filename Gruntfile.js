/**
 * @author Larry Burks
 */

module.exports = function(grunt) {
  
	grunt.initConfig({
		dest: '../home-performance-site/chartingperformance/',
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			my_target: {
				files: {
					'app/js/<%= pkg.name %>.min.js': ['app/js/app.js', 'app/js/controllers.js', 'app/js/services.js', 'app/js/filters.js', 'app/js/directives.js', 'bower_components/moment/moment.js', 'bower_components/chroma-js/chroma.js']
				}
			}
		},
		clean: { 
			prod:['<%= dest %>static/', '<%= dest %>templates/'],
			dev: ['<%= dest %>static/', '<%= dest %>templates/'],
			min: ['app/js/<%= pkg.name %>.min.js']
		},
		copy: {
			prod: {
				files: [
				{
					expand: true,
					cwd: 'app/',
					src: ['js/<%= pkg.name %>.min.js', 'partials/**', 'css/*'],
					dest: '<%= dest %>static/'
				},
				{
					src: 'bower_components/bootstrap/dist/css/bootstrap.min.css',
					dest: '<%= dest %>static/css/bootstrap.min.css' 
				}
				]
			},
			test: {
				files : [
				{
					expand: true,
					cwd: 'app/',
					src: ['js/<%= pkg.name %>.min.js', 'js/standalone-framework.js', 'js/highcharts.js', 'partials/**', 'css/*', 'daily.html'],
					dest: '<%= dest %>static/'
				},
				{
					src: 'test/**',
					dest: '<%= dest %>static/'
				},
				{
					src: 'bower_components/angular/angular.js',
					dest: '<%= dest %>static/lib/angular/angular.js' 
				},
				{
					src: 'bower_components/angular-route/angular-route.js',
					dest: '<%= dest %>static/lib/angular/angular-route.js' 
				},
				{
					src: 'bower_components/angular-resource/angular-resource.js',
					dest: '<%= dest %>static/lib/angular/angular-resource.js' 
				},
				{
					src: 'bower_components/highcharts/index.js',
					dest: '<%= dest %>static/js/highcharts.js' 
				},
				{
					src: 'bower_components/highcharts-standalone-framework/index.js',
					dest: '<%= dest %>static/js/standalone-framework.js' 
				}, 
				{
					src: 'bower_components/bootstrap/dist/css/bootstrap.min.css',
					dest: '<%= dest %>static/css/bootstrap.min.css' 
				}
				]
			},
			dev: {
				files : [
				{
					expand: true,
					cwd: 'app/',
					src:  ['js/*', 'partials/**', 'css/*', 'daily.html'],
					dest: '<%= dest %>static/' 
				},
				{
					src: 'test/**',
					dest: '<%= dest %>static/' 
				},
				{
					src: 'bower_components/angular/angular.js',
					dest: '<%= dest %>static/lib/angular/angular.js' 
				},
				{
					src: 'bower_components/angular-route/angular-route.js',
					dest: '<%= dest %>static/lib/angular/angular-route.js' 
				},
				{
					src: 'bower_components/angular-resource/angular-resource.js',
					dest: '<%= dest %>static/lib/angular/angular-resource.js' 
				},
				{
					src: 'bower_components/highcharts/index.js',
					dest: '<%= dest %>static/js/highcharts.js' 
				},
				{
					src: 'bower_components/highcharts-standalone-framework/index.js',
					dest: '<%= dest %>static/js/standalone-framework.js' 
				},
				{
					src: 'bower_components/moment/moment.js',
					dest: '<%= dest %>static/js/moment.js' 
				},
				{
					src: 'bower_components/chroma-js/chroma.js',
					dest: '<%= dest %>static/js/chroma.js' 
				}, 
				{
					src: 'bower_components/bootstrap/dist/css/bootstrap.min.css',
					dest: '<%= dest %>static/css/bootstrap.min.css' 
				}
				]
			}
		},
		preprocess: {
			prod : {
				files: {
					'<%= dest %>templates/index.html' : 'app/index.html'
				},
				options: {
					context: {
						PROD: true
					}
				}
			},
			test : {
				files: {
					'<%= dest %>templates/index.html' : 'app/index.html'
				},
				options: {
					context: {
						TEST: true
					}
				}
			},
			dev : {
				files: {
					'<%= dest %>templates/index.html' : 'app/index.html'
				},
				options: {
					context: {
						DEV: true
					}
				}
			}
		}
	});

	// Load the plugins
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-preprocess');

	// Default task(s).
	grunt.registerTask('default', ['uglify']);

	// Defined tasks
	grunt.registerTask('prod', 
	[   'clean:prod',
		'uglify', 
		'copy:prod',
		'preprocess:prod',
		'clean:min'
	]);

	grunt.registerTask('test', 
	[   'clean:dev',
		'uglify',    
		'copy:test',
		'preprocess:test',
		'clean:min'
	]);

	grunt.registerTask('dev', 
	[   'clean:dev', 
		'copy:dev',
		'preprocess:dev',
		'clean:min'
	]);

};