/**
 * @author Larry Burks
 */

module.exports = function(grunt) {

	grunt.initConfig({
		dest: process.env.HOMEPERFORMANCE_PUBLISH,
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			my_target: {
				files: {
					'app/<%= pkg.name %>.min.js': ['app/**.js', 'app/hourly/*.js', 'app/daily/*.js', 'app/monthly/*.js', 'app/yearly/*.js', 'app/shared/*.js', '!app/**/*.test.js', 'bower_components/moment/moment.js']
				}
			}
		},
		clean: {
			prod:['<%= dest %>'],
			dev: ['<%= dest %>'],
			post: ['app/<%= pkg.name %>.min.js']
		},
		copy: {
			prod: {
				files: [
				{
					expand: true,
					cwd: 'app/',
					src: ['<%= pkg.name %>.min.js', '**/*.html', '**/*.css', '**/*.gif'],
					dest: '<%= dest %>'
				},
				{
					src: 'node_modules/bootstrap/dist/css/bootstrap.min.css',
					dest: '<%= dest %>shared/bootstrap.min.css'
				}
				]
			},
			test: {
				files : [
				{
					expand: true,
					cwd: 'app/',
					src: ['**/**'],
					dest: '<%= dest %>'
				},
				{
					src: 'test/**',
					dest: '<%= dest %>'
				},
				{
					src: 'node_modules/angular/angular.js',
					dest: '<%= dest %>lib/angular/angular.js'
				},
				{
					src: 'node_modules/angular-route/angular-route.js',
					dest: '<%= dest %>lib/angular/angular-route.js'
				},
				{
					src: 'node_modules/angular-resource/angular-resource.js',
					dest: '<%= dest %>lib/angular/angular-resource.js'
				},
				{
					src: 'node_modules/highcharts/highcharts.src.js',
					dest: '<%= dest %>shared/highcharts.js'
				},
				{
					src: 'node_modules/highcharts/highcharts-more.src.js',
					dest: '<%= dest %>shared/highcharts-more.js'
				},
				{
					src: 'node_modules/bootstrap/dist/css/bootstrap.min.css',
					dest: '<%= dest %>shared/bootstrap.min.css'
				}
				]
			},
			dev: {
				files : [
				{
					expand: true,
					cwd: 'app/',
					src:  ['**/**'],
					dest: '<%= dest %>'
				},
				{
					src: 'test/**',
					dest: '<%= dest %>'
				},
				{
					src: 'node_modules/angular/angular.js',
					dest: '<%= dest %>lib/angular/angular.js'
				},
				{
					src: 'node_modules/angular-route/angular-route.js',
					dest: '<%= dest %>lib/angular/angular-route.js'
				},
				{
					src: 'node_modules/angular-resource/angular-resource.js',
					dest: '<%= dest %>lib/angular/angular-resource.js'
				},
				{
					src: 'node_modules/highcharts/highcharts.src.js',
					dest: '<%= dest %>shared/highcharts.js'
				},
				{
					src: 'node_modules/highcharts/highcharts-more.src.js',
					dest: '<%= dest %>shared/highcharts-more.js'
				},
				{
					src: 'node_modules/moment/moment.js',
					dest: '<%= dest %>shared/moment.js'
				},
				{
					src: 'node_modules/bootstrap/dist/css/bootstrap.min.css',
					dest: '<%= dest %>shared/bootstrap.min.css'
				}
				]
			}
		},
		preprocess: {
			prod : {
				files: {
					'<%= dest %>index.html' : 'app/index.html',
					'<%= dest %>shared/metadata.service.js' : 'app/shared/metadata.service.js'
				},
				options: {
					context: {
						PROD: true
					}
				}
			},
			test : {
				files: {
					'<%= dest %>index.html' : 'app/index.html'
				},
				options: {
					context: {
						TEST: true
					}
				}
			},
			dev : {
				files: {
					'<%= dest %>index.html' : 'app/index.html',
					'<%= dest %>shared/metadata.service.js' : 'app/shared/metadata.service.js'
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
	[
		'clean:prod',
		'uglify',
		'copy:prod',
		'preprocess:prod',
		'clean:post'
	]);

	grunt.registerTask('test',
	[
		'clean:dev',
		'uglify',
		'copy:test',
		'preprocess:test',
		'clean:post'
	]);

	grunt.registerTask('dev',
	[
		'clean:dev',
		'copy:dev',
		'preprocess:dev',
		'clean:post'
	]);

	grunt.registerTask('printenv', function () { console.log(process.env.HOMEPERFORMANCE_PUBLISH); });

};
