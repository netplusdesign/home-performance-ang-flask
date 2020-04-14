/**
 * @author Larry Burks
 */

module.exports = function(grunt) {

	grunt.initConfig({
		dest: 'site/',
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			my_target: {
				files: {
					'<%= dest %>static/<%= pkg.name %>.min.js': ['app/**.js', 'app/hourly/*.js', 'app/daily/*.js', 'app/monthly/*.js', 'app/yearly/*.js', 'app/shared/*.js', 'node_modules/moment/moment.js', '!app/**/*.test.js']
				}
			}
		},
		clean: {
			prod:['<%= dest %>static/', '<%= dest %>templates/'],
			dev: ['<%= dest %>static/', '<%= dest %>templates/'],
			temp: ['app/shared/metadata.service.js'],
			post: ['<%= dest %>static/index.html', 'app/shared/metadata.service.js.javascript']
		},
		copy: {
			prod: {
				files: [
				{
					expand: true,
					cwd: 'app/',
					src: ['<%= pkg.name %>.min.js', '**/*.html', '**/*.css', '**/*.gif'],
					dest: '<%= dest %>static/'
				},
				{
					src: 'node_modules/bootstrap/dist/css/bootstrap.min.css',
					dest: '<%= dest %>static/shared/bootstrap.min.css'
				},
				{
					src: 'app/shared/metadata.service.js',
					dest: 'app/shared/metadata.service.js.javascript'
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
					src: 'node_modules/angular/angular.js',
					dest: '<%= dest %>static/lib/angular/angular.js'
				},
				{
					src: 'node_modules/angular-route/angular-route.js',
					dest: '<%= dest %>static/lib/angular/angular-route.js'
				},
				{
					src: 'node_modules/angular-resource/angular-resource.js',
					dest: '<%= dest %>static/lib/angular/angular-resource.js'
				},
				{
					src: 'node_modules/highcharts/highcharts.src.js',
					dest: '<%= dest %>static/shared/highcharts.js'
				},
				{
					src: 'node_modules/highcharts/highcharts-more.src.js',
					dest: '<%= dest %>static/shared/highcharts-more.js'
				},
				{
					src: 'node_modules/bootstrap/dist/css/bootstrap.min.css',
					dest: '<%= dest %>static/shared/bootstrap.min.css'
				},
				{
					src: 'app/shared/metadata.service.js',
					dest: 'app/shared/metadata.service.js.javascript'
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
					src: 'node_modules/angular/angular.js',
					dest: '<%= dest %>static/lib/angular/angular.js'
				},
				{
					src: 'node_modules/angular-route/angular-route.js',
					dest: '<%= dest %>static/lib/angular/angular-route.js'
				},
				{
					src: 'node_modules/angular-resource/angular-resource.js',
					dest: '<%= dest %>static/lib/angular/angular-resource.js'
				},
				{
					src: 'node_modules/highcharts/highcharts.src.js',
					dest: '<%= dest %>static/shared/highcharts.js'
				},
				{
					src: 'node_modules/highcharts/highcharts-more.src.js',
					dest: '<%= dest %>static/shared/highcharts-more.js'
				},
				{
					src: 'node_modules/moment/moment.js',
					dest: '<%= dest %>static/shared/moment.js'
				},
				{
					src: 'node_modules/bootstrap/dist/css/bootstrap.min.css',
					dest: '<%= dest %>static/shared/bootstrap.min.css'
				}
				]
			},
			post: {
				files: [
				{
					src: 'app/shared/metadata.service.js.javascript',
					dest: 'app/shared/metadata.service.js'
				}
				]
			}
		},
		preprocess: {
			prod : {
				files: {
					'<%= dest %>templates/index.html' : 'app/index.html',
					'app/shared/metadata.service.js' : 'app/shared/metadata.service.js.javascript'
				},
				options: {
					context: {
						PROD: true
					}
				}
			},
			test : {
				files: {
					'<%= dest %>templates/index.html' : 'app/index.html',
					'app/shared/metadata.service.js' : 'app/shared/metadata.service.js.javascript'
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
	[
		'clean:prod',
		'copy:prod',
		'clean:temp',
		'preprocess:prod',
		'uglify',
		'copy:post',
		'clean:post'
	]);

	grunt.registerTask('test',
	[
		'clean:dev',
		'copy:test',
		'clean:temp',
		'preprocess:test',
		'uglify',
		'copy:post',
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
