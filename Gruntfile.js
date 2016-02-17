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
					'app/<%= pkg.name %>.min.js': ['app/**.js', 'app/daily/*.js', 'app/monthly/*.js', 'app/yearly/*.js', 'app/shared/*.js', '!app/**/*.test.js', 'bower_components/moment/moment.js', 'bower_components/chroma-js/chroma.js']
				}
			}
		},
		clean: {
			prod:['<%= dest %>static/', '<%= dest %>templates/'],
			dev: ['<%= dest %>static/', '<%= dest %>templates/'],
			min: ['app/<%= pkg.name %>.min.js']
		},
		copy: {
			prod: {
				files: [
				{
					expand: true,
					cwd: 'app/',
					src: ['<%= pkg.name %>.min.js', '**/*.html', '**/*.css'],
					dest: '<%= dest %>static/'
				},
				{
					src: 'bower_components/bootstrap/dist/css/bootstrap.min.css',
					dest: '<%= dest %>static/shared/bootstrap.min.css'
				}
				]
			},
			test: {
				files : [
				{
					expand: true,
					cwd: 'app/',
					src: ['**/**'],
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
					src: 'bower_components/highcharts/highcharts.src.js',
					dest: '<%= dest %>static/shared/highcharts.js'
				},
				{
					src: 'bower_components/bootstrap/dist/css/bootstrap.min.css',
					dest: '<%= dest %>static/shared/bootstrap.min.css'
				}
				]
			},
			dev: {
				files : [
				{
					expand: true,
					cwd: 'app/',
					src:  ['**/**'],
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
					src: 'bower_components/highcharts/highcharts.src.js',
					dest: '<%= dest %>static/shared/highcharts.js'
				},
				{
					src: 'bower_components/moment/moment.js',
					dest: '<%= dest %>static/shared/moment.js'
				},
				{
					src: 'bower_components/chroma-js/chroma.js',
					dest: '<%= dest %>static/shared/chroma.js'
				},
				{
					src: 'bower_components/bootstrap/dist/css/bootstrap.min.css',
					dest: '<%= dest %>static/shared/bootstrap.min.css'
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
